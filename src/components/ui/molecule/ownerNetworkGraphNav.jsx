import React from 'react';
import Logo from '../../../assets/logo';
import PropTypes from 'prop-types';
import OwnerNetworkSearchBar from './ownerNetworkSearchBar';
import YearSelector from './yearSelector';
import { ShareWidget } from './shareability';

/**
 * Simple toolbar fixed atop the Owner Network modal.
 *
 * Purpose:
 * - Displays the HEFTI logo, graph-node search bar, export widget, and close button
 *
 * Props:
 * - onClose: used in the close button to dismiss the modal
 * - searchQuery: tracks what the user is typing in the search bar
 * - onSetSearchQuery: setter for the current search query
 * - searchResults: array of related owners [{ id, label, count }] built by GraphSearchController
 * - onSelectSearchResult: selects a node from the search dropdown
 * - isSearchOpen: tracks whether the dropdown is open or closed
 * - onSetIsSearchOpen: toggles the search dropdown
 * - shareCategories: export actions for the ShareWidget; empty until the graph loads
 */

export default function OwnerNetworkGraphNav({
  onClose,
  searchQuery,
  onSetSearchQuery,
  searchResults,
  onSelectSearchResult,
  isSearchOpen,
  onSetIsSearchOpen,
  shareCategories = [],
  year,
  years,
  onYearChange,
  topology,
}) {
  const showYearPicker = Boolean(onYearChange && years?.length);
  return (
    <div
      className="w-full border-b bg-black"
      role="toolbar"
      aria-label="Network graph controls"
    >
      <div className="mx-auto px-4">
        <div className="flex min-h-[72px] justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Logo className="h-6 w-auto text-white" />
            {/* Search*/}
            <OwnerNetworkSearchBar
              searchQuery={searchQuery}
              onSetSearchQuery={onSetSearchQuery}
              searchResults={searchResults}
              onSelectSearchResult={onSelectSearchResult}
              isSearchOpen={isSearchOpen}
              onSetIsSearchOpen={onSetIsSearchOpen}
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {showYearPicker && (
              <>
                {/* The graph is one year throughout, so a fallback is about the
                    whole picture rather than any single control. */}
                {topology?.isFallback && (
                  <span className="text-label-xs text-core-white/70 hidden xl:inline">
                    showing {topology.year} — most recent year for this owner
                  </span>
                )}
                <YearSelector
                  years={years}
                  value={year}
                  onChange={(next) => onYearChange(Number(next))}
                />
              </>
            )}
            {shareCategories.length > 0 && (
              <ShareWidget
                categories={shareCategories}
                minimizedLabel="Export"
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="focus-ring-dark text-label-sm bg-background-inverse-secondary text-core-white hover:bg-background-inverse-primary border-border-inverse-primary inline-flex h-10 items-center justify-center rounded-lg border px-8 tracking-wide hover:cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

OwnerNetworkGraphNav.propTypes = {
  onClose: PropTypes.func.isRequired,
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
  shareCategories: PropTypes.array,
  year: PropTypes.number,
  years: PropTypes.arrayOf(PropTypes.number),
  onYearChange: PropTypes.func,
  topology: PropTypes.shape({
    year: PropTypes.number,
    isFallback: PropTypes.bool,
  }),
};
