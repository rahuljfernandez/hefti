import React from 'react';
import { Badge } from '../atom/badge';
import { formatOwnershipPercentage } from '../../../lib/stringFormatters';
import StarRating from './starRating';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Divider } from '../atom/divider';
import { toTitleCase } from '../../../lib/toTitleCase';
import { slugify } from '../../../lib/slugify';
import { badgeConfig } from '../../../lib/getBadgeColor';
import { ownerRoleMap } from '../../../lib/ownerRolehelper';
/*Todo: 
reit/pe is that working for OwnershipAndStaekholders?
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
          className="text-heading-xs font-bold text-blue-600 underline"
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
      <div className="order-2 flex flex-col gap-4 md:order-none md:col-span-3 md:h-full md:flex-row md:items-center md:justify-start md:gap-6 md:divide-x md:divide-gray-400">
        <div className="gap-2 md:flex md:flex-col md:pr-6">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            OWNERHSIP PERCENTAGE
          </p>
          <p className="text-paragraph-base text-core-black">
            {formatOwnershipPercentage(item.cms_ownership_percentage)}
          </p>
        </div>

        <div className="gap-2 md:flex md:flex-col">
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

//facilty name is probably a link?
export function RelatedFacilities({ item }) {
  const roleKey = item.cms_ownership_role || 'N/A';
  const roleLabel = ownerRoleMap[roleKey]?.label;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 font-sans md:grid-cols-3">
        {/* Name + Address */}
        <div className="md:col-span-2">
          <Link
            to={`/facilities/${item.slug}`}
            className="text-paragraph-base order-1 font-bold text-blue-700 underline sm:order-none"
          >
            {toTitleCase(item.provider_name)}
          </Link>
          <div className="text-paragraph-base text-content-secondary order-2 md:order-none">
            {`${toTitleCase(item.street_address)}, ${toTitleCase(item.city)}, ${item.state} ${
              item.zip_code
            }`}
          </div>
        </div>
        {/* Button — Top right on desktop, bottom on mobile */}
        <div className="order-5 md:order-none md:flex md:items-center md:justify-end">
          <Link
            to={`/facilities/${item.slug}`}
            className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto"
          >
            View Profile
          </Link>
        </div>

        {/* Divider */}
        <Divider className="order-2 md:order-none md:col-span-3" />

        {/* Col 2 - spans both rows */}
        <div className="order-3 md:order-none md:col-span-3 md:flex md:items-center md:justify-start md:gap-6 md:divide-x md:divide-gray-400">
          {/* CMS Rating */}
          <div className="flex flex-col items-start pr-6 md:flex-row md:items-center md:gap-2">
            <p className="text-paragraph-base text-content-secondary">
              CMS Rating
            </p>
            <StarRating
              rating={item.overall_rating}
              className="text-paragraph-base text-content-secondary"
            />
          </div>

          {/* Owner Role */}
          <div className="flex flex-col md:flex-row md:gap-2">
            <p className="text-paragraph-base text-content-secondary pb-1">
              Owners Role:
            </p>
            <p className="text-paragraph-base text-core-black font-bold">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </>
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

export function BrowseNursingHomes({ item }) {
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Name + Address */}
      <div className="md:col-span-2">
        <Link
          to={`/facilities/${item.slug}`}
          className="text-heading-xs font-bold text-blue-600 underline"
          style={{
            textDecorationThickness: '2px',
            textUnderlineOffset: '2px',
          }}
        >
          {toTitleCase(item.provider_name || 'Unknown Facility')}
        </Link>
        <p className="text-paragraph-base text-content-secondary hidden py-2 md:block md:py-0 md:pt-2">
          {item.street_address && item.city && item.state
            ? `${toTitleCase(item.street_address || '')}, ${toTitleCase(item.city || '')}, ${item.state || ''}`
            : 'Address not available'}
        </p>
      </div>

      {/* Button — Top right on desktop, bottom on mobile */}
      <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
        <Link
          to={`/facilities/${item.slug}`}
          className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto"
        >
          View Profile
        </Link>
      </div>

      {/* Divider */}
      <Divider className="order-2 md:order-none md:col-span-3" />

      {/* Bottom Row */}
      <div className="order-2 flex flex-col gap-4 md:order-none md:col-span-3 md:h-full md:flex-row md:items-center md:justify-start md:gap-6 md:divide-x md:divide-gray-400">
        <div className="md:flex md:flex-row md:pr-6">
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

        <div className="md:flex md:flex-row">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            Ownership Type:
          </p>
          <p className="text-paragraph-base text-core-black font-semibold">
            {toTitleCase(item.ownership_type || 'N/A')}
          </p>
        </div>
      </div>
    </div>
  );
}

