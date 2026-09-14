import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AccessGateModal from './accessGateModal';
import {
  clearAccessToken,
  hasAccessSession,
  isAccessGateEnabled,
  isPublicPath,
  setAccessToken,
} from '../../../lib/accessGate';

const AccessGateContext = createContext(null);

export function useAccessGate() {
  const value = useContext(AccessGateContext);
  if (!value) {
    throw new Error('useAccessGate must be used within AccessGateProvider');
  }
  return value;
}

export function AccessGateProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const enabled = isAccessGateEnabled();
  const [hasAccess, setHasAccess] = useState(() =>
    enabled ? hasAccessSession() : true,
  );
  const [open, setOpen] = useState(false);
  const [nextPath, setNextPath] = useState('/nursing-homes');

  const openGate = useCallback(
    (path = '/nursing-homes') => {
      if (!enabled || hasAccess) {
        navigate(path);
        return;
      }
      setNextPath(path || '/nursing-homes');
      setOpen(true);
    },
    [enabled, hasAccess, navigate],
  );

  useEffect(() => {
    if (!enabled || hasAccess) return;
    const params = new URLSearchParams(location.search);
    const queued = params.get('next');
    if (location.pathname === '/' && queued) {
      setNextPath(queued);
      setOpen(true);
    }
  }, [enabled, hasAccess, location.pathname, location.search]);

  useEffect(() => {
    if (!enabled || hasAccess) return undefined;

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = event.target.closest?.('a[href]');
      if (!anchor) return;
      let url;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (isPublicPath(url.pathname)) return;
      event.preventDefault();
      openGate(`${url.pathname}${url.search}${url.hash}`);
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [enabled, hasAccess, openGate]);

  const onVerified = useCallback(
    ({ token, exp }) => {
      setAccessToken(token, exp);
      setHasAccess(true);
      setOpen(false);
      const destination = nextPath && nextPath !== '/' ? nextPath : '/nursing-homes';
      const params = new URLSearchParams(location.search);
      if (location.pathname === '/' && params.has('next')) {
        params.delete('next');
        const search = params.toString();
        navigate(`${destination}${search ? `?${search}` : ''}`, { replace: true });
        return;
      }
      navigate(destination);
    },
    [location.pathname, location.search, navigate, nextPath],
  );

  const value = useMemo(
    () => ({
      enabled,
      hasAccess,
      openGate,
      signOut: () => {
        clearAccessToken();
        setHasAccess(false);
        navigate('/');
      },
    }),
    [enabled, hasAccess, navigate, openGate],
  );

  return (
    <AccessGateContext.Provider value={value}>
      {children}
      {enabled ? (
        <AccessGateModal
          open={open}
          nextPath={nextPath}
          onClose={() => setOpen(false)}
          onVerified={onVerified}
        />
      ) : null}
    </AccessGateContext.Provider>
  );
}

AccessGateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function RequireAccess() {
  const { enabled, hasAccess } = useAccessGate();
  const location = useLocation();

  if (!enabled || hasAccess || isPublicPath(location.pathname)) {
    return <Outlet />;
  }

  const next = `${location.pathname}${location.search}`;
  return <Navigate to={`/?next=${encodeURIComponent(next)}`} replace />;
}
