import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import { Divider } from '../atom/divider';

/**
 *
 * Sourced from Application UI/ Select Menus/ Simple native
 *
 */

const OPTIONS = {
  sort: [
    { label: 'Sort A to Z', value: 'asc' },
    { label: 'Sort Z to A', value: 'desc' },
  ],
  filter: [
    { label: 'For Profit - Corporation', value: 'for-profit-corp' },
    { label: 'For Profit - Individual', value: 'for-profit-individual' },
    {
      label: 'For Profit - Limited Liability Company',
      value: 'for-profit-llc',
    },
    { label: 'For Profit - Partnership', value: 'for-profit-partnership' },
    { label: 'Government - City', value: 'gov-city' },
    { label: 'Government - City/County', value: 'gov-city-county' },
    { label: 'Government - County', value: 'gov-county' },
    { label: 'Government - Federal', value: 'gov-federal' },
    { label: 'Government - Hospital District', value: 'gov-hospital-district' },
    { label: 'Government - State', value: 'gov-state' },
    { label: 'Nonprofit - Church Related', value: 'nonprofit-church' },
    { label: 'Nonprofit - Corporation', value: 'nonprofit-corp' },
    { label: 'Nonprofit - Other', value: 'nonprofit-other' },
  ],
};

export default function SelectMenu({ onChange, variant = 'sort' }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const label = variant.charAt(0).toUpperCase() + variant.slice(1);
  const options = OPTIONS[variant] || [];

  function handleSelect(option) {
    setSelected(option);
    setOpen(false);
    onChange?.(option.value);
  }

  function handleOpen() {
    const isMobile = window.innerWidth < 768;
    setIsMobileSortOpen(isMobile);
    setOpen(false);
  }

  function closeMobileSearch() {
    setIsMobileSortOpen(false);
  }

  return (
    <div className="relative grid w-full grid-cols-1 md:mt-2">
      <button
        onClick={() => handleOpen()}
        className="text-label-sm text-content-secondary col-start-1 row-start-1 h-14 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      >
        {label}
      </button>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
      />

      {open && (
        <ul className="absolute top-14 z-10 mt-2 max-h-105 w-full overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-gray-300">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="text-paragraph-base text-core-black cursor-pointer px-4 py-3 hover:bg-zinc-100"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ MOBILE MODAL */}
      {isMobileSortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-4">
          <div className="mb-4 flex justify-end">
            <button className="text-3xl" onClick={() => closeMobileSearch()}>
              &times;
            </button>
          </div>

          <Heading className="text-label-lg mb-2 font-bold">{label} By</Heading>

          <div className="flex-1 overflow-y-auto">
            <ul className="mt-2 w-full overflow-auto rounded-xl bg-white">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="text-paragraph-base text-core-black cursor-pointer px-4 py-3 hover:bg-zinc-100"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
          <Divider className="py-2" />
          <div className="flex flex-col gap-4">
            <button className="bg-background-inverse-primary text-label-base text-core-white h-10 rounded-lg font-extrabold">
              Apply
            </button>
            <button className="border-border-primary text-label-base h-10 rounded-lg border bg-white font-extrabold">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

SelectMenu.propTypes = {
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['sort', 'filter']),
};
