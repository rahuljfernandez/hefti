import React from 'react';
import { Badge } from '../atom/badge';
import { formatOwnershipPercentage } from '../../../lib/stringFormatters';
import StarRating from './starRating';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Divider } from '../atom/divider';
import { toTitleCase } from '../../../lib/toTitleCase';
import { badgeConfig, getCmprColor } from '../../../lib/getBadgeColor';
import { ownerRoleMap } from '../../../lib/ownerRoleHelper';
import LayoutCard from '../atom/layout-card';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import MatchChip from './matchChip';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';

/**
 * Collection of reusable content components for ListContainer and related card layouts.
 *
 * Each export in this file renders a specific item shape, such as ownership records,
 * related facilities, provider metrics, or tab-specific stat cards. These components
 * do not fetch or transform data. They expect display-ready item objects and focus
 * only on rendering those objects in a consistent visual format.
 *
 * Example:
 * <ListContainer
 *   items={ownershipLinks}
 *   LayoutSelector={ListContainerDivider}
 *   ListContent={OwnershipAndStakeholders}
 * />
 */
export function OwnershipAndStakeholders({ item }) {
  const role = item.cms_ownership_role;
  const config = badgeConfig[role] || {
    color: 'gray',
    label: role ?? 'Unknown',
  };

  const isReit = item.is_reit === true;
  const isPe = item.is_pe === true;

  return (
    <div className="grid grid-cols-1 gap-4 font-sans md:grid-cols-3">
      {/* Name + Address */}

      <div className="md:col-span-2">
        <p className="text-paragraph-base text-content-secondary py-2 md:py-2 md:pt-2">
          {item.cms_ownership_type?.toUpperCase()}
        </p>
        <Link
          to={`/owners/${item.ownership_entity.slug}`}
          className="focus-ring-light text-heading-xs rounded-sm font-bold text-blue-600 underline"
          style={{
            textDecorationThickness: '2px',
            textUnderlineOffset: '2px',
          }}
        >
          {toTitleCase(
            item.ownership_entity?.cms_ownership_name || 'Unknown Owner',
          )}
        </Link>
      </div>

      {/* Button — Top right on desktop, bottom on mobile */}
      <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
        <Badge className="max-w-44" color={config?.color || 'gray'}>
          {config?.label || toTitleCase(item.cms_ownership_role || 'Unknown')}
        </Badge>

        {isReit && <Badge color="orange">REIT</Badge>}
        {isPe && <Badge color="cyan">PRIVATE EQUITY</Badge>}
      </div>

      {/* Divider */}
      <Divider className="order-2 md:order-none md:col-span-3" />

      {/* Bottom Row */}
      <div className="order-2 flex flex-col gap-4 md:order-none md:col-span-3 md:h-full md:flex-row md:items-center md:justify-start md:gap-6">
        <div className="gap-2 md:flex md:flex-col">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            OWNERSHIP PERCENTAGE
          </p>
          <p className="text-paragraph-base text-core-black">
            {formatOwnershipPercentage(item.cms_ownership_percentage)}
          </p>
        </div>

        <div className="gap-2 md:flex md:flex-col md:border-l md:border-gray-400 md:pl-6">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            OWNERSHIP MINIMUM
          </p>
          <p className="text-paragraph-base text-core-black">
            {toTitleCase(item.cms_ownership_role || 'N/A')}
          </p>
        </div>
      </div>
    </div>
    // <>
    //   {/* <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 sm:items-start">
    //     {/* Col 1 - Row 1 */}
    //     <div className="text-label-xs order-1 sm:order-none">
    //       {item.cms_ownership_type?.toUpperCase()}
    //     </div>

    //     {/* Col 2 - Row 1 */}
    //     <div className="text-label-xs order-3 sm:order-none">
    //       OWNERSHIP PERCENTAGE
    //     </div>

    //     {/* Col 3 - spans both rows */}
    //     <div className="order-last row-span-2 sm:order-none sm:flex sm:h-full sm:items-center">
    //       <Badge className="max-w-44" color={badgeColor}>
    //         {item.cms_ownership_role}
    //       </Badge>
    //     </div>

    //     {/* Col 1 - Row 2 */}
    //     <div className="text-paragraph-base order-2 sm:order-none">
    //       {item.ownership_entity?.cms_ownership_name}
    //     </div>

    //     {/* Col 2 - Row 2 */}
    //     <div className="text-paragraph-base order-4 sm:order-none">
    //       {formatOwnershipPercentage(item.cms_ownership_percentage)}
    //     </div>
    //   </div> */}
    // </>
  );
}

OwnershipAndStakeholders.propTypes = {
  item: PropTypes.object.isRequired,
};

// V1 placeholder — Rahul will split into separate report_date + report_url fields.
// Update field names here once the backend change lands.
export function DeficiencyReportItem({ item }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-paragraph-base text-core-black">
        {item.report_date ?? '—'}
      </p>
      {item.report_url ? (
        <a
          href={item.report_url}
          className="text-paragraph-base font-medium text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          Full Report
        </a>
      ) : (
        <span className="text-paragraph-base text-content-secondary">
          No report available
        </span>
      )}
    </div>
  );
}

