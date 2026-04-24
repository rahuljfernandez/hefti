import React, { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/**
 * Search input for locating nodes within the owner-network graph.
 *
 * Responsibilities:
 * - Syncs the current search query with the shared graph controller
 * - Renders a keyboard-usable combobox/listbox for matching graph nodes
 * - Supports mouse and keyboard selection of suggested nodes
 * - Closes and resets active-option state when focus leaves the control
 */
export default function OwnerNetworkSearchBar({
  searchQuery,
  onSetSearchQuery,
  searchResults,
  onSelectSearchResult,
  isSearchOpen,
  onSetIsSearchOpen,
  variant = 'desktop',
}) {
  const isMobile = variant === 'mobile';
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const optionRefs = useRef([]);
  const hasResults = searchResults.length > 0;
  const activeResult =
    activeIndex >= 0 && activeIndex < searchResults.length
      ? searchResults[activeIndex]
      : null;

  useEffect(() => {
    if (activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [activeIndex]);

  function resetSearchNavigation() {
    setActiveIndex(-1);
  }

  function handlePick(result) {
    onSelectSearchResult(result);
    resetSearchNavigation();
  }

  function handleKeyDown(event) {
    if (!isSearchOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!hasResults) return;
      setActiveIndex((current) =>
        current < searchResults.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!hasResults) return;
      setActiveIndex((current) =>
        current > 0 ? current - 1 : searchResults.length - 1,
      );
      return;
    }

    if (event.key === 'Enter') {
      if (activeResult) {
        event.preventDefault();
        handlePick(activeResult);
      }
      return;
    }

    if (event.key === 'Tab') {
      onSetIsSearchOpen(false);
      resetSearchNavigation();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      onSetIsSearchOpen(false);
      resetSearchNavigation();
    }
  }

  return (
    <div
      className={clsx(
        'relative flex flex-1 items-center',
        isMobile ? 'w-full' : 'w-[240px] justify-center gap-6',
      )}
      onBlur={() => {
        setTimeout(() => {
          onSetIsSearchOpen(false);
          resetSearchNavigation();
        }, 100);
      }}
    >
      <MagnifyingGlassIcon className="text-core-white pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isSearchOpen}
        aria-controls={isSearchOpen ? listboxId : undefined}
        aria-activedescendant={
          activeResult ? `${listboxId}-option-${activeResult.id}` : undefined
        }
        aria-label="Search graph nodes"
        value={searchQuery}
        onChange={(e) => {
          onSetSearchQuery(e.target.value);
          onSetIsSearchOpen(true);
          resetSearchNavigation();
        }}
        onFocus={() => {
          onSetIsSearchOpen(true);
          resetSearchNavigation();
        }}
        onClick={() => {
          onSetIsSearchOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search nodes..."
        className={clsx(
          'focus-ring-dark text-label-base text-content-tertiary bg-background-inverse-secondary rounded-full border px-3 py-1.5',
          'placeholder:text-content-tertiary border-border-inverse-primary pl-9',
          isMobile ? 'w-full' : 'w-[280px]',
        )}
      />
      {/* Dropdown */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="bg-core-white absolute top-full left-0 z-500 mt-3 w-full overflow-hidden rounded-lg border border-gray-200 shadow-lg">
          <ul id={listboxId} role="listbox" className="max-h-64 overflow-auto py-1">
            {searchResults.map((result, index) => (
              <li
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                id={`${listboxId}-option-${result.id}`}
                key={result.id}
                role="option"
                aria-selected={activeIndex === index}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handlePick(result);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={clsx(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:cursor-pointer hover:bg-gray-50',
                    activeIndex === index && 'bg-gray-50',
                  )}
                >
                  <span className="text-label-sm text-core-black truncate">
                    {result.label}
                  </span>

                  {result.count != null && (
                    <span className="ml-3 shrink-0 text-xs text-gray-500">
                      {result.count} {result.count === 1 ? 'Link' : 'Links'}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isSearchOpen &&
        searchQuery.trim().length > 0 &&
        searchResults.length === 0 && (
          <div className="bg-core-white absolute top-full left-0 z-500 mt-3 w-full rounded-lg border border-gray-200 shadow-lg">
            <div className="text-label-sm text-core-black px-4 py-3">
              No results found
            </div>
          </div>
        )}
    </div>
  );
}

OwnerNetworkSearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSetSearchQuery: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    }),
  ).isRequired,
  onSelectSearchResult: PropTypes.func.isRequired,
  isSearchOpen: PropTypes.bool.isRequired,
  onSetIsSearchOpen: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};
