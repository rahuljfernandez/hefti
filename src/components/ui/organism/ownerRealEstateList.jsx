import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import SelectMenu from '../molecule/selectMenu';
import ListContainer, { ListContainerSeparate } from './ListContainer';
import { OwnerRealEstateHolding } from '../molecule/listContainerContent';
import {
  selectOwnerProperties,
  OWNER_PROPERTY_RELATED_PARTY_OPTIONS,
  OWNER_PROPERTY_VALUE_OPTIONS,
} from '../../../lib/ownerPropertyMetrics';

/**
 * Real Estate Holdings — the third section of the owner Real Estate tab.
 *
 * The owner's properties as a sortable/filterable list of cards. Sort and the
 * two filters are held locally (this tab has no URL-param routing); the option
 * arrays and the sort/filter logic both live in ownerPropertyMetrics.js so the
 * controls and the results stay in sync. `properties` are the display-ready rows
 * the tab builds once and shares with the highlights and the map.
 */

const INITIAL_VISIBLE = 20;

export default function OwnerRealEstateList({ properties }) {
  const [sort, setSort] = useState(null);
  const [relatedParty, setRelatedParty] = useState(null);
  const [value, setValue] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () => selectOwnerProperties(properties, { sort, relatedParty, value }),
    [properties, sort, relatedParty, value],
  );

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  return (
    <section>
      <div className="mt-8 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Heading level={3} className="text-heading-sm font-bold">
          Real Estate Holdings
        </Heading>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="sm:w-44">
            <SelectMenu
              variant="sort"
              label="Sort"
              value={sort ?? ''}
              onSortChange={setSort}
              accessibleLabel="Sort real estate holdings"
            />
          </div>
          <div className="sm:w-44">
            <SelectMenu
              variant="filter"
              label="Related Party"
              filterOptions={OWNER_PROPERTY_RELATED_PARTY_OPTIONS}
              value={relatedParty ?? ''}
              onSortChange={setRelatedParty}
              accessibleLabel="Filter by related party"
            />
          </div>
          <div className="sm:w-44">
            <SelectMenu
              variant="filter"
              label="Value"
              filterOptions={OWNER_PROPERTY_VALUE_OPTIONS}
              value={value ?? ''}
              onSortChange={setValue}
              accessibleLabel="Filter by market value"
            />
          </div>
        </div>
      </div>

      <div className="pb-8">
        <ListContainer
          items={visible}
          LayoutSelector={ListContainerSeparate}
          ListContent={OwnerRealEstateHolding}
        />
      </div>

      {!showAll && filtered.length > INITIAL_VISIBLE && (
        <div className="pb-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="focus-ring-light text-paragraph-base cursor-pointer rounded-sm text-blue-700 underline hover:text-blue-800"
            aria-label={`Show all ${filtered.length} real estate holdings`}
          >
            Load All Real Estate Holdings
          </button>
        </div>
      )}
    </section>
  );
}

OwnerRealEstateList.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
};