DeficiencyReportItem.propTypes = {
  item: PropTypes.shape({
    report_date: PropTypes.string,
    report_url: PropTypes.string,
  }).isRequired,
};

//Did not see this data in CSV. Where will it be?
//What does it look like with zero deficiencies?
//links will need to be added to report, need clarity
export function Deficiencies({ item }) {
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-3 gap-y-2 sm:grid-cols-[1fr_1fr_1fr_auto] sm:grid-rows-2 sm:items-start">
        {/* Row 1 */}
        <div className="text-paragraph-base order-1 col-span-1 font-bold sm:order-none">
          {item.Report_Date}
        </div>
        <div className="text-paragraph-base order-3 col-span-1 font-bold sm:order-none">
          {item.Deficiencies} deficienc{item.Deficiencies === 1 ? 'y' : 'ies'}
        </div>
        <div className="text-paragraph-base order-5 col-span-1 sm:order-none">
          {item.Fine_Amount ? `$${item.Fine_Amount.toLocaleString()} Fine` : ''}
        </div>

        {/* Full Report spans both rows*/}
        <div className="order-last sm:order-none sm:col-span-1 sm:row-span-2 sm:flex sm:h-full sm:items-center sm:justify-end">
          <span className="text-paragraph-base text-blue-600 underline">
            Full Report
          </span>
        </div>

        {/* Row 2 */}
        <div className="text-paragraph-sm order-2 col-span-1 sm:order-none">
          {item.Report_Type}
        </div>
        <div className="text-paragraph-sm order-4 col-span-1 sm:order-none">
          {item.Infections > 0 ? (
            `(${item.Infections} infection${item.Infections > 1 ? 's' : ''})`
          ) : (
            <span className="invisible">(0 infections)</span>
          )}
        </div>
        <div className="text-paragraph-sm order-6 col-span-1 sm:order-none">
          {item.Payment_Suspension > 0 ? (
            `${item.Payment_Suspension} Payment Suspension${item.Payment_Suspension > 1 ? 's' : ''}`
          ) : (
            <span className="invisible">(0 Payment Suspension)</span>
          )}
        </div>
      </div>
    </>
  );
}

Deficiencies.propTypes = {
  item: PropTypes.object.isRequired,
};

//links will need to be added to view report, need clarity
export function Penalties({ item }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-[1fr_1fr_1fr_1fr] sm:items-start">
        <div className="text-paragraph-base col-span-1 font-bold">
          {item.Report_Date}
        </div>
        <div className="text-paragraph-base col-span-1">
          {`$${item.Fine_Amount.toLocaleString()} fine`}
        </div>
        <div className="text-paragraph-base col-span-1">
          {item.Payment_Suspension > 0 ? (
            `${item.Payment_Suspension} Payment Suspension${item.Payment_Suspension > 1 ? 's' : ''}`
          ) : (
            <span className="invisible">(0 Payment_Suspension)</span>
          )}
        </div>

        {/* Links will need to added for this...need clarity*/}
        <div className="sm:flex sm:h-full sm:items-center sm:justify-end">
          {item.Has_Report ? (
            <span className="text-paragraph-base text-blue-600 underline">
              View Inspection Report
            </span>
          ) : (
            <span className="text-paragraph-base text-content-secondary">
              No corresponding inspection report
            </span>
          )}
        </div>
      </div>
    </>
  );
}

Penalties.propTypes = {
  item: PropTypes.object.isRequired,
};

/**
 * Related facility card used on the owner profile page.
 *
 * Responsibilities:
 * - Renders one associated facility as a single interactive card
 * - Shows the facility name, location, CMS rating, and owner-role label
 * - Uses one outer link so keyboard users tab through the list one card at a time
 */
