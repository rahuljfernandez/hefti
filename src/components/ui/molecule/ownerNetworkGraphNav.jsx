import React, { useState } from 'react';
import clsx from 'clsx';
import Logo from '../../../assets/logo';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

//

export default function OwnerNetworkGraphNav({
  onClose,
  searchQuery,
  onSetSearchQuery,
  searchResults,
  onSelectSearchResult,
  isSearchOpen,
  onSetIsSearchOpen,
}) {
  // const dropdownResults =
  //   searchQuery.trim().length > 0 ? searchResults : sharedFaciltyResults;
  console.log(searchResults);
  return (
    <div className="w-full border-b bg-black">
      <div className="mx-auto px-4">
        <div className="flex min-h-[72px] justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Logo className="h-6 w-auto text-white" />
            {/* Search*/}
            <div
              className="relative flex flex-1 items-center justify-center gap-6"
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
                  'text-label-base text-content-tertiary bg-background-inverse-secondary w-[280px] rounded-full border px-3 py-1.5',
                  'placeholder:text-content-tertiary border-border-inverse-primary pl-9',
                  'focus:ring-2 focus:ring-orange-400 focus:outline-none',
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
                              {result.count} Links
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
          </div>

          {/* RIGHT */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-label-sm bg-background-inverse-secondary text-core-white hover:bg-background-inverse-primary border-border-inverse-primary rounded-lg border px-8 py-2 tracking-wide"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
