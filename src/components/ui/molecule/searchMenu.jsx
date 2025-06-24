import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '../../../lib/toTitleCase';
import { highlightQuery } from '../../../lib/highlightQuery';
import { Heading } from '../atom/heading';

export default function SearchMenu({
  placeholder,
  search,
  onChange,
  suggestions,
}) {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState(search || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Keep local input in sync with parent (eg: when you type the api is updating to display real time results as list items)
  useEffect(() => {
    setQuery(search || '');
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsActive(false);
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trap scroll when mobile modal is open
  useEffect(() => {
    document.body.style.overflow = isMobileSearchOpen ? 'hidden' : '';
  }, [isMobileSearchOpen]);

  function handleInputChange(e) {
    setQuery(e.target.value);
    onChange(e.target.value);
    setShowDropdown(true);
  }

  function handlePick(suggestion) {
    navigate(`/facilities/${suggestion.id}`);
  }

  function closeMobileSearch() {
    setIsMobileSearchOpen(false);
    setShowDropdown(false);
    // setQuery('');
  }

  return (
    <div ref={wrapperRef} className="relative mt-2 grid w-full grid-cols-1">
      {isActive && (
        <div className="pointer-events-none fixed inset-0 z-0 bg-black/25"></div>
      )}
      <input
        type="text"
        className="text-paragraph-base text-core-black z-15 col-start-1 row-start-1 h-14 w-full appearance-none rounded-xl bg-white py-1.5 pr-8 pl-10 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-400 sm:text-sm/6"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          const isMobile = window.innerWidth < 768;
          setIsMobileSearchOpen(isMobile);
          setIsActive(!isMobile);
          setShowDropdown(!isMobile);
        }}
      />
      <MagnifyingGlassIcon
        className="pointer-events-none z-15 col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
        aria-hidden="true"
      />

      {showDropdown && (
        <ul className="absolute top-13 z-10 mt-1 max-h-105 w-full overflow-hidden rounded-xl bg-white py-1 shadow-md">
          {query === '' ? (
            <li className="text-paragraph-base text-core-black px-4 py-6">
              Enter your search term
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((sugg) => (
              <li
                key={sugg.id}
                onMouseDown={() => handlePick(sugg)}
                className="text-paragraph-base cursor-pointer px-4 py-6 hover:bg-zinc-100"
              >
                {highlightQuery(toTitleCase(sugg.label), query)}
              </li>
            ))
          ) : (
            <li className="text-paragraph-base text-core-black px-4 py-6">
              <span className="font-bold">&quot;{query}&quot; </span>did not
              match any auto-suggestions.
            </li>
          )}
        </ul>
      )}

      {/* ✅ MOBILE MODAL */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-white p-4">
          <div className="mb-4 flex justify-end">
            <button className="text-3xl" onClick={() => closeMobileSearch()}>
              &times;
            </button>
          </div>
          <Heading className="text-label-lg mb-2 font-bold">
            {' '}
            Search by name
          </Heading>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="text-paragraph-base text-core-black z-15 col-start-1 row-start-1 h-14 w-full appearance-none rounded-xl bg-white py-1.5 pr-8 pl-10 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-400 sm:text-sm/6"
            />
            <MagnifyingGlassIcon
              className="pointer-events-none absolute top-1/2 left-3 z-15 size-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>

          <ul className="mt-2">
            {query.trim() === '' ? (
              <li className="p-4 text-zinc-500">Enter your search term</li>
            ) : suggestions.length > 0 ? (
              suggestions.map((sugg) => (
                <li
                  key={sugg.id}
                  onMouseDown={() => handlePick(sugg)}
                  className="text-paragraph-base cursor-pointer px-4 py-6 hover:bg-zinc-100"
                >
                  {highlightQuery(toTitleCase(sugg.label), query)}
                </li>
              ))
            ) : (
              <li className="text-paragraph-base text-core-black px-4 py-6">
                <span className="font-bold">&quot;{query}&quot; </span>did not
                match any auto-suggestions.
              </li>
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
  onChange: PropTypes.func,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
