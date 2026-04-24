import React, { useState, useEffect, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import { NoResultsBanner } from '../atom/errorBanner';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '../../../lib/toTitleCase';
import { highlightQuery } from '../../../lib/highlightQuery';
import { Heading } from '../atom/heading';
import { useDebouncedValue } from '../../../hooks/useDebounceValue';

/**
 * Search input with debounced query updates, autosuggestion dropdowns, and mobile search-dialog support.
 *
 * Responsibilities:
 * - Debounces user input before syncing the parent search state
 * - Renders keyboard-usable desktop and mobile suggestion lists
 * - Routes selected suggestions to owner or facility detail pages
 * - Displays a no-results status when suggestions are fetched but empty
 * - Applies combobox/listbox semantics for dynamic suggestions
 */

export default function SearchMenu({
  placeholder,
  search,
  onSearchChange,
  suggestions,
  hasFetchedSuggestions,
  type,
  accessibleLabel = 'Search by name',
}) {
  const [isActive, setIsActive] = useState(false); // Tracks whether the desktop suggestion popover is active.
  const [query, setQuery] = useState(search || '');
  const debouncedQuery = useDebouncedValue(query, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null); // Used to detect outside clicks for the desktop suggestion popover.
  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);
  const suppressNextFocusRef = useRef(false);
  const navigate = useNavigate();
  const listboxId = useId();
  const mobileDialogTitleId = useId();
  const mobileListboxId = `${listboxId}-mobile`;

  const hasSuggestions = suggestions.length > 0;
  const showNoResults = hasFetchedSuggestions && suggestions.length === 0;
  const activeSuggestion =
    activeIndex >= 0 && activeIndex < suggestions.length
      ? suggestions[activeIndex]
      : null;

  // Update parent search state after debounce delay
  useEffect(() => {
    if (debouncedQuery.trim() !== (search || '').trim()) {
      onSearchChange(debouncedQuery);
    }
  }, [debouncedQuery, onSearchChange, search]);

  // Keep local input in sync with parent search state as URL-driven results update.
  useEffect(() => {
    setQuery(search || '');
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsActive(false);
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trap background scroll and move focus into the mobile dialog when it opens.
  useEffect(() => {
    document.body.style.overflow = isMobileSearchOpen ? 'hidden' : '';
    if (isMobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSearchOpen]);

  // Navigate to a facility/owner detail page when a suggestion is selected
  function handlePick(suggestion) {
    if (type === 'owners') {
      navigate(`/owners/${suggestion.slug}`);
    } else {
      navigate(`/facilities/${suggestion.slug}`);
    }
  }

  function handleDesktopKeyDown(event) {
    if (!showDropdown) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!hasSuggestions) return;
      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!hasSuggestions) return;
      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1,
      );
      return;
    }

    if (event.key === 'Enter') {
      if (activeSuggestion) {
        event.preventDefault();
        handlePick(activeSuggestion);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setShowDropdown(false);
      setIsActive(false);
      setActiveIndex(-1);
    }
  }

  function handleMobileKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!hasSuggestions) return;
      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!hasSuggestions) return;
      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1,
      );
      return;
    }

    if (event.key === 'Enter') {
      if (activeSuggestion) {
        event.preventDefault();
        handlePick(activeSuggestion);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMobileSearch();
    }
  }

  function handleDesktopBlur(event) {
    const nextFocused = event.relatedTarget;
    if (wrapperRef.current && wrapperRef.current.contains(nextFocused)) return;

    setShowDropdown(false);
    setIsActive(false);
    setActiveIndex(-1);
  }

  // Closes the mobile dialog and returns focus to the desktop trigger input.
  function closeMobileSearch() {
    setIsMobileSearchOpen(false);
    setShowDropdown(false);
    setActiveIndex(-1);
    if (window.innerWidth < 768) {
      desktopInputRef.current?.blur();
    } else {
      suppressNextFocusRef.current = true;
      desktopInputRef.current?.focus();
    }
    // setQuery('');
  }

  return (
    <div ref={wrapperRef} className="relative mt-2 grid w-full grid-cols-1">
      {isActive && (
        <div className="pointer-events-none fixed inset-0 z-0 bg-black/25"></div>
      )}
      <input
        ref={desktopInputRef}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls={showDropdown ? listboxId : undefined}
        aria-activedescendant={
          activeSuggestion ? `${listboxId}-option-${activeSuggestion.id}` : undefined
        }
        aria-label={accessibleLabel}
        className="focus-ring-light text-paragraph-base text-core-black z-15 col-start-1 row-start-1 h-14 w-full appearance-none rounded-xl bg-white py-1.5 pr-8 pl-10 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleDesktopKeyDown}
        onBlur={handleDesktopBlur}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsMobileSearchOpen(true);
            setIsActive(false);
            setShowDropdown(false);
            setActiveIndex(-1);
          }
        }}
        onFocus={() => {
          if (suppressNextFocusRef.current) {
            suppressNextFocusRef.current = false;
            return;
          }
          const isMobile = window.innerWidth < 768;
          setIsMobileSearchOpen(isMobile);
          setIsActive(!isMobile);
          setShowDropdown(!isMobile);
          setActiveIndex(-1);
        }}
      />
      <MagnifyingGlassIcon
        className="pointer-events-none z-15 col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
        aria-hidden="true"
      />

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute top-13 z-10 mt-1 max-h-105 w-full overflow-hidden rounded-xl bg-white py-1 shadow-md"
        >
          {debouncedQuery === '' ? (
            <li className="text-paragraph-base text-core-black px-4 py-6">
              Enter your search term
            </li>
          ) : hasSuggestions ? (
            suggestions.map((sugg, index) => (
              <li
                id={`${listboxId}-option-${sugg.id}`}
                key={sugg.id}
                role="option"
                aria-selected={activeIndex === index}
                onMouseDown={() => handlePick(sugg)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`text-paragraph-base cursor-pointer px-4 py-6 hover:bg-zinc-100 ${
                  activeIndex === index ? 'bg-zinc-100' : ''
                }`}
              >
                {highlightQuery(toTitleCase(sugg.label), query)}
              </li>
            ))
          ) : (
            showNoResults && (
              <li className="px-3 py-3">
                <NoResultsBanner term={query} />
              </li>
            )
          )}
        </ul>
      )}

      {/* MOBILE MODAL */}
      {isMobileSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={mobileDialogTitleId}
          className="fixed inset-0 z-50 overflow-auto bg-white p-4"
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              aria-label="Close search"
              className="text-3xl"
              onClick={() => closeMobileSearch()}
            >
              &times;
            </button>
          </div>
          <Heading id={mobileDialogTitleId} className="text-label-lg mb-2 font-bold">
            Search by name
          </Heading>
          <div className="relative">
            <input
              ref={mobileInputRef}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={debouncedQuery !== ''}
              aria-controls={debouncedQuery !== '' ? mobileListboxId : undefined}
              aria-activedescendant={
                activeSuggestion
                  ? `${mobileListboxId}-option-${activeSuggestion.id}`
                  : undefined
              }
              aria-label={accessibleLabel}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleMobileKeyDown}
              placeholder={placeholder}
              className="focus-ring-light text-paragraph-base text-core-black z-15 col-start-1 row-start-1 h-14 w-full appearance-none rounded-xl bg-white py-1.5 pr-8 pl-10 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
            />
            <MagnifyingGlassIcon
              className="pointer-events-none absolute top-1/2 left-3 z-15 size-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>

          <ul id={mobileListboxId} role="listbox" className="mt-2">
            {debouncedQuery === '' ? (
              <li className="p-4 text-zinc-500">Enter your search term</li>
            ) : hasSuggestions ? (
              suggestions.map((sugg, index) => (
                <li
                  id={`${mobileListboxId}-option-${sugg.id}`}
                  key={sugg.id}
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseDown={() => handlePick(sugg)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`text-paragraph-base cursor-pointer px-4 py-6 hover:bg-zinc-100 ${
                    activeIndex === index ? 'bg-zinc-100' : ''
                  }`}
                >
                  {highlightQuery(toTitleCase(sugg.label), query)}
                </li>
              ))
            ) : (
              showNoResults && (
                <li className="px-3 py-3">
                  <NoResultsBanner term={query} />
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

SearchMenu.propTypes = {
  placeholder: PropTypes.string.isRequired,
  search: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  hasFetchedSuggestions: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['facilities', 'owners']).isRequired,
  accessibleLabel: PropTypes.string,
};
