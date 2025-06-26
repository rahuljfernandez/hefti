import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/ui/template/MainLayout';
import Home from './pages/Home';
import Sandbox from './pages/Sandbox';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Facilities from './pages/Facilities';
import Owners from './pages/Owners';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="sandbox" element={<Sandbox />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="owners" element={<Owners />} />
      </Route>
    </Routes>
  );
}

export default App;
