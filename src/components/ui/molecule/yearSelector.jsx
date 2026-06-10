import React, { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Heading } from '../atom/heading';

/**
 * YearSelector
 *
 * Modeled after the Select menu component, but created specifically to handle
 * year selection — the generic search-based select was too broad for this use case.
 *
 * Inline year picker for the profile header. Calling onChange triggers a
 * data refetch in the parent page for the selected year.
 *
 * - Desktop: compact label + styled native select with chevron
 * - Mobile: full-screen dialog with radio-style options
 *
 * Props:
 *  - years:    array of year values to display
 *  - value:    currently selected year (controlled)
 *  - onChange: called with the selected year when the user picks one
 *  - label:    display label, defaults to "Data Year"
 */
export default function YearSelector({
  years = [],
  value,
  onChange,
  label = 'Data Year',
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingYear, setPendingYear] = useState(value);
  const headingId = useId();
  const radioGroupName = useId();
  const mobileTriggerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isMobileOpen) {
      setPendingYear(value);
      closeButtonRef.current?.focus();
    }
  }, [isMobileOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDesktopChange(event) {
    onChange?.(event.target.value);
  }

  function handleMobileSelect(year) {
    onChange?.(year);
    setIsMobileOpen(false);
    mobileTriggerRef.current?.focus();
  }

  function handleDialogKeyDown(event) {
    if (event.key === 'Escape') {
      setIsMobileOpen(false);
      mobileTriggerRef.current?.focus();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = Array.from(
        event.currentTarget.querySelectorAll(
          'button, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const radios = focusable.filter((el) => el.type === 'radio');
      const activeIsRadio = radios.includes(document.activeElement);

      if (event.shiftKey && document.activeElement === first) {
        // Shift+Tab from close button → jump to checked radio (or last radio)
        event.preventDefault();
        const target =
          radios.find((r) => r.checked) ?? radios[radios.length - 1];
        target?.focus();
      } else if (!event.shiftKey && activeIsRadio) {
        // Tab from anywhere in the radio group → wrap back to close button
        event.preventDefault();
        first.focus();
      }
    }
  }

  function handleMobileTrigger() {
    if (window.innerWidth < 768) {
      setIsMobileOpen(true);
    }
  }

  return (
    <div className="relative">
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <span className="text-paragraph-base text-content-secondary">
          {label}
        </span>
        <div className="relative">
          <select
            value={value ?? ''}
            onChange={handleDesktopChange}
            aria-label={label}
            className="focus-ring-light text-label-sm text-content-secondary appearance-none rounded-lg bg-white py-1 pr-8 pl-3 outline-1 -outline-offset-1 outline-gray-300"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-500 sm:size-4"
          />
        </div>
      </div>

      {/* Mobile trigger */}
      <div className="relative grid grid-cols-1 md:hidden">
        <button
          ref={mobileTriggerRef}
          type="button"
          onClick={handleMobileTrigger}
          className="focus-ring-light text-label-sm text-content-secondary col-start-1 row-start-1 flex items-center gap-2 rounded-md bg-white py-1.5 pr-8 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300"
          aria-label={`${label}: ${value}. Activate to change.`}
        >
          <span className="text-paragraph-base text-core-black">{label}</span>
          <span className="text-paragraph-base text-content-secondary">
            {value}
          </span>
        </button>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end text-gray-500"
        />
      </div>

      {/* Mobile full-screen dialog */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          onKeyDown={handleDialogKeyDown}
          className="fixed inset-0 z-50 flex flex-col bg-white p-4"
        >
          <div className="mb-4 flex justify-end">
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={`Close ${label} options`}
              className="text-3xl"
              onClick={() => {
                setIsMobileOpen(false);
                mobileTriggerRef.current?.focus();
              }}
            >
              &times;
            </button>
          </div>
          <Heading id={headingId} className="text-label-lg mb-2 font-bold">
            {label}
          </Heading>
          <div className="flex-1 overflow-y-auto">
            <fieldset className="mt-2 w-full rounded-xl bg-white">
              <legend className="sr-only">{label} options</legend>
              {years.map((year) => {
                const isSelected = String(year) === String(pendingYear);
                return (
                  <label
                    key={year}
                    // e.detail is the click count: mouse/touch interactions are always ≥1, but Chrome fires a synthetic click (detail=0) on the label when arrow keys change the radio selection. Guarding on detail>0 prevents thatfrom triggering a premature data load.
                    onClick={(e) => {
                      if (e.detail > 0) handleMobileSelect(year);
                    }}
                    className="text-paragraph-base text-content-secondary flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-100"
                  >
                    <input
                      type="radio"
                      name={radioGroupName}
                      value={year}
                      checked={isSelected}
                      onChange={() => setPendingYear(year)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleMobileSelect(year);
                      }}
                    />
                    <span
                      className={
                        isSelected
                          ? 'text-core-black font-bold'
                          : 'text-content-secondary'
                      }
                    >
                      {year}
                    </span>
                    {isSelected && <CheckIcon className="ml-auto h-5 w-5" />}
                  </label>
                );
              })}
            </fieldset>
          </div>
        </div>
      )}
    </div>
  );
}

YearSelector.propTypes = {
  years: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
