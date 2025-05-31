import { ChevronDownIcon } from '@heroicons/react/24/solid';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

//ListContainerDivider and ListContainerSeperate set the styling of the ul/li's
/**
 * Sourced from Application UI - list items have a divider line between them.  Added design color, border, corner radius
 */
//The renderItem prop is passed in from the parent
export function ListContainerDivider({ items = [], renderItem }) {
  return (
    <div className="bg-core-white border-border-primary overflow-hidden rounded-xl border shadow-sm">
      <ul role="list" className="divide-y divide-gray-200">
        {items.map((item, i) => (
          <li key={item.id || i} className="px-4 py-4 sm:px-6">
            {renderItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Sourced from Application UI - list items have a gap between them. Added design color, border, corner radius
 */
export function ListContainerSeperate({ items = [], renderItem }) {
  return (
    <ul role="list" className="space-y-3">
      {items.map((item, i) => (
        <li
          key={item.id || i}
          className="bg-core-white overflow-hidden rounded-xl px-4 py-4 shadow-sm sm:px-6"
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

//TW won't allow the grid-cols-[number] to render dynamically, this solves that.
const gridVariant = {
  3: 'grid grid-cols-1 sm:grid-cols-3',
  4: 'grid grid-cols-1 sm:grid-cols-4',
  5: 'grid grid-cols-1 sm:grid-cols-5',
};

//Component requires data passed in via the items prop, LayoutSelector prop is either the ListContainerSeperate or ListContainerDivider, variant is defaulted to static, but can be set to "expandable", columns prop sets the grid-col-[]
export default function ListContainer({
  items = [],
  //TODO: figure out the linters issue with this
  // eslint-disable-next-line no-unused-vars
  LayoutSelector,
  // eslint-disable-next-line no-unused-vars
  ListContent,
  variant = 'static',
  columns = 3,
}) {
  const gridClass = gridVariant[columns];

  return (
    <div>
      <LayoutSelector
        items={items}
        renderItem={(item) => (
          <Disclosure as="div" defaultOpen={variant === 'static'}>
            {(open) => (
              <>
                <DisclosureButton className="w-full text-left">
                  <div className={`${gridClass} items-center gap-4`}>
                    <ListContent item={item} />
                    {variant === 'expandable' && (
                      <ChevronDownIcon
                        className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                          open ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
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
