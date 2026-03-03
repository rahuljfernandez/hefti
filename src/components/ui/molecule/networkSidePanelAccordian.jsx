import React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { title } from 'framer-motion/client';

/**
 * Reusable collapsible section used in the network graph UI.
 *
 * Purpose:
 * - Provides a consistent accordion shell for side-panel sections and graph filters
 * - Wraps Headless UI `Disclosure` with shared layout and styling
 *
 * Usage:
 * - Pass a `title` for the section header
 * - Pass `children` for the expandable content
 * - Use `defaultOpen` when a section should start expanded
 */

export default function NetworkSidePanelSection({
  title,
  defaultOpen = false,
  children,
}) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="bg-border-secondary border-border-primary min-h-14 border-t border-b">
          <DisclosureButton className="flex w-full items-center justify-between px-4 py-3 text-left">
            <span className="text-core-black text-paragraph-base">{title}</span>
            <ChevronDownIcon
              className={`h-5 w-5 text-zinc-700 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </DisclosureButton>

          <DisclosurePanel className="">{children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
NetworkSidePanelSection.propTypes = {
  title: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool,
  children: PropTypes.node,
};