export function RelatedFacilities({ item }) {
  const roleKey = item.cms_ownership_role || 'N/A';
  const roleLabel = ownerRoleMap[roleKey]?.label;
  const facilityHref = `/facilities/${item.slug}`;
  const facilityName = toTitleCase(item.provider_name);
  return (
    <Link
      to={facilityHref}
      className="focus-ring-light block rounded-lg"
      aria-label={`View profile for ${facilityName}`}
    >
      <div className="grid grid-cols-1 gap-4 font-sans md:grid-cols-3">
        {/* Name + Address */}
        <div className="md:col-span-2">
          <span className="text-paragraph-base order-1 font-bold text-blue-700 underline sm:order-none">
            {facilityName}
          </span>
          <div className="text-paragraph-base text-content-secondary order-2 md:order-none">
            {`${toTitleCase(item.street_address)}, ${toTitleCase(item.city)}, ${item.state} ${
              item.zip_code
            }`}
          </div>
        </div>
        {/* Button — Top right on desktop, bottom on mobile */}
        <div className="order-5 md:order-none md:flex md:items-center md:justify-end">
          <span className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto">
            View Profile
          </span>
        </div>

        {/* Divider */}
        <Divider className="order-2 md:order-none md:col-span-3" />

        {/* Col 2 - spans both rows */}
        <div className="order-3 md:order-none md:col-span-3 md:flex md:items-center md:justify-start md:gap-6">
          {/* CMS Rating */}
          <div className="flex flex-col items-start md:flex-row md:items-center md:gap-2">
            <p className="text-paragraph-base text-content-secondary">
              CMS Rating
            </p>
            <StarRating
              rating={item.overall_rating}
              className="text-paragraph-base text-content-secondary"
            />
          </div>

          {/* Owner Role */}
          <div className="flex flex-col md:flex-row md:gap-2 md:border-l md:border-gray-400 md:pl-6">
            <p className="text-paragraph-base text-content-secondary pb-1">
              Owners Role:
            </p>
            <p className="text-paragraph-base text-core-black font-bold">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

RelatedFacilities.propTypes = {
  item: PropTypes.object.isRequired,
};

/**
 *TODO:zip code needs to be added to dataset to match design
 * Need to get data from owner table
 *  link needs to be working
 */

export function BrowseNursingHomes({ item, linkState }) {
  // Add error handling for missing or malformed data
  if (!item) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="text-paragraph-base text-red-600">
            Error: Invalid facility data
          </p>
        </div>
      </div>
    );
  }

  // Get the first ownership entity for display (or handle multiple)
  const primaryOwnership = item.facility_ownership_links?.[0]?.ownership_entity;
  const facilityHref = `/facilities/${item.slug}`;
  const facilityName = toTitleCase(item.provider_name || 'Unknown Facility');

  return (
    <Link
      to={facilityHref}
      state={linkState}
      className="focus-ring-light block rounded-lg"
      aria-label={`View profile for ${facilityName}`}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Name + Address */}
        <div className="md:col-span-2">
          <span
            className="text-heading-xs font-bold text-blue-600 underline"
            style={{
              textDecorationThickness: '2px',
              textUnderlineOffset: '2px',
            }}
          >
            {facilityName}
          </span>
          <p className="text-paragraph-base text-content-secondary hidden py-2 md:block md:py-0 md:pt-2">
            {item.street_address && item.city && item.state
              ? `${toTitleCase(item.street_address || '')}, ${toTitleCase(item.city || '')}, ${item.state || ''}`
              : 'Address not available'}
          </p>
        </div>

        {/* Button — Top right on desktop, bottom on mobile */}
        <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
          <span className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto">
            View Profile
          </span>
        </div>

        {/* Divider */}
        <Divider className="order-2 md:order-none md:col-span-3" />

        {/* Bottom Row */}
        <div className="order-2 flex flex-col gap-4 md:order-none md:col-span-3 md:h-full md:flex-row md:items-center md:justify-start md:gap-6">
          <div className="md:flex md:flex-row">
            <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
              Owned by:
            </p>
            <p className="text-paragraph-base text-core-black font-semibold">
              {primaryOwnership?.cms_ownership_name
                ? toTitleCase(primaryOwnership.cms_ownership_name)
                : primaryOwnership?.parent_company_name
                  ? toTitleCase(primaryOwnership.parent_company_name)
                  : 'N/A'}
            </p>
          </div>

          <div className="md:flex md:flex-row md:border-l md:border-gray-400 md:pl-6">
            <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
              Ownership Type:
            </p>
            <p className="text-paragraph-base text-core-black font-semibold">
              {toTitleCase(item.ownership_type || 'N/A')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

BrowseNursingHomes.propTypes = {
  item: PropTypes.object.isRequired,
  linkState: PropTypes.object,
};

/**
 * Facility browse card variant that surfaces rating metrics in the bottom row.
 * Used on the facilities browse page when a field-based sort is active
 * (overall rating, staffing, health inspection, or financial).
 *
 * The top section (name, address, View Profile) is identical to BrowseNursingHomes.
 * The bottom row replaces ownership info with four stat blocks:
 * - Overall, Health Insp., Staffing: star rating display
 * - Financial: operating margin percentage + comparison badge (Above/Below avg.)
 *   sourced from cmpr_operating_margin. Higher is better, so above avg. = green,
 *   below avg. = red. The financial block always carries a border to visually
 *   group its denser two-row layout, even when it is not the active sort metric.
 *
 * The active stat block (matching activeMetric) receives a highlighted background
 * in addition to its border.
 *
 * Props:
 * - item: facility data object
 * - linkState: optional router state passed through to the facility profile link
 *   (e.g. { from: 'rankings' } to preserve the breadcrumb trail)
 * - activeMetric: which stat block to visually highlight — matches the active sortBy field
 *   ('overall_rating' | 'health_inspection_rating' | 'staffing_rating' | 'operating_margin')
 */
export function BrowseNursingHomesRatings({ item, linkState, activeMetric }) {
  if (!item) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="text-paragraph-base text-red-600">
            Error: Invalid facility data
          </p>
        </div>
      </div>
    );
  }

  const facilityHref = `/facilities/${item.slug}`;
  const facilityName = toTitleCase(item.provider_name || 'Unknown Facility');

  const stats = [
    {
      key: 'overall_rating',
      label: 'Overall',
      value: item.overall_rating ?? '—',
      type: 'stars',
    },
    {
      key: 'health_inspection_rating',
      label: 'Health insp.',
      value: item.health_inspection_rating ?? '—',
      type: 'stars',
    },
    {
      key: 'staffing_rating',
      label: 'Staffing',
      value: item.staffing_rating ?? '—',
      type: 'stars',
    },
    {
      key: 'operating_margin',
      label: 'Financial',
      value: item.operating_margin ?? '—',
      comparison: item.cmpr_operating_margin ?? null,
      comparisonColor: getCmprColor(item.cmpr_operating_margin, true),
      type: 'financial',
    },
  ];
  return (
    <Link
      to={facilityHref}
      state={linkState}
      className="focus-ring-light block rounded-lg"
      aria-label={`View profile for ${facilityName}`}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Name + Address */}
        <div className="md:col-span-2">
          <span
            className="text-heading-xs font-bold text-blue-600 underline"
            style={{
              textDecorationThickness: '2px',
              textUnderlineOffset: '2px',
            }}
          >
            {facilityName}
          </span>
          <p className="text-paragraph-base text-content-secondary hidden py-2 md:block md:py-0 md:pt-2">
            {item.street_address && item.city && item.state
              ? `${toTitleCase(item.street_address || '')}, ${toTitleCase(item.city || '')}, ${item.state || ''}`
              : 'Address not available'}
          </p>
        </div>

        {/* Button — Top right on desktop, bottom on mobile */}
        <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
          <span className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto">
            View Profile
          </span>
        </div>

        {/* Divider */}
        <Divider className="order-2 md:order-none md:col-span-3" />

        {/* Bottom Row — rating stats. cursor-default prevents the pointer cursor
            on hover, signalling these blocks are informational, not interactive. */}
        <div className="order-2 flex cursor-default flex-col gap-2 md:order-none md:col-span-3 md:flex-row">
          {stats.map((stat) => {
            const isActive = stat.key === activeMetric;
            return (
              <div
                key={stat.key}
                className={clsx(
                  'flex flex-1 gap-1 rounded-md px-3 py-2 md:flex-col',
                  isActive
                    ? 'bg-background-secondary border-border-primary border'
                    : // Financial always gets a border (inactive) to visually group
                      // its two-row layout; active state upgrades it with a background.
                      stat.type === 'financial' &&
                        'border-border-primary border',
                )}
              >
                {stat.type === 'financial' ? (
                  // Financial block: row1 = label + badge, row2 = op. margin + value
                  // flex-col + w-full ensures two-row layout even when parent is flex-row (mobile)
                  <div className="flex w-full flex-col">
                    <div className="flex items-center justify-between">
                      <p className="text-paragraph-sm text-content-secondary">
                        {stat.label}
                      </p>
                      {stat.comparison && (
                        <Badge color={stat.comparisonColor || 'zinc'}>
                          {stat.comparison.toLowerCase().includes('above')
                            ? 'Above avg.'
                            : stat.comparison.toLowerCase().includes('below')
                              ? 'Below avg.'
                              : 'Avg.'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-paragraph-sm text-content-tertiary">
                        op. margin
                      </span>
                      <span className="text-paragraph-base font-bold">
                        {typeof stat.value === 'number'
                          ? `${stat.value.toFixed(1)}%`
                          : stat.value}
                      </span>
                    </div>
                  </div>
                ) : stat.type === 'stars' ? (
                  // Mobile: label left, stars right. Desktop: label top, stars below.
                  <div className="flex w-full items-center justify-between md:flex-col md:items-start">
                    <p className="text-paragraph-sm text-content-secondary">
                      {stat.label}
                    </p>
                    <StarRating
                      title=""
                      rating={typeof stat.value === 'number' ? stat.value : 0}
                      size="h-4 w-4"
                      ratingSize="sm"
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
}

BrowseNursingHomesRatings.propTypes = {
  item: PropTypes.object.isRequired,
  linkState: PropTypes.object,
  activeMetric: PropTypes.oneOf([
    'overall_rating',
    'health_inspection_rating',
    'staffing_rating',
    'operating_margin',
  ]),
};

/**
 * Chain ranking card used on the Rankings page (/rankings/chains).
 *
 * Renders one chain entry in the paginated rankings list via ListContainer.
 * Clicking navigates to a filtered facility list for that chain.
 *
 * Expected item shape: name, count, slug, states (array of state abbreviations).
 * `states` is optional — falls back gracefully until the API returns it.
 */
export function BrowseChains({ item }) {
  const chainName = toTitleCase(item.name);
  const states = item.states || [];
  const visibleStates = states.slice(0, 10);
  const extraCount = states.length - visibleStates.length;

  return (
    <Link
      to={`/facilities?chain=${encodeURIComponent(item.slug)}`}
      state={{ from: 'rankings' }}
      className="focus-ring-light block rounded-lg"
      aria-label={`View facilities for ${chainName}`}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Name + Facility Count */}
        <div className="md:col-span-2">
          <span
            className="text-heading-xs font-bold text-blue-600 underline"
            style={{
              textDecorationThickness: '2px',
              textUnderlineOffset: '2px',
            }}
          >
            {chainName}
          </span>
          <div className="flex flex-row items-baseline gap-1 py-2 md:py-0 md:pt-2">
            <p className="text-paragraph-base text-content-secondary">
              Total Facilities:
            </p>
            <p className="text-paragraph-base text-core-black font-semibold">
              {item.count}
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
          <span className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto">
            View Facilities
          </span>
        </div>

        {/* Divider */}
        <Divider className="order-2 md:order-none md:col-span-3" />

        {/* Bottom Row — States */}
        <div className="order-2 flex flex-col gap-4 md:order-none md:col-span-3 md:h-full md:flex-row md:items-center md:justify-start md:gap-6">
          <div className="flex flex-row items-baseline gap-1">
            <p className="text-paragraph-base text-content-secondary">
              States:
            </p>
            <p className="text-paragraph-base text-core-black font-semibold">
              {states.length || '—'}
            </p>
          </div>
          {states.length > 0 && (
            <div className="md:flex md:flex-row md:border-l md:border-gray-400 md:pl-6">
              <p className="text-paragraph-base text-core-black">
                {visibleStates.join(', ')}
                {extraCount > 0 && (
                  <span className="text-content-secondary">
                    {' '}
                    +{extraCount} more
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

BrowseChains.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    states: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/**
 * Owner card used on the Owners browse page (/owners).
 *
 * Renders one ownership entity in the paginated browse list via ListContainer.
 * Clicking navigates to the owner's profile page.
 *
 * Expected item shape: slug, cms_ownership_name, cms_owner_total_facilities,
 * cms_ownership_type, states (array of state abbreviations from the API).
 */
export function BrowseOwners({ item, linkState }) {
  if (!item) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="text-paragraph-base text-red-600">
            Error: Invalid ownership data
          </p>
        </div>
      </div>
    );
  }

  const ownerHref = `/owners/${item.slug}`;
  const ownerName = toTitleCase(item.cms_ownership_name || 'Unknown Owner');
  const states = item.states || [];
  const visibleStates = states.slice(0, 10);
  const extraCount = states.length - visibleStates.length;
  return (
    <Link
      to={ownerHref}
      state={linkState}
      className="focus-ring-light block rounded-lg"
      aria-label={`View profile for ${ownerName}`}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Name + Address */}
        <div className="md:col-span-2">
          <span
            className="text-heading-xs font-bold text-blue-600 underline"
            style={{
              textDecorationThickness: '2px',
              textUnderlineOffset: '2px',
            }}
          >
            {ownerName}
          </span>
          {states.length > 0 && (
            <p className="text-paragraph-base text-content-secondary hidden py-2 md:block md:py-0 md:pt-2">
              <span className="md:pr-1">States:</span>
              <span className="text-core-black font-semibold">
                {visibleStates.join(', ')}
                {extraCount > 0 && (
                  <span className="text-content-secondary">
                    {' '}
                    +{extraCount} more
                  </span>
                )}
              </span>
            </p>
          )}
        </div>

        {/* Button — Top right on desktop, bottom on mobile */}
        <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
          <span className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto">
            View Profile
          </span>
        </div>

        {/* Divider */}
        <Divider className="order-2 md:order-none md:col-span-3" />

        {/* Bottom Row */}
        <div className="order-2 flex flex-col gap-4 md:order-none md:col-span-3 md:h-full md:flex-row md:items-center md:justify-start md:gap-6">
          <div className="md:flex md:flex-row">
            <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
              Total Facilities:
            </p>
            <p className="text-paragraph-base text-core-black font-semibold">
              {item.cms_owner_total_facilities ||
                item.facility_ownership_links?.length ||
                0}
            </p>
          </div>

          <div className="md:flex md:flex-row md:border-l md:border-gray-400 md:pl-6">
            <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
              Ownership Type:
            </p>
            <p className="text-paragraph-base text-core-black font-semibold">
              {toTitleCase(item.cms_ownership_type || 'N/A')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

BrowseOwners.propTypes = {
  item: PropTypes.shape({
    slug: PropTypes.string,
    cms_ownership_name: PropTypes.string,
    cms_owner_total_facilities: PropTypes.number,
    cms_ownership_type: PropTypes.string,
    states: PropTypes.arrayOf(PropTypes.string),
    facility_ownership_links: PropTypes.arrayOf(
      PropTypes.shape({
        facility: PropTypes.shape({
          state: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  linkState: PropTypes.object,
};

/**
 * Long-form metric card used in tab sections such as Clinical Quality and Financial Overview.
 *
 * Expected item shape:
 * - title, subtitle: metric labels shown on the left
 * - value: primary metric value shown prominently
 * - comparison, comparisonColor: optional badge content for benchmark comparisons
 * - detail1, detail2: supporting benchmark or summary text shown below
 *
 * These items are typically built by the metric helper files in src/lib.
 */
export function MetricCardLong({ item }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-0 xl:grid-cols-3">
      {/** Main Percent and Color Badge */}
      <div className="flex items-center gap-4 md:order-2 xl:pl-8">
        <p className="text-heading-lg">{item.value}</p>
        {item.comparison && (
          <Badge
            className="text-paragraph-xs max-w-44 py-1 font-medium"
            color={item.comparisonColor || 'gray'}
          >
            {toTitleCase(item.comparison)}
          </Badge>
        )}
      </div>
      {/** Title and Subtitle */}
      <div className="md:order-1 md:col-span-2">
        <p className="text-label-lg mb-1">{item.title}</p>
        <p className="text-label-base text-content-secondary">
          {item.subtitle}
        </p>
      </div>
      {/** Empty space for desktop display */}
      <div className="md:order-3 md:col-span-2"></div>
      <div className="md:order-4 xl:pl-8">
        <p className="text-paragraph-base text-content-secondary mb-1">
          {item.detail1}
        </p>
        <p className="text-paragraph-base text-content-secondary">
          {item.detail2}
        </p>
      </div>
    </div>
  );
}

MetricCardLong.propTypes = {
  item: PropTypes.object.isRequired,
};

/**
 * Compact metric row for the network graph side panel.
 *
 * Responsibilities:
 * - Renders a single clinical quality or financial metric in a 3-column grid
 * - Title spans 2 columns; value + detail stats are right-aligned in the third
 * - Adapts colors between desktop (light) and mobile (dark sheet) via `variant`
 *
 * Notes:
 * - Prefers `displayValue` over `value` — builders attach the formatted suffix there.
 * - Detail labels abbreviate "Median:" → "Med" and "Std Dev:" → "SD" to fit the
 *   narrow column; the full strings are preserved in the aria-label for screen readers.
 */
export function MetricCardShort({ item, variant }) {
  const isMobile = variant === 'mobile';
  return (
    <div
      className={clsx(
        'grid grid-cols-3 px-4 py-2',
        isMobile
          ? 'bg-zinc-900 hover:bg-zinc-800'
          : 'bg-core-white hover:bg-gray-50',
      )}
    >
      {/** Title */}
      <div className="col-span-2 self-center">
        <p
          className={clsx(
            'text-label-sm font-medium',
            isMobile ? 'text-core-white' : 'text-core-black',
          )}
        >
          {item.title}
        </p>
      </div>
      {/** Value + details stacked right */}
      <div className="flex flex-col items-end">
        <p
          className={clsx(
            'text-label-lg font-medium',
            isMobile ? 'text-core-white' : 'text-core-black',
          )}
        >
          {item.displayValue ?? item.value}
        </p>
        <p
          aria-label={`${item.detail1}, ${item.detail2}`}
          className={clsx(
            'text-label-xs',
            isMobile ? 'text-content-tertiary' : 'text-content-secondary',
          )}
        >
          {item.detail1?.replace('Median:', 'Med')} ·{' '}
          {item.detail2?.replace('Std Dev:', 'SD')}
        </p>
      </div>
    </div>
  );
}

MetricCardShort.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    displayValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    detail1: PropTypes.string,
    detail2: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

/**
 * Compact staffing row for the network graph side panel.
 *
 * Responsibilities:
 * - Renders a single staffing metric (levels or turnover) in a 3-column grid
 * - Title spans 2 columns; stat + median detail are right-aligned in the third
 * - Adapts colors between desktop (light) and mobile (dark sheet) via `variant`
 *
 * Notes:
 * - Prefers `displayStat` over `stat` — builders attach the formatted suffix there.
 * - "Median:" is abbreviated to "Med" at render time; the full string is kept in
 *   aria-label so screen readers get the unabbreviated label.
 */
export function StaffingCardShort({ item, variant }) {
  const isMobile = variant === 'mobile';
  return (
    <div
      className={clsx(
        'grid grid-cols-3 px-4 py-2',
        isMobile
          ? 'bg-zinc-900 hover:bg-zinc-800'
          : 'bg-core-white hover:bg-gray-50',
      )}
    >
      <div className="col-span-2 self-center">
        <p
          className={clsx(
            'text-label-sm font-medium',
            isMobile ? 'text-core-white' : 'text-core-black',
          )}
        >
          {item.key}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <p
          className={clsx(
            'text-label-lg font-medium',
            isMobile ? 'text-core-white' : 'text-core-black',
          )}
        >
          {item.displayStat ?? item.stat}
        </p>
        <p
          aria-label={item.detail1}
          className={clsx(
            'text-label-xs',
            isMobile ? 'text-content-tertiary' : 'text-content-secondary',
          )}
        >
          {item.detail1?.replace('Median:', 'Med')}
        </p>
      </div>
    </div>
  );
}

StaffingCardShort.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    displayStat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    detail1: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

//This componenet is specifically designed to show the ("Li") shared facilities of the hub owner in the Network Graph Module side panel.
export function NetworkSidePanelList({ item, onSelectNode, variant }) {
  const isMobile = variant === 'mobile';
  return (
    <button
      type="button"
      onClick={() => onSelectNode?.(item.ownerId)} // <-- THIS pins/selects Sigma node
      className={clsx(
        variant === 'mobile' ? 'focus-panel-dark' : 'focus-panel-light',
        'flex w-full items-center gap-4 rounded-md px-4 py-2 text-left text-sm hover:cursor-pointer',
        isMobile ? 'bg-zinc-900' : 'bg-white hover:bg-gray-50',
      )}
    >
      {/* Icon */}
      {item.cms_ownership_type === 'Individual' ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700">
          <UserIcon className="h-5 w-5 text-white" />
        </div>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-700">
          <BuildingOffice2Icon className="h-5 w-5 text-white" />
        </div>
      )}
      {/* Text block */}
      <div className="flex min-w-0 flex-col">
        <span
          className={clsx(
            'text-label-sm truncate font-medium',
            isMobile ? 'text-core-white' : 'text-core-black',
          )}
        >
          {item.ownerName}
        </span>

        <span
          className={clsx(
            'text-label-xs',
            isMobile ? 'text-content-tertiary' : 'text-content-secondary',
          )}
        >
          {item.count} {item.count === 1 ? 'Link' : 'Links'}
        </span>
      </div>
    </button>
  );
}

NetworkSidePanelList.propTypes = {
  item: PropTypes.object.isRequired,
  onSelectNode: PropTypes.func,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

/**
 * Single row for the state ranking tables.
 *
 * Expected item shape:
 * - rank: number (1-based position)
 * - name: state name string
 *
 * Props:
 * - to: optional URL string; when provided, renders the state name as a link
 *   to the facilities browse page pre-filtered by state and sort.
 *   The link passes router state { from: 'rankings' } so the facilities page
 *   renders the correct breadcrumb trail back to rankings.
 */
export function RankingTableRow({ item, to }) {
  return (
    <div
      className="flex items-center justify-between"
      aria-label={`${item.name}, ranked number ${item.rank}`}
    >
      <div className="flex items-center gap-4">
        <span
          className="text-paragraph-base text-content-secondary text-right"
          aria-hidden="true"
        >
          {item.rank}
        </span>
        {to ? (
          <Link
            to={to}
            state={{ from: 'rankings' }}
            className="text-paragraph-base font-medium text-blue-700 underline hover:text-blue-800"
          >
            {item.name}
          </Link>
        ) : (
          <span className="text-paragraph-base text-core-black font-medium">
            {item.name}
          </span>
        )}
      </div>
      <Badge color={item.badgeColor || 'green'} aria-hidden="true">
        #{item.rank}
      </Badge>
    </div>
  );
}

RankingTableRow.propTypes = {
  item: PropTypes.shape({
    rank: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    badgeColor: PropTypes.string,
  }).isRequired,
  to: PropTypes.string,
};

/**
 * Card for the home-page "Explore by State" choropleth.
 *
 * Renders one state's stats for the active metric: facility count, the metric
 * value, and the state's national rank, plus the profile call-to-action.
 *
 * `interactive` controls the CTA because the two placements have opposite click
 * semantics: the desktop card floats under the cursor and is pointer-events-none,
 * so it can only be a hint ("Click to view …") while the state itself is the
 * click target. The touch card sits in a fixed panel below the map, so it can be
 * a real, tappable <Link>. `className` lets the panel widen past the floating
 * card's fixed width.
 *
 * Expected item shape (built by buildStateMapCards in stateChoroplethMetrics.js):
 * - stateName, stateCode: display name + route key for /states/:state
 * - facilityCount: total facilities in the state
 * - ratingLabel: label for the value row (e.g. "Overall rating", "Op. margin")
 * - format: 'stars' | 'percent' | 'number'
 * - value: numeric value (used for the star fill)
 * - displayValue: preformatted value string (e.g. "3.1", "7.5%", "-5.1%")
 * - rank, totalRanked: national rank shown as "{rank} of {totalRanked}"
 */
export function StateMapCard({ item, interactive = false, className }) {
  if (!item) return null;

  const stateName = toTitleCase(item.stateName || '');

  return (
    <div
      className={clsx(
        'border-border-primary rounded-lg border bg-white p-4 shadow-lg',
        className || 'w-64',
      )}
    >
      <p className="text-label-lg text-core-black mb-3 font-bold">
        {stateName}
      </p>

      <dl className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <dt className="text-paragraph-sm text-content-secondary">
            Facilities
          </dt>
          <dd className="text-paragraph-sm text-core-black">
            {item.facilityCount ?? '—'}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-paragraph-sm text-content-secondary">
            {item.ratingLabel}
          </dt>
          <dd className="text-paragraph-sm text-core-black flex items-center">
            {item.format === 'stars' ? (
              /* dd is flex so the stars have no baseline line-box lifting them
                 above the label. -mr-2 cancels StarRating's trailing px-2 so the
                 number sits flush right; [&_span]:pt-0 drops its top padding so
                 the stars/number center vertically instead of riding high. */
              <span className="-mr-2 inline-block [&_span]:pt-0">
                <StarRating
                  title=""
                  rating={typeof item.value === 'number' ? item.value : 0}
                  size="h-3.5 w-3.5"
                  ratingSize="xs"
                />
              </span>
            ) : (
              /* Op. margin: green for positive, red for negative */
              <span
                className={clsx(
                  'font-bold',
                  typeof item.value === 'number' && item.value > 0
                    ? 'text-green-700'
                    : typeof item.value === 'number' && item.value < 0
                      ? 'text-red-700'
                      : 'text-core-black',
                )}
              >
                {item.displayValue ?? '—'}
              </span>
            )}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-paragraph-sm text-content-secondary">
            National rank
          </dt>
          <dd className="text-paragraph-sm text-core-black">
            {item.rank != null ? `${item.rank} of ${item.totalRanked}` : '—'}
          </dd>
        </div>
      </dl>

      <Divider className="my-3" />

      {interactive ? (
        <Link
          to={`/states/${item.stateCode}`}
          className="focus-ring-light text-paragraph-sm inline-flex items-center gap-1 rounded-sm font-medium text-blue-600"
        >
          View {stateName} profile
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        /* The floating desktop card follows the cursor and is pointer-events-none,
           so this is a hint, not a link — the whole state is the click target
           (see the map's onStateSelect). */
        <p className="text-paragraph-sm inline-flex items-center gap-1 font-medium text-blue-600">
          Click to view {stateName} profile
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </p>
      )}
    </div>
  );
}

StateMapCard.propTypes = {
  item: PropTypes.shape({
    stateName: PropTypes.string,
    stateCode: PropTypes.string,
    facilityCount: PropTypes.number,
    ratingLabel: PropTypes.string,
    format: PropTypes.oneOf(['stars', 'percent', 'number']),
    value: PropTypes.number,
    displayValue: PropTypes.string,
    rank: PropTypes.number,
    totalRanked: PropTypes.number,
  }),
  interactive: PropTypes.bool,
  className: PropTypes.string,
};

/* Row layout for the Property Details flag banners */
const FLAG_BANNER_ROW =
  'flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4';

/**
 * One matched entity in the Property Details tab's related-party banner: the
 * entity, what it matched on, and its ownership role.
 */
export function RelatedPartyMatch({ item }) {
  const badge = badgeConfig[item.cms_ownership_role];
  const matchedOn = item.matched_on ?? [];

  return (
    <div className={FLAG_BANNER_ROW}>
      <div>
        <Link
          to={`/owners/${item.entity_slug}`}
          className="focus-ring-light text-paragraph-base rounded-sm font-medium text-blue-600 underline"
        >
          {item.entity_name}
        </Link>

        {matchedOn.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-paragraph-sm text-content-secondary">
              Matched on
            </span>
            {matchedOn.map((type) => (
              <MatchChip key={type} type={type} />
            ))}
          </div>
        )}
      </div>

      {badge && (
        <Badge color={badge.color} className="shrink-0">
          {badge.label}
        </Badge>
      )}
    </div>
  );
}

RelatedPartyMatch.propTypes = {
  item: PropTypes.shape({
    entity_name: PropTypes.string.isRequired,
    entity_slug: PropTypes.string.isRequired,
    matched_on: PropTypes.arrayOf(PropTypes.string),
    cms_ownership_role: PropTypes.string,
  }).isRequired,
};

/**
 * One property in the Property Details tab's associated-properties banner.
 *
 * The trailing VIEW is a span, not a link or button: it is inert until the
 * property API can serve a second property, and a focusable control that does
 * nothing is worse than plain text for a keyboard user.
 */
export function AssociatedProperty({ item }) {
  return (
    <div className={FLAG_BANNER_ROW}>
      <div>
        <p className="text-paragraph-base text-content-primary">
          {item.address}
        </p>

        <div className="text-paragraph-sm text-content-secondary mt-0.5 flex flex-wrap items-center gap-2">
          <span>{item.description}</span>
          {item.related_party && (
            <>
              <span aria-hidden="true">|</span>
              <span className="inline-flex items-center gap-1">
                <ExclamationTriangleIcon className="size-4 shrink-0 text-amber-500" />
                Related Party
              </span>
            </>
          )}
        </div>
      </div>

      {item.is_current ? (
        <span className="text-label-sm text-content-secondary shrink-0 uppercase">
          Viewing
        </span>
      ) : (
        <span className="text-label-sm shrink-0 text-blue-600 uppercase">
          View
        </span>
      )}
    </div>
  );
}

AssociatedProperty.propTypes = {
  item: PropTypes.shape({
    address: PropTypes.string.isRequired,
    description: PropTypes.string,
    related_party: PropTypes.bool,
    is_current: PropTypes.bool,
  }).isRequired,
};
