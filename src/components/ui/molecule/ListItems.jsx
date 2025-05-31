import { ChevronDownIcon } from '@heroicons/react/24/solid';
import ListContainerDivider from '../atom/listContainerDivider';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
//Component requires data passed in via the items prop, LayoutSelector prop is either the ListContainerSeperate or ListContainerDivider, variant is defaulted to static, but can be set to "expandable", columns prop sets the grid-col[]

// const gridClass =
//   {
//     3: 'grid grid-cols-3',
//     4: 'grid grid-cols-4',
//     5: 'grid grid-cols-5',
//   }[columns] || 'grid grid-cols-3';

export default function OwnershipAndStakeholders({
  items = [],
  // eslint-disable-next-line no-unused-vars
  LayoutSelector,
  variant = 'static',
  //   columns = 3,
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
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
                    <span className="col-span-1 text-blue-600 underline">
                      {item.organization}
                    </span>
                    <span className="col-span-1 text-sm">
                      {item.percentage || 'No percentage provided'}
                    </span>
                    <span
                      className={`col-span-1 max-w-40 rounded-md px-2 py-1 text-xs font-semibold ${
                        item.type === 'Direct'
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.type.toUpperCase()} OWNERSHIP
                    </span>

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
