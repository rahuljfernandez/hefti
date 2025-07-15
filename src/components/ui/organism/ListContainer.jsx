import React from 'react';
import PropTypes from 'prop-types';

import { ChevronDownIcon } from '@heroicons/react/24/solid';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

/**
 * ListContainer component
 *
 * This component renders a list using a layout selector (e.g., divider or separate).
 * It supports static and expandable disclosure behavior.
 * NOTE: The "expandable" variant is funtional, but not styled or properly in place.  Might be somthing Nick wants to include in Version 2.
 *
 * Props:
 * - items (array): The data to render in the list
 * - LayoutSelector (component): Wrapper component that defines list layout (e.g. divider or gap(separate) style)
 * - ListContent (component): Renders the content inside each list item
 * - variant (string): "static" (default) or "expandable" — determines if disclosure panel opens
 *
 * Example usage:
 * <ListContainer
 *   items={data}
 *   LayoutSelector={ListContainerDivider}
 *   ListContent={OwnershipAndStakeholders}
 *   variant="expandable"
 * />
 */

export default function ListContainer({
  items = [],
  LayoutSelector,
  ListContent,
  variant = 'static',
}) {
  return (
    <div>
      <LayoutSelector
        items={items}
        renderItem={(item) => (
          <Disclosure as="div" defaultOpen={variant === 'static'}>
            {(open) => (
              <>
                <DisclosureButton className="w-full text-left">
                  <ListContent item={item} />
                  {variant === 'expandable' && (
                    <ChevronDownIcon
                      className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </DisclosureButton>

                {variant === 'expandable' && (
                  <DisclosurePanel className="text-sm text-gray-700">
                    <div className="flex flex-row justify-items-center gap-6 space-y-1 px-2 pt-2 pb-3">
                      <p>Address: {item.address || '123 Placeholder Ave'}</p>
                      <p>Contact: {item.contact || 'Not provided'}</p>
                    </div>
                  </DisclosurePanel>
                )}
              </>
            )}
          </Disclosure>
        )}
      />
    </div>
  );
}

ListContainer.propTypes = {
  items: PropTypes.array,
  LayoutSelector: PropTypes.elementType.isRequired,
  ListContent: PropTypes.elementType.isRequired,
  variant: PropTypes.oneOf(['static', 'expandable']),
};

/**
 * Sourced from Application UI - list items have a divider line between them.  Added design color, border, corner radius
 * ListContainerDivider and ListContainerSeperate set the styling of the ul/li's
 */
//The renderItem prop is passed in from the parent
export function ListContainerDivider({ items = [], renderItem }) {
  return (
    <div className="bg-core-white border-border-primary overflow-hidden rounded-xl border shadow-sm">
      <ul role="list" className="divide-y divide-gray-200">
        {items.map((item, i) => (
          <li key={item.id + i} className="px-4 py-4 sm:px-6">
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

ListContainerDivider.propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func.isRequired,
};

/**
 * Sourced from Application UI - list items have a gap between them. Added design color, border, corner radius
 */

export function ListContainerSeparate({ items = [], renderItem }) {
  return (
    <ul role="list" className="space-y-3">
      {items.map((item, i) => (
        <li
          key={item.id || i}
          className="bg-core-white border-border-primary overflow-hidden rounded-xl border px-4 py-4 shadow-sm sm:px-6"
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

ListContainerSeparate.propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func.isRequired,
};
