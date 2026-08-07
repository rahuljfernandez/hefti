import React, { useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Heading } from '../atom/heading';

/**
 * StateSelector
 *
 * Compact "Change state" picker for the state profile header, modeled on the
 * YearSelector so the two controls sit side by side with matching styling.
 *
 * It is an action picker rather than a reflection of the current state: it
 * always shows the "Change state" placeholder (the active state is already the
 * page title), and calling onChange navigates the parent to the chosen state.
 *
 * - Desktop: styled native select with a permanent placeholder option + chevron
 * - Mobile: full-screen dialog with radio-style options
 *
 * Props:
 *  - states:   [{ value, label }] options to choose from
 *  - onChange: called with the selected state's value when the user picks one
 */
const label = 'Change state';

export default function StateSelector({ states = [], onChange }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headingId = useId();
  const radioGroupName = useId();
  const mobileTriggerRef = useRef(null);
  const closeButtonRef = useRef(null);

  function handleDesktopChange(event) {
    if (event.target.value) onChange?.(event.target.value);
  }

  function handleMobileSelect(value) {
    onChange?.(value);
    setIsMobileOpen(false);
    mobileTriggerRef.current?.focus();
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
        <div className="relative">
          <select
            /* Value is pinned to "" so the placeholder always shows; the current
               state lives in the page title, not here. */
            value=""
            onChange={handleDesktopChange}
            aria-label={label}
            className="focus-ring-light text-label-sm text-content-secondary h-10 appearance-none rounded-lg bg-white pr-8 pl-3 outline-1 -outline-offset-1 outline-gray-300"
          >
            <option value="" disabled>
              {label}
            </option>
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
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
          className="focus-ring-light text-label-sm text-content-secondary col-start-1 row-start-1 flex h-10 items-center gap-2 rounded-md bg-white pr-8 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300"
          aria-label={`${label}. Activate to change.`}
        >
          <span className="text-paragraph-base text-content-secondary">
            {label}
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
          className="fixed inset-0 z-50 flex flex-col bg-white p-4"
        >
          <div className="mb-4 flex justify-end">
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={`Close ${label.toLowerCase()} options`}
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
              {states.map((state) => (
                <label
                  key={state.value}
                  onClick={(e) => {
                    // Ignore synthetic detail=0 clicks from arrow-key navigation.
                    if (e.detail > 0) handleMobileSelect(state.value);
                  }}
                  className="text-paragraph-base text-content-secondary flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-100"
                >
                  <input
                    type="radio"
                    name={radioGroupName}
                    value={state.value}
                    onChange={() => {}}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleMobileSelect(state.value);
                    }}
                  />
                  <span className="text-core-black">{state.label}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </div>
      )}
    </div>
  );
}

StateSelector.propTypes = {
  states: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};
