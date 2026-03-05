import React from 'react';
import Logo from '../../../assets/logo';
import PropTypes from 'prop-types';
import OwnerNetworkSearchBar from './ownerNetworkSearchBar';

/**
 *  Simple toolbar fixed atop the Owner Network Modal
 *
 *  Purpose:
 * -Hefti logo, search bar with dropdown, close button to exit modal
 *
 * Props:
 * -onClose: used in the close button to close the modal
 * -SearchQuery: tracks what the user is typing in the searchbar
 * -onSetSearchQuery: setter for the search query
 * -SearchResults: Array of related owners [{id, label, count}].  Built Inside networkGraph.jsx, GraphSearchController gets the Sigma graph instance with const graph = sigma.getGraph(), builds an index
 * -onSelectSearchResult: Sets the search results when the user clicks on an item inside the search dropdown.
 * isSearchOpen:  Tracks whether dropdown is open or closed
 * onSetSearchOpen: toggles search dropdown
 */

export default function OwnerNetworkGraphNav({
  onClose,
  searchQuery,
  onSetSearchQuery,
  searchResults,
  onSelectSearchResult,
  isSearchOpen,
  onSetIsSearchOpen,
}) {
  return (
    <div className="w-full border-b bg-black">
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
          <div className="flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-label-sm bg-background-inverse-secondary text-core-white hover:bg-background-inverse-primary border-border-inverse-primary rounded-lg border px-8 py-2 tracking-wide hover:cursor-pointer"
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
};
