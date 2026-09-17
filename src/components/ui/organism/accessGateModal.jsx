import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../molecule/dialog';
import { Button } from '../atom/button';
import { Field, Label, ErrorMessage } from '../molecule/fieldset';
import { Input } from '../atom/input';
import { API_BASE_URL, apiFetch } from '../../../lib/apiClient';
import { isEduGovEmail } from '../../../lib/accessGate';

function messageFromResponse(payload, fallback) {
  if (payload && typeof payload.error === 'string' && payload.error) {
    return payload.error;
  }
  return fallback;
}

export default function AccessGateModal({
  open,
  onClose,
  onVerified,
  nextPath,
}) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!open) return;
    setStep('email');
    setCode('');
    setError('');
    setResendAt(0);
  }, [open]);

  useEffect(() => {
    if (!open || resendAt <= Date.now()) return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [open, resendAt]);

  async function sendCode() {
    setError('');
    if (!isEduGovEmail(email)) {
      setError('Only .edu and .gov email addresses are currently allowed.');
      return false;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/auth/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          messageFromResponse(payload, 'Could not send an access code.'),
        );
        return false;
      }
      setResendAt(Date.now() + 30_000);
      return true;
    } catch {
      setError('Could not send an access code. Try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function requestCode(event) {
    event.preventDefault();
    const sent = await sendCode();
    if (sent) setStep('code');
  }

  async function verifyCode(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          messageFromResponse(
            payload,
            'That code is incorrect or has expired.',
          ),
        );
        return;
      }
      onVerified(payload);
    } catch {
      setError('Could not verify that code. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} size="md">
      {step === 'email' ? (
        <form onSubmit={requestCode}>
          <DialogTitle>Request access</DialogTitle>
          <DialogDescription>
            HEFTI is currently limited to <strong>.edu</strong> and{' '}
            <strong>.gov</strong> email addresses. Enter yours and we will send
            a one-time code.
          </DialogDescription>
          <DialogBody>
            <Field>
              <Label>Work email</Label>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@agency.gov"
              />
              {error ? <ErrorMessage>{error}</ErrorMessage> : null}
            </Field>
          </DialogBody>
          <DialogActions>
            <Button type="button" plain onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit" color="blue" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send code'}
            </Button>
          </DialogActions>
        </form>
      ) : (
        <form onSubmit={verifyCode}>
          <DialogTitle>Check your email</DialogTitle>
          <DialogDescription>
            We sent a 6-digit code to <strong>{email}</strong>. It expires in 10
            minutes.
          </DialogDescription>
          <DialogBody>
            <Field>
              <Label>Access code</Label>
              <Input
                type="text"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="000000"
              />
              {error ? <ErrorMessage>{error}</ErrorMessage> : null}
            </Field>
          </DialogBody>
          <DialogActions>
            <Button
              type="button"
              plain
              onClick={() => {
                setStep('email');
                setError('');
              }}
            >
              Use a different email
            </Button>
            <Button
              type="button"
              outline
              disabled={submitting || resendAt > now}
              onClick={sendCode}
            >
              {resendAt > now
                ? `Resend in ${Math.ceil((resendAt - now) / 1000)}s`
                : 'Resend'}
            </Button>
            <Button type="submit" color="blue" disabled={submitting}>
              {submitting ? 'Verifying…' : 'Continue'}
            </Button>
          </DialogActions>
          {nextPath && nextPath !== '/' ? (
            <p className="text-paragraph-sm text-content-secondary mt-4">
              After you verify, we will take you to {nextPath}.
            </p>
          ) : null}
        </form>
      )}
    </Dialog>
  );
}

AccessGateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVerified: PropTypes.func.isRequired,
  nextPath: PropTypes.string,
};
