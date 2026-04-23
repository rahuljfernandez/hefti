import React from 'react';

import { Outlet } from 'react-router-dom';
import HeftiNavbar from '../molecule/heftiNavbar';
import Footer from '../molecule/footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-md"
      >
        Skip to main content
      </a>
      <HeftiNavbar />
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
