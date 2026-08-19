import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * A rounded white card that collapses — the shell for the Property Details tab's
 * related-party flag banner, where `icon` and `subtitle` fill the header and the
 * panel holds the matched entity.
 *
 * Distinct from networkSidePanelAccordion, which uses the same Headless UI
 * primitives but is styled for the network side panel.
 */
export default function DisclosureCard({ icon, title, subtitle, children }) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="bg-core-white overflow-hidden rounded-lg shadow-sm">
          <DisclosureButton className="focus-panel-light flex w-full items-center justify-between gap-4 px-4 py-4 text-left hover:cursor-pointer sm:px-6">
            <span className="flex items-center gap-3">
              {icon && <span className="shrink-0">{icon}</span>}
              <span className="flex flex-col">
                <span className="text-label-base text-core-black">{title}</span>
                {subtitle && (
                  <span className="text-paragraph-sm text-content-secondary mt-0.5">
                    {subtitle}
                  </span>
                )}
              </span>
            </span>
            <ChevronDownIcon
              className={clsx(
                'text-content-secondary h-5 w-5 shrink-0 transition-transform',
                open && 'rotate-180',
              )}
            />
          </DisclosureButton>

          <DisclosurePanel className="px-4 pb-5 sm:px-6">
            {children}
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}

DisclosureCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};
