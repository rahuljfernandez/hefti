import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../atom/badge';
import { getBadgeColorOwnershipType } from '../../../lib/getBadgeColor';
import { formatPhoneNumber } from '../../../lib/stringFormatters';
import { toTitleCase } from '../../../lib/toTitleCase';

/**
 * Component for the facility profile
 */

//Todo:
//Need to add zip code to location
//Add Telephone
//Clarify source for property owner and operator owner
//badges and logic

export default function FacilityProfileDescription({ items }) {
  if (!items) return <div>No facility data available.</div>;

  const address = items.address || items.street_address || '';
  const city = items.city || '';
  const state = items.state || '';
  const ownership = items.ownership_type || '';
  const numberResidents = items.number_of_residents || '';
  const phoneNumber = items.phone_number || '';
  const REITName = items.reit_name || '';
  const PEName = items.pe_name || '';
  const beds = items.number_of_beds || '';

  return (
    <div className="mt-6">
      <dl className="grid grid-cols-1 sm:grid-cols-2">
        <div className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary">LOCATION</dt>
          <dd className="text-paragraph-base text-content-primary mt-1">
            {address},<br />
            {city}, {state}
          </dd>
        </div>

        <div className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary">
            OWNERSHIP AFFILIATION
          </dt>
          <dd className="text-paragraph-base text-content-primary mt-1">
            <Badge color={getBadgeColorOwnershipType(ownership)}>
              {ownership ?? 'N/A'}
            </Badge>
          </dd>
        </div>

        <div className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary">
            TELEPHONE NUMBER
          </dt>
          <dd className="text-paragraph-base text-content-primary mt-1">
            {formatPhoneNumber(phoneNumber) ?? 'N/A'}
          </dd>
        </div>

        <div className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary">
            PROPERTY OWNER
          </dt>
          <dd className="text-paragraph-base text-content-primary mt-1 flex items-center gap-2 font-bold">
            {REITName !== '' ? (
              <>
                <span>{toTitleCase(REITName)}</span>
                <Badge color="yellow">REIT</Badge>
              </>
            ) : (
              <span className="text-content-secondary text-label-sm">N/A</span>
            )}
          </dd>
        </div>

        <div className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary">
            AVERAGE NUMBER OF RESIDENTS PER DAY
          </dt>
          <dd className="text-paragraph-base text-content-primary mt-1">
            {numberResidents ?? 'N/A'}
          </dd>
        </div>

        <div className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary">
            OPERATOR OWNER
          </dt>
          <dd className="text-paragraph-base text-content-primary mt-1 flex items-center gap-2 font-bold">
            {PEName !== '' ? (
              <>
                <span>{toTitleCase(PEName)}</span>
                <Badge color="blue">REIT</Badge>
              </>
            ) : (
              <span className="text-content-secondary text-label-sm">N/A</span>
            )}
          </dd>
        </div>

        <div className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary">
            NUMBER OF CERTIFIED BEDS
          </dt>
          <dd className="text-paragraph-base text-content-primary mt-1">
            {beds ?? 'N/A'}
          </dd>
        </div>
      </dl>
    </div>
  );
}

FacilityProfileDescription.propTypes = {
  items: PropTypes.shape({
    address: PropTypes.string,
    street_address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    ownership_type: PropTypes.string,
    number_of_beds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reit_name: PropTypes.string,
    number_of_residents: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    phone_number: PropTypes.string,
    pe_name: PropTypes.string,
  }).isRequired,
};
