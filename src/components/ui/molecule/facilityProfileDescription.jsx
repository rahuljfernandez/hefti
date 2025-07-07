import React from 'react';
import PropTypes from 'prop-types';

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
  const ownership = items.ownership || {};
  const residentStats = items.resident_stats || {};

  const facilityData = [
    {
      title: 'LOCATION',
      value: `${address}, ${city}, ${state}`,
    },
    { title: 'OWNERSHIP APPLICATION', value: ownership.ownership_type ?? 'N/A' },
    { title: 'TELEPHONE NUMBER', value: items.phone_number ?? 'N/A' },
    { title: 'PROPERTY OWNER', value: ownership.reit_name ?? 'N/A' },
    {
      title: 'AVERAGE NUMBER OF RESIDENTS PER DAY',
      value: residentStats.number_of_residents ?? 'N/A',
    },
    { title: 'OPERATOR OWNER', value: ownership.pe_name ?? 'N/A' },
    {
      title: 'NUMBER OF CERTIFIED BEDS',
      value: residentStats.number_of_beds ?? 'N/A',
    },
  ];
  return (
    <div className="mt-6">
      <dl className="grid grid-cols-1 sm:grid-cols-2">
        {facilityData.map(({ title, value }) => (
          <div key={title} className="px-4 pb-6 sm:col-span-1 sm:px-0">
            <dt className="text-label-sm text-content-secondary">{title}</dt>
            <dd className="text-paragraph-base text-content-primary mt-1">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

FacilityProfileDescription.propTypes = {
  items: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
  }).isRequired,
};
