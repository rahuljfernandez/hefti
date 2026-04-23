import React, { useId, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
// import { Divider } from '../atom/divider';
import { CheckIcon } from '@heroicons/react/20/solid';

/**
 * Reusable sort/filter control for browse pages.
 *
 * Variants:
 * - `sort`: allows sorting by name (A-Z / Z-A)
 * - `filter`: allows filtering by state
 *
 * Behavior:
 * - Desktop renders a native single-select control
 * - Mobile renders a full-screen dialog with radio-style single-choice options
 */

const OPTIONS = {
  sort: [
    { label: 'Sort A to Z', value: 'asc' },
    { label: 'Sort Z to A', value: 'desc' },
  ],
  filter: [
    { label: 'AL', value: 'AL' },
    { label: 'AK', value: 'AK' },
    { label: 'AZ', value: 'AZ' },
    { label: 'AR', value: 'AR' },
    { label: 'CA', value: 'CA' },
    { label: 'CO', value: 'CO' },
    { label: 'CT', value: 'CT' },
    { label: 'DE', value: 'DE' },
    { label: 'FL', value: 'FL' },
    { label: 'GA', value: 'GA' },
    { label: 'HI', value: 'HI' },
    { label: 'ID', value: 'ID' },
    { label: 'IL', value: 'IL' },
    { label: 'IN', value: 'IN' },
    { label: 'IA', value: 'IA' },
    { label: 'KS', value: 'KS' },
    { label: 'KY', value: 'KY' },
    { label: 'LA', value: 'LA' },
    { label: 'ME', value: 'ME' },
    { label: 'MD', value: 'MD' },
    { label: 'MA', value: 'MA' },
    { label: 'MI', value: 'MI' },
    { label: 'MN', value: 'MN' },
    { label: 'MS', value: 'MS' },
    { label: 'MO', value: 'MO' },
    { label: 'MT', value: 'MT' },
    { label: 'NE', value: 'NE' },
    { label: 'NV', value: 'NV' },
    { label: 'NH', value: 'NH' },
    { label: 'NJ', value: 'NJ' },
    { label: 'NM', value: 'NM' },
    { label: 'NY', value: 'NY' },
    { label: 'NC', value: 'NC' },
    { label: 'ND', value: 'ND' },
    { label: 'OH', value: 'OH' },
    { label: 'OK', value: 'OK' },
    { label: 'OR', value: 'OR' },
    { label: 'PA', value: 'PA' },
    { label: 'RI', value: 'RI' },
    { label: 'SC', value: 'SC' },
    { label: 'SD', value: 'SD' },
    { label: 'TN', value: 'TN' },
    { label: 'TX', value: 'TX' },
    { label: 'UT', value: 'UT' },
    { label: 'VT', value: 'VT' },
    { label: 'VA', value: 'VA' },
    { label: 'WA', value: 'WA' },
    { label: 'WV', value: 'WV' },
    { label: 'WI', value: 'WI' },
    { label: 'WY', value: 'WY' },
  ],
};

export default function SelectMenu({
  variant = 'sort',
  onSortChange,
  onStateChange,
  accessibleLabel,
}) {
  const [selected, setSelected] = useState(null); // Stores the current selection for desktop and mobile UIs.
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const headingId = useId();
  const mobileTriggerRef = useRef(null);

  const label = variant.charAt(0).toUpperCase() + variant.slice(1);
  const options = OPTIONS[variant] || [];

  // Applies the selected sort/filter option, or clears back to the default state.
  function handleSelect(option) {
    if (!option) {
      setSelected(null);
      onSortChange?.(null);
      onStateChange?.(null);
    } else {
      setSelected(option);
      onSortChange?.(option.value);
      onStateChange?.(option.value);
    }
  }

  function handleDesktopChange(event) {
    const nextValue = event.target.value;
    const nextOption = options.find((option) => option.value === nextValue) ?? null;
    handleSelect(nextOption);
  }

  // Opens the mobile dialog for small screens; desktop uses the native select directly.
  function handleOpen() {
    const isMobile = window.innerWidth < 768;
    setIsMobileSortOpen(isMobile);
  }
  // Closes the mobile dialog and returns focus to the trigger button.
  function closeMobileSearch() {
    setIsMobileSortOpen(false);
    mobileTriggerRef.current?.focus();
  }

  return (
    <div className="relative w-full md:mt-2">
      <div className="relative hidden md:block">
        <select
          value={selected?.value ?? ''}
          onChange={handleDesktopChange}
          aria-label={accessibleLabel ?? `${label} options`}
          className="text-label-sm text-content-secondary h-14 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-500 sm:size-4"
        />
      </div>

      <div className="relative grid w-full grid-cols-1 md:hidden">
        <button
          ref={mobileTriggerRef}
          type="button"
          onClick={() => handleOpen()}
          className="text-label-sm text-content-secondary col-start-1 row-start-1 h-14 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          {selected !== null ? `${label} selected` : label}
        </button>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        />
      </div>

      {/* MOBILE MODAL */}
      {isMobileSortOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          className="fixed inset-0 z-50 flex flex-col bg-white p-4"
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              aria-label={`Close ${label.toLowerCase()} options`}
              className="text-3xl"
              onClick={() => closeMobileSearch()}
            >
              &times;
            </button>
          </div>

          <Heading id={headingId} className="text-label-lg mb-2 font-bold">
            {label} By
          </Heading>

          <div className="flex-1 overflow-y-auto">
            <fieldset className="mt-2 w-full rounded-xl bg-white">
              <legend className="sr-only">{label} options</legend>

              <label className="text-paragraph-base flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-100">
                <input
                  type="radio"
                  name={`${variant}-mobile-options`}
                  checked={selected === null}
                  onChange={() => {
                    handleSelect(null);
                    closeMobileSearch();
                  }}
                />
                <span className="text-core-black">{label}</span>
              </label>

              {options.map((option) => {
                const isSelected = selected && selected.value === option.value;
                return (
                  <label
                    key={option.value}
                    className="text-paragraph-base flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-100"
                  >
                    <input
                      type="radio"
                      name={`${variant}-mobile-options`}
                      value={option.value}
                      checked={Boolean(isSelected)}
                      onChange={() => {
                        handleSelect(option);
                        closeMobileSearch();
                      }}
                    />
                    <span
                      className={
                        isSelected
                          ? 'text-core-black font-bold'
                          : 'text-core-black'
                      }
                    >
                      {option.label}
                    </span>
                    {isSelected && <CheckIcon className="ml-auto h-5 w-5" />}
                  </label>
                );
              })}
            </fieldset>
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
  onStateChange: PropTypes.func,
  accessibleLabel: PropTypes.string,
};
