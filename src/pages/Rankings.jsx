import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { rankingsListPages } from '../lib/breadcrumbPages';
import BrowsePage from '../components/ui/organism/browsePage';
import ListContainer, { ListContainerSeparate } from '../components/ui/organism/ListContainer';
import { BrowseOwners } from '../components/ui/molecule/listContainerContent';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://hefti-data-api.ddev.site:3000/api';

const RANKING_TITLES = {
  'top-chains': 'Top Chains',
  'top-owners': 'Top Individual Owners',
  'state-overall': 'State Rankings — Overall Rating',
  'state-financial': 'State Rankings — Financial',
  'state-staffing': 'State Rankings — Staffing',
  'state-health-outcomes': 'State Rankings — Health Outcomes',
};

export default function Rankings() {
  const { type } = useParams();
  const title = RANKING_TITLES[type] ?? 'Rankings';

  return (
    <>
      <Breadcrumb pages={rankingsListPages} />
      <BrowsePage
        apiEndpoint={`${API_BASE_URL}/rankings/${type}`}
        title={title}
        searchPlaceholder="Search..."
        type="rankings"
        renderList={(items) => (
          <ListContainer
            items={items}
            LayoutSelector={ListContainerSeparate}
            ListContent={BrowseOwners}
          />
        )}
      />
    </>
  );
}
