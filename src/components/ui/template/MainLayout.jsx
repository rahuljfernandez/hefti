import React from 'react';

import { Outlet } from 'react-router-dom';
import HeftiNavbar from '../molecule/heftiNavbar';
import Footer from '../molecule/footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeftiNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
