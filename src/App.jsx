import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/ui/template/MainLayout';
import Home from './pages/Home';
import Sandbox from './pages/Sandbox';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Facilities from './pages/Facilities';
import Owners from './pages/Owners';
import OwnersProfile from './pages/OwnersProfile';
import FacilityProfile from './pages/FacilityProfile';
import StatesProfile from './pages/StatesProfile';
import HeftiResearch from './pages/HeftiResearch';
import LandingPage from './pages/LandingPage';
import Rankings from './pages/Rankings';
import Acquisitions from './pages/Acquisitions';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ui/molecule/scrollToTop';

/* Product routes moved under /nursing-homes; these keep links shared before the
   move working, slug and query string intact. */
const LEGACY_PRODUCT_PATHS = [
  'facilities',
  'owners',
  'acquisitions',
  'rankings',
  'states',
];

function LegacyProductRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`/nursing-homes${pathname}${search}${hash}`} replace />;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="nursing-homes">
            <Route index element={<Home />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="facilities/:slug" element={<FacilityProfile />} />
            <Route
              path="facilities/:slug/research"
              element={<HeftiResearch />}
            />
            <Route path="owners" element={<Owners />} />
            <Route path="owners/:slug" element={<OwnersProfile />} />
            <Route path="owners/:slug/research" element={<HeftiResearch />} />
            <Route path="acquisitions" element={<Acquisitions />} />
            <Route path="states/:state" element={<StatesProfile />} />
            <Route path="rankings/:type" element={<Rankings />} />
          </Route>
          <Route path="landing" element={<Navigate to="/" replace />} />
          {LEGACY_PRODUCT_PATHS.map((path) => (
            <Route
              key={path}
              path={`${path}/*`}
              element={<LegacyProductRedirect />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
