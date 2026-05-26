import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { rankingsListPages } from '../lib/breadcrumbPages';
import BrowsePage from '../components/ui/organism/browsePage';
import ListContainer, { ListContainerSeparate } from '../components/ui/organism/ListContainer';
import { BrowseChains, BrowseOwners } from '../components/ui/molecule/listContainerContent';

/**
 * Rankings list page — renders a paginated, searchable, sortable list for each ranking type.
 *
 * Route: /rankings/:type
 * Supported types: chains, individual-owners (state ranking types pending backend endpoints).
 *
 * Uses BrowsePage with several rankings-specific props not present on Facilities or Owners:
 * - sortOptions: Descending/Ascending by count instead of A-Z/Z-A
 * - defaultSort: 'desc' so the highest-count entries appear first on load
 * - filterOptions: ranking type switcher (chains, individual-owners); navigates routes on change
 * - onFilterChange: navigates to /rankings/:type instead of filtering by state
 * - onSuggestionPick: routes chains to a filtered facility list, owners to their profile page
 * - suggestionsEndpoint: individual-owners reuses /api/owners/suggestions
 * - filterAccessibleLabel: overrides the default "Filter by state" aria-label to "Filter by ranking type"
 *
 * ListContent is selected conditionally by type (BrowseChains vs BrowseOwners) and will
 * need to expand as state ranking types are added.
 *
 * TODO: Add the four state ranking types to RANKINGS_FILTER_OPTIONS once their backend
 * endpoints are ready: state-overall, state-financial, state-staffing, state-health-outcomes.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://hefti-data-api.ddev.site:3000/api';

// Ranking type switcher options — navigates to /rankings/:type on change instead of filtering by state.
const RANKINGS_FILTER_OPTIONS = [
  { label: 'Top Chains', value: 'chains' },
  { label: 'Top Individual Owners', value: 'individual-owners' },
];

// Sort by count (desc/asc) rather than alphabetically, since rankings are count-based.
const RANKINGS_SORT_OPTIONS = [
  { label: 'Descending', value: 'desc' },
  { label: 'Ascending', value: 'asc' },
];

// Maps each ranking type URL param to its display title; includes future state types pending backend.
const RANKING_TITLES = {
  'chains': 'Top Chains',
  'individual-owners': 'Top Individual Owners',
  'state-overall': 'State Rankings — Overall Rating',
  'state-financial': 'State Rankings — Financial',
  'state-staffing': 'State Rankings — Staffing',
  'state-health-outcomes': 'State Rankings — Health Outcomes',
};

export default function Rankings() {
  const { type } = useParams();
  const navigate = useNavigate();
  const title = RANKING_TITLES[type] ?? 'Rankings';

  return (
    <>
      <Breadcrumb pages={rankingsListPages} />
      <BrowsePage
        apiEndpoint={`${API_BASE_URL}/${type}`}
        suggestionsEndpoint={type === 'individual-owners' ? `${API_BASE_URL}/owners/suggestions` : undefined}
        title={title}
        searchPlaceholder="Search..."
        type="rankings"
        defaultSort="desc"
        sortOptions={RANKINGS_SORT_OPTIONS}
        filterOptions={RANKINGS_FILTER_OPTIONS}
        filterAccessibleLabel="Filter by ranking type"
        onFilterChange={(val) => val && navigate(`/rankings/${val}`)}
        onSuggestionPick={(suggestion) => {
          if (type === 'chains') navigate(`/facilities?chain=${suggestion.slug}`, { state: { from: 'rankings' } });
          else navigate(`/owners/${suggestion.slug}`, { state: { from: 'rankings' } });
        }}
        renderList={(items) => (
          <ListContainer
            items={items}
            LayoutSelector={ListContainerSeparate}
            ListContent={type === 'chains' ? BrowseChains : (props) => <BrowseOwners {...props} linkState={{ from: 'rankings' }} />}
          />
        )}
      />
    </>
  );
}
