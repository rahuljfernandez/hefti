import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  return (
    <div
      className={clsx(
        'relative flex flex-1 items-center',
        isMobile ? 'w-full' : 'w-[240px] justify-center gap-6',
      )}
      onBlur={() => {
        setTimeout(() => {
          onSetIsSearchOpen(false);
        }, 100);
      }}
    >
      <MagnifyingGlassIcon className="text-core-white pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        value={searchQuery}
        onChange={(e) => {
          onSetSearchQuery(e.target.value);
          onSetIsSearchOpen(true);
        }}
        onFocus={() => {
          onSetIsSearchOpen(true);
        }}
        onClick={() => {
          onSetIsSearchOpen(true);
        }}
        placeholder="Search nodes..."
        className={clsx(
          'text-label-base text-content-tertiary bg-background-inverse-secondary rounded-full border px-3 py-1.5',
          'placeholder:text-content-tertiary border-border-inverse-primary pl-9',
          'focus:ring-2 focus:ring-orange-400 focus:outline-none',
          isMobile ? 'w-full' : 'w-[280px]',
        )}
      />
      {/* Dropdown */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="bg-core-white absolute top-full left-0 z-500 mt-3 w-full overflow-hidden rounded-lg border border-gray-200 shadow-lg">
          <ul className="max-h-64 overflow-auto py-1">
            {searchResults.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectSearchResult(result);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:cursor-pointer hover:bg-gray-50"
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
