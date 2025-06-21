import React from 'react';
import { Badge } from '../atom/badge';
import { formatOwnershipPercentage } from '../../../lib/stringFormatters';
import StarRating from './starRating';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Divider } from '../atom/divider';
import { toTitleCase } from '../../../lib/toTitleCase';
/*Todo: 
-Extract badgeColorVariant to helper file
-The long keys inside badge will need a design decision and likey need to be converted for display
-When access to real query data is granted will need to make small changes from test data setup
*/

export function OwnershipAndStakeholders({ item }) {
  const badgeColorVariantsOwnership = {
    '5% OR GREATER DIRECT OWNERSHIP INTEREST': 'cyan',
    '5% OR GREATER INDIRECT OWNERSHIP INTEREST': 'indigo',
    'OPERATIONAL/MANAGERIAL CONTROL': 'fuchsia',
    'CORPORATE OFFICER': 'pink',
    'MANAGING EMPLOYEE': 'rose',
  };
  const badgeColor = badgeColorVariantsOwnership[item.CMS_Ownership_Role];

  return (
    <>
      <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 sm:items-start">
        {/* Col 1 - Row 1 */}
        <div className="text-label-xs order-1 sm:order-none">
          {item.CMS_Ownership_Type.toUpperCase()}
        </div>

        {/* Col 2 - Row 1 */}
        <div className="text-label-xs order-3 sm:order-none">
          OWNERSHIP PERCENTAGE
        </div>

        {/* Col 3 - spans both rows */}
        <div className="order-last row-span-2 sm:order-none sm:flex sm:h-full sm:items-center">
          <Badge className="max-w-44" color={badgeColor}>
            {item.CMS_Ownership_Role}
          </Badge>
        </div>

        {/* Col 1 - Row 2 */}
        <div className="text-paragraph-base order-2 sm:order-none">
          {item.CMS_Ownership_Name}
        </div>

        {/* Col 2 - Row 2 */}
        <div className="text-paragraph-base order-4 sm:order-none">
          {formatOwnershipPercentage(item.CMS_Ownership_Percentage)}
        </div>
      </div>
    </>
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
  return (
    <>
      <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 sm:items-start sm:gap-x-4">
        {/* Col 1 - Row 1 */}
        <div className="text-paragraph-base order-1 font-bold text-blue-700 underline sm:order-none">
          {item.Facility_Name}
        </div>

        {/* Col 2 - spans both rows */}
        <div className="order-3 row-span-2 sm:order-none sm:flex sm:items-center">
          <StarRating
            title="Overall CMS Rating"
            rating={item.CMS_Rating}
            className="text-paragraph-base"
          />
        </div>

        {/* Col 3 - Row 1 */}
        <div className="text-paragraph-base order-3 font-bold sm:order-none">
          {item.Total_Deficiencies > 0 ? (
            `${item.Total_Deficiencies} Total Deficiencies`
          ) : (
            <span className="invisible">(0 Total_Deficiencies)</span>
          )}
        </div>

        {/* Col 1 - Row 2 */}
        <div className="text-paragraph-base order-2 sm:order-none">
          {`${item.Address}, ${item.City}, ${item.State}`}
        </div>

        {/* Col 1 - Row 3 */}
        <div className="text-paragraph-base order-4 sm:order-none">
          {item.Serious_Deficiencies > 0 ? (
            `${item.Serious_Deficiencies} Serious Deficienc${item.Serious_Deficiencies > 1 ? 'ies' : 'y'}`
          ) : (
            <span className="invisible">(0 Serious_Deficiencies)</span>
          )}
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
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Name + Address */}
      <div className="md:col-span-2">
        <a
          href="#"
          className="text-heading-xs font-bold text-blue-600 underline"
          style={{
            textDecorationThickness: '2px',
            textUnderlineOffset: '2px',
          }}
        >
          {toTitleCase(item.name)}
        </a>
        <p className="text-paragraph-base text-content-secondary hidden py-2 md:block md:py-0 md:pt-2">
          {toTitleCase(item.address)}, {toTitleCase(item.city)}, {item.state}
        </p>
      </div>

      {/* Button — Top right on desktop, bottom on mobile */}
      <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
        <Link
          to={`/facilities/${item.id}`}
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
            {/* {toTitleCase(item.owner)}*/}Alliance HealthCare
          </p>
        </div>

        <div className="md:flex md:flex-row">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            Ownership Type:
          </p>
          <p className="text-paragraph-base text-core-black font-semibold">
            {/* {toTitleCase(item.ownershipType)} */}NonProfit
          </p>
        </div>
      </div>
    </div>
  );
}

export function BrowseOwners({ item }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Name + Address */}
      <div className="md:col-span-2">
        <a
          href="#"
          className="text-heading-xs font-bold text-blue-600 underline"
          style={{
            textDecorationThickness: '2px',
            textUnderlineOffset: '2px',
          }}
        >
          {toTitleCase(item.name)}
        </a>
        <p className="text-paragraph-base text-content-secondary hidden py-2 md:block md:py-0 md:pt-2">
          {toTitleCase(item.address)}, {toTitleCase(item.city)}, {item.state}
        </p>
      </div>

      {/* Button — Top right on desktop, bottom on mobile */}
      <div className="order-3 md:order-none md:flex md:items-center md:justify-end">
        <Link
          to={`/facilities/${item.id}`}
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
            {/* {toTitleCase(item.owner)}*/}Alliance HealthCare
          </p>
        </div>

        <div className="md:flex md:flex-row">
          <p className="text-paragraph-base text-content-secondary pb-1 md:pr-1 md:pb-0">
            Ownership Type:
          </p>
          <p className="text-paragraph-base text-core-black font-semibold">
            {/* {toTitleCase(item.ownershipType)} */}NonProfit
          </p>
        </div>
      </div>
    </div>
  );
}
