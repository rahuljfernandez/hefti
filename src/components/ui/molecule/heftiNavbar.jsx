import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '../molecule/navbar';
import Logo from '../../../assets/logo';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

/**
 * This component is based on Application UI Navbars Simple and customized for design.
 */
/**
 *  Svg's are used to get control of fill property that is out of reach when using Heroicons
 */

/*TODO setup links to pages from nav*/

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'About', href: '#', current: false },
  { name: 'Contact Us', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function HeftiNavbar() {
  return (
    <div className="bg-background-navbar">
      <div className="mx-auto max-w-7xl">
        <Disclosure>
          <Navbar className="">
            <Link to="/" aria-label="Home">
              <div className="flex items-center px-6">
                <Logo className="block h-full" />
                <span className="text-core-white ml-2 hidden text-xs leading-3.5 font-semibold tracking-widest italic md:block">
                  HEALTH ECONOMICS FINANCING & <br />
                  TRANSPARENCY INITIATIVE
                </span>
              </div>
            </Link>
            <NavbarSpacer />
            <NavbarSection className="p-5">
              <div className="p-1 leading-none md:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 18"
                    fill="white"
                    preserveAspectRatio="none"
                    className="block h-6 w-8 group-data-open:hidden"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 3.5Zm0 5.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 5.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 18"
                    fill="white"
                    preserveAspectRatio="none"
                    className="hidden h-6 w-8 group-data-open:block"
                  >
                    <g transform="scale(1.2) translate(-1.5, -3)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.714 4.715a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.715a.75.75 0 11-1.06-1.06l4.714-4.715-4.714-4.714a.75.75 0 010-1.06z"
                      />
                    </g>
                  </svg>
                </DisclosureButton>
              </div>
              <NavbarItem
                href="/about"
                aria-label="About"
                className="text-core-white hidden md:block md:p-0.75"
              >
                About
              </NavbarItem>
              <NavbarDivider className="hidden md:block" />
              <NavbarItem
                href="/contact-us"
                aria-label="Contact Us"
                className="text-core-white hidden md:block md:p-0.75"
              >
                Contact Us
              </NavbarItem>
            </NavbarSection>
          </Navbar>

          {/* Dropdown panel BELOW navbar */}
          <DisclosurePanel className="border-t border-zinc-700 bg-zinc-900 md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current
                      ? 'text-core-white bg-zinc-800'
                      : 'hover:text-core-white text-gray-300 hover:bg-zinc-700',
                    'text-label-base block rounded-md px-3 py-2',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  );
}
