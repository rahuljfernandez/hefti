import React from 'react';
import PropTypes from 'prop-types';

import { ChevronDownIcon } from '@heroicons/react/24/solid';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

/**
 * Shared list wrapper for pairing data items with a layout component and a content renderer.
 *
 * Responsibilities:
 * - Iterates over a collection of items and passes each item to a content component
 * - Delegates list styling and structure to the supplied layout selector
 * - Supports static and expandable disclosure behavior for item rows
 *
 * This component is the bridge between normalized data arrays and the reusable
 * presentational renderers defined in listContainerContent.jsx.
 *
 * Example:
 * <ListContainer
 *   items={ownershipLinks}
 *   LayoutSelector={ListContainerDivider}
 *   ListContent={OwnershipAndStakeholders} <<<<===========
 * />
 */
export default function ListContainer({
  items = [],
  LayoutSelector,
  ListContent,
  variant = 'static',
  layoutProps = {},
}) {
  const renderListItem = (item) => {
    if (variant === 'static') {
      return <ListContent item={item} />;
    }

    return (
      <Disclosure as="div">
        {({ open }) => (
          <>
            <DisclosureButton className="w-full text-left">
              <ListContent item={item} />
              <ChevronDownIcon
                className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                  open ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </DisclosureButton>

            <DisclosurePanel className="text-sm text-gray-700">
              <div className="flex flex-row justify-items-center gap-6 space-y-1 px-2 pt-2 pb-3">
                <p>Address: {item.address || '123 Placeholder Ave'}</p>
                <p>Contact: {item.contact || 'Not provided'}</p>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    );
  };

  return (
    <div>
      <LayoutSelector items={items} renderItem={renderListItem} {...layoutProps} />
    </div>
  );
}

ListContainer.propTypes = {
  items: PropTypes.array,
  LayoutSelector: PropTypes.elementType.isRequired,
  ListContent: PropTypes.elementType.isRequired,
  variant: PropTypes.oneOf(['static', 'expandable']),
  layoutProps: PropTypes.object,
};

/**
 * Divider-style list layout used for stacked rows with borders between items.
 */
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
 * Separate-card list layout used when each item should appear as its own card.
 */
export function ListContainerSeparate({ items = [], renderItem }) {
  return (
    <ul role="list" className="">
      {items.map((item, i) => (
        <li
          key={item.id || i}
          className="bg-core-white border-border-primary mb-3 overflow-hidden rounded-xl border px-4 py-4 shadow-sm sm:px-6"
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

const gridColsClass = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};

/**
 * Grid layout used for card-based content such as staffing stat cards.
 * Pass cols (1–3) to set the sm: breakpoint column count.
 * Without cols, defaults to md:grid-cols-2 xl:grid-cols-3.
 */
export function ListContainerGrid({ items = [], renderItem, cols }) {
  const colsClass = cols != null ? gridColsClass[cols] : 'md:grid-cols-2 xl:grid-cols-3';
  return (
    <ul
      role="list"
      className={`mt-4 grid grid-cols-1 gap-4 ${colsClass}`}
    >
      {items.map((item, i) => (
        <li key={item.id || i}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

ListContainerGrid.propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func.isRequired,
  cols: PropTypes.oneOf([1, 2, 3]),
};