BrowseNursingHomes.propTypes = {
  item: PropTypes.object.isRequired,
};

export function BrowseOwners({ item }) {
  // Add error handling for missing or malformed data
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

  // Get the first facility for display (or handle multiple)
  const primaryFacility = item.facility_ownership_links?.[0]?.facility;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Name + Address */}
      <div className="md:col-span-2">
        <Link
          to={`/owners/${item.slug}`}
          className="text-heading-xs font-bold text-blue-600 underline"
          style={{
            textDecorationThickness: '2px',
            textUnderlineOffset: '2px',
          }}
        >
          {toTitleCase(item.cms_ownership_name || 'Unknown Owner')}
        </Link>
        <p className="text-paragraph-base text-content-secondary hidden py-2 md:block md:py-0 md:pt-2">
          {primaryFacility &&
          primaryFacility.street_address &&
          primaryFacility.city &&
          primaryFacility.state
            ? `${toTitleCase(primaryFacility.street_address)}, ${toTitleCase(primaryFacility.city)}, ${primaryFacility.state}`
            : 'Multiple locations'}
        </p>
      </div>

      {/* Button — Top right on desktop, bottom on mobile */}
      <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
        <Link
          to={`/owners/${item.slug}`}
          className="text-label-base border-border-primary inline-block w-full rounded-lg border px-4 py-2 text-center font-extrabold md:w-auto"
        >
          View Profile
        </Link>
      </div>

      {/* Divider */}
      <Divider className="order-2 md:order-none md:col-span-3" />

      {/* Bottom Row */}
      <div className="order-2 flex flex-col gap-4 md:order-none md:col-span-3 md:h-full md:flex-row md:items-center md:justify-start md:gap-6 md:divide-x md:divide-gray-400">
        <div className="md:flex md:flex-row md:pr-6">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            Total Facilities:
          </p>
          <p className="text-paragraph-base text-core-black font-semibold">
            {item.cms_owner_total_facilities ||
              item.facility_ownership_links?.length ||
              0}
          </p>
        </div>

        <div className="md:flex md:flex-row">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            Ownership Type:
          </p>
          <p className="text-paragraph-base text-core-black font-semibold">
            {toTitleCase(item.cms_ownership_type || 'N/A')}
          </p>
        </div>
      </div>
    </div>
  );
}

//MetricCardLong is suppose to be reusable, but want to come back to that once data is created.  For now (11/13/25), the layout is finished, just needs data
export function MetricCardLong({ item }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-0 xl:grid-cols-3">
      {/** Main Percent and Color Badge */}
      <div className="flex items-center gap-4 md:order-2 xl:pl-8">
        <p className="text-heading-lg">{item.value}</p>
        <Badge
          className="text-paragraph-xs max-w-44 py-1 font-medium"
          color={item.labelColor || 'gray'}
        >
          {toTitleCase(item.label || 'Unknown')}
        </Badge>
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
      {/** State and National Average */}
      <div className="md:order-4 xl:pl-8">
        <p className="text-paragraph-base text-content-secondary mb-1">{`${item.state} average: ${item.stateAvg}`}</p>
        <p className="text-paragraph-base text-content-secondary">{`National average: ${item.nationalAverage}`}</p>
      </div>
    </div>
  );
}
