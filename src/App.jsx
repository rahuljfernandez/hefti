import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/ui/template/MainLayout';
import Home from './pages/Home';
import Sandbox from './pages/Sandbox';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Facilities from './pages/Facilities';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="sandbox" element={<Sandbox />} />
        <Route path="facilities" element={<Facilities />} />
      </Route>
    </Routes>
  );
}

export default App;
