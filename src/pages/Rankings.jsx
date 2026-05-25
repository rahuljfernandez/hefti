import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { rankingsListPages } from '../lib/breadcrumbPages';
import BrowsePage from '../components/ui/organism/browsePage';
import ListContainer, { ListContainerSeparate } from '../components/ui/organism/ListContainer';
import { BrowseChains, BrowseOwners } from '../components/ui/molecule/listContainerContent';

// TODO: Add the four state ranking types to RANKINGS_FILTER_OPTIONS once their
// backend endpoints are ready: state-overall, state-financial, state-staffing, state-health-outcomes.
// TODO: Add JSDoc to this file and audit the full BrowsePage/BrowseListView/SelectMenu/SearchMenu
//   prop chain for missing or outdated comments. Specifically call out which props are
//   rankings-only (sortOptions, filterOptions, onFilterChange, onSuggestionPick,
//   suggestionsEndpoint, defaultSort) and are not used or passed in the Facilities/Owners pages.
//   Also document that ListContent is conditionally selected by URL type param
//   (BrowseChains vs BrowseOwners) and will need to grow as new ranking types are added.

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://hefti-data-api.ddev.site:3000/api';

const RANKINGS_FILTER_OPTIONS = [
  { label: 'Top Chains', value: 'chains' },
  { label: 'Top Individual Owners', value: 'individual-owners' },
];

const RANKINGS_SORT_OPTIONS = [
  { label: 'Descending', value: 'desc' },
  { label: 'Ascending', value: 'asc' },
];

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
