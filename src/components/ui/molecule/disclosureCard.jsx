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
 * A rounded white card that collapses — the shell for the Property Details
 * subsections (Financial / Building / Land).
 *
 * Deliberately general enough to also carry the conditional flag banners
 * (possible related-party ownership, multiple associated properties) that sit
 * above the tab's sections. Those differ from the detail subsections only in
 * header content and panel body, which is why `icon` and `subtitle` exist:
 *
 *   detail subsection — title only, panel holds a DetailTableSplit
 *   flag banner       — warning icon + title + subtitle, panel holds the
 *                       matched-entity list
 *
 * Distinct from networkSidePanelAccordion, which is the same Headless UI
 * primitives dressed for the network side panel (edge-to-edge borders, a dark
 * mobile variant). That component is named for where it lives; this one is the
 * general card form.
 */

/* The header is padded, but panel content often needs to bleed to the card's
   full width — DetailTable's rules run edge to edge. `panelClassName` replaces
   the default padding for those cases rather than fighting it with negative
   margins. */
export default function DisclosureCard({
  icon,
  title,
  subtitle,
  defaultOpen = false,
  children,
  className,
  panelClassName,
}) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div
          className={clsx(
            'overflow-hidden rounded-lg bg-white shadow-sm',
            className,
          )}
        >
          <DisclosureButton className="focus-panel-light flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:cursor-pointer sm:px-6">
            <span className="flex items-start gap-3">
              {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
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
                'text-content-secondary mt-0.5 h-5 w-5 shrink-0 transition-transform',
                open && 'rotate-180',
              )}
            />
          </DisclosureButton>

          <DisclosurePanel
            className={clsx(panelClassName ?? 'px-4 pb-5 sm:px-6')}
          >
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
  defaultOpen: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  panelClassName: PropTypes.string,
};
