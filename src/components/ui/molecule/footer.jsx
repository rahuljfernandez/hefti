import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/logo';
import { useIsMobile } from '../../../hooks/useIsMobile';

/**
 * Component is sourced from Marketing/Page Sections/ 4-column with company mission on dark
 * Removed significant amount of the stock code for our simplier layout
 * Added tokens
 * Mobile grid-1-col/ md: grid-col-3 lg:grid-col-5
 */

const navigation = {
  solutions: [
    { name: 'CMS Data', updated: 'Updated on May 5 2025' },
    { name: 'HEFTI Data', updated: 'Updated on May 5 2025' },
  ],
  legal: [
    { name: 'Terms of service' },
    { name: 'Public Disclosures' },
  ],
};

export default function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer className="bg-background-footer">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
          <div className="md:col-span-2 md:grid">
            <Link to="/" aria-label="Home" className="focus-ring-light rounded-lg">
              <div className="flex items-center">
                {isMobile ? (
                  <Logo className="block h-full" />
                ) : (
                  <>
                    <Logo className="block h-full" />
                    <span className="text-core-white ml-2 text-xs leading-3.5 font-semibold tracking-widest italic">
                      HEALTH ECONOMICS FINANCING & <br />
                      TRANSPARENCY INITIATIVE
                    </span>
                  </>
                )}
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2 xl:mt-0">
            <div className="md:grid md:gap-8">
              <div>
                <h3 className="text-paragraph-base text-core-white font-semibold">
                  Data Sources
                </h3>
                <ul role="list" className="mt-6 space-y-4 md:mt-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <span className="text-paragraph-base text-content-tertiary">
                        {item.name} <br />
                        <span className="italic"> {item.updated}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:gap-8">
              <div className="md:mt-0">
                <h3 className="text-paragraph-base text-core-white font-semibold">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4 md:mt-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <span className="text-paragraph-base text-content-tertiary">
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
