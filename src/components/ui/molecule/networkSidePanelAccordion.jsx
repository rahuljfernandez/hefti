import React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import clsx from 'clsx';

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
 *
 */

export default function NetworkSidePanelAccordion({
  title,
  icon,
  defaultOpen = false,
  children,
  variant = 'desktop',
}) {
  const isMobile = variant === 'mobile';
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div
          className={clsx(
            'min-h-14 border-t border-b',
            isMobile
              ? 'border-border-inverse-primary bg-zinc-900'
              : 'bg-border-secondary border-border-primary',
          )}
        >
          <DisclosureButton
            className={clsx(
              'flex w-full items-center justify-between px-4 py-3 text-left hover:cursor-pointer',
              isMobile ? 'focus-panel-dark' : 'focus-panel-light',
            )}
          >
            <span
              className={clsx(
                'text-paragraph-base flex items-center gap-1',
                isMobile ? 'text-core-white' : 'text-core-black',
              )}
            >
              {icon}
              <span>{title}</span>
            </span>
            <ChevronDownIcon
              className={clsx(
                'h-5 w-5 transition-transform',
                open && 'rotate-180',
                isMobile ? 'text-content-tertiary' : 'text-zinc-700',
              )}
            />
          </DisclosureButton>

          <DisclosurePanel className="">{children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
NetworkSidePanelAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  defaultOpen: PropTypes.bool,
  children: PropTypes.node,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};
