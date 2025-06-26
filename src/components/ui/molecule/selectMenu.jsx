import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
// import { Divider } from '../atom/divider';
import { CheckIcon } from '@heroicons/react/20/solid';

/**
 * Reusable filtering/sort component. Currently has two variants sort/filter.
 * Renders a dropdown on desktop and full-screen modal on mobile
 *
 * Variants:
 * -sort: Allows sorting by name (asc/desc)
 * -filter: Allows filtering by ownership type
 *
 * Only one of `onSortChange` or `onFilterChange` should be provided depending on the `variant`.
 */

const OPTIONS = {
  sort: [
    { label: 'Sort A to Z', value: 'asc' },
    { label: 'Sort Z to A', value: 'desc' },
  ],
  filter: [
    { label: 'For Profit - Corporation', value: 'For Profit - Corporation' },
    { label: 'For Profit - Individual', value: 'For Profit - Individual' },
    {
      label: 'For Profit - Limited Liability Company',
      value: 'For Profit - Limited Liability Company',
    },
    { label: 'For Profit - Partnership', value: 'For Profit - Partnership' },
    { label: 'Government - City', value: 'Government - City' },
    { label: 'Government - City/County', value: 'Government - City/County' },
    { label: 'Government - County', value: 'Government - County' },
    { label: 'Government - Federal', value: 'Government - Federal' },
    {
      label: 'Government - Hospital District',
      value: 'Government - Hospital District',
    },
    { label: 'Government - State', value: 'Government - State' },
    {
      label: 'Nonprofit - Church Related',
      value: 'Nonprofit - Church Related',
    },
    { label: 'Nonprofit - Corporation', value: 'Nonprofit - Corporation' },
    { label: 'Nonprofit - Other', value: 'Nonprofit - Other' },
  ],
};

export default function SelectMenu({
  variant = 'sort',
  onSortChange,
  onFilterChange,
}) {
  const [open, setOpen] = useState(false); //Controls whether dropdown is open
  const [selected, setSelected] = useState(null); //When user clicks an option it is selected
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const dropDownRef = useRef(null); //Allows for closing of dropdown when clicking off

  const label = variant.charAt(0).toUpperCase() + variant.slice(1);
  const options = OPTIONS[variant] || [];

  //Closes dropdwon when user clicks off
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //Checks if user clicked option was the previous selected filter/sort varible, if so it removes all filtering.  If not it applies filter/sort and closes the dropdown.
  function handleSelect(option) {
    if (selected?.value === option.value) {
      setSelected(null);
      setOpen(false);
      onSortChange?.(null);
      onFilterChange?.(null);
    } else {
      setSelected(option);
      setOpen(false);
      onSortChange?.(option.value);
      onFilterChange?.(option.value);
    }
  }
  //Checks if user is on mobile to decide between desktop dropdown or mobile full screen modal
  function handleOpen() {
    const isMobile = window.innerWidth < 768;
    setIsMobileSortOpen(isMobile);
    setOpen(!isMobile);
  }
  //Functionality to close for the X button on the top right corner of the full screen modal.
  function closeMobileSearch() {
    setIsMobileSortOpen(false);
  }

  return (
    <div ref={dropDownRef} className="relative grid w-full grid-cols-1 md:mt-2">
      <button
        onClick={() => handleOpen()}
        className="text-label-sm text-content-secondary col-start-1 row-start-1 h-14 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      >
        {selected !== null ? `${label} selected` : label}
      </button>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
      />

      {open && (
        <ul className="absolute top-14 z-10 mt-2 max-h-105 w-full overflow-auto rounded-xl bg-white shadow-lg ring-1 ring-gray-300">
          {options.map((option) => {
            const isSelected = selected && selected.value === option.value;
            return (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`text-paragraph-base flex cursor-pointer items-center gap-2 px-4 py-3 hover:bg-zinc-100 ${
                  isSelected ? 'text-core-black font-bold' : 'text-core-black'
                }`}
              >
                {isSelected && <CheckIcon className="h-5 w-5" />}
                {option.label}
              </li>
            );
          })}
        </ul>
      )}

      {/* MOBILE MODAL */}
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
              {options.map((option) => {
                const isSelected = selected && selected.value === option.value;
                return (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`text-paragraph-base flex cursor-pointer items-center gap-2 px-4 py-3 hover:bg-zinc-100 ${
                      isSelected
                        ? 'text-core-black font-bold'
                        : 'text-core-black'
                    }`}
                  >
                    {isSelected && <CheckIcon className="h-5 w-5" />}
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>
          {/*CUT V1 but may be needed in future itteratons */}
          {/* <Divider className="py-2" />
          <div className="flex flex-col gap-4">
            <button className="bg-background-inverse-primary text-label-base text-core-white h-10 rounded-lg font-extrabold">
              Apply
            </button>
            <button className="border-border-primary text-label-base h-10 rounded-lg border bg-white font-extrabold">
              Clear
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}

SelectMenu.propTypes = {
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['sort', 'filter']),
  onSortChange: PropTypes.func,
  onFilterChange: PropTypes.func,
};
