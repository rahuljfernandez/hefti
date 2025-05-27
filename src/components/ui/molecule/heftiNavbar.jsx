import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '../molecule/navbar';
// import Logo from '../../../assets/logo';
import Logo from '../../../assets/logo';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

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
    <Disclosure>
      <Navbar className="bg-zinc-900">
        <Link to="/" aria-label="Home">
          <div className="flex items-center p-6">
            <Logo className="block h-full" />
            <span className="text-core-white ml-2 hidden text-xs leading-3.5 font-bold md:block">
              HEALTH ECONOMICS FINANCING & <br />
              TRANSPARENCY INITIATIVE
            </span>
          </div>
        </Link>
        <NavbarSpacer />
        <NavbarSection className="p-6">
          <NavbarItem className="md:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
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
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </NavbarItem>
          <NavbarItem
            href="/about"
            aria-label="About"
            className="text-core-white hidden md:block"
          >
            About
          </NavbarItem>
          <NavbarDivider className="hidden md:block" />
          <NavbarItem
            href="/contact-us"
            aria-label="Contact Us"
            className="text-core-white hidden md:block"
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
  );
}
