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
  const facilityData = [
    {
      title: 'LOCATION',
      value: `${items.address}, ${items.city}, ${items.state}`,
    },
    { title: 'OWNERSHIP APPLICATION', value: items.ownership.ownership_type },
    { title: 'TELEPHONE NUMBER', value: 'Need db update' },
    { title: 'PROPERTY OWNER', value: items.ownership.reit_name },
    {
      title: 'AVERAGE NUMBER OF RESIDENTS PER DAY',
      value: items.resident_stats.number_of_residents,
    },
    { title: 'OPERATOR OWNER', value: items.ownership.pe_name },
    {
      title: 'NUMBER OF CERTIFIED BEDS',
      value: items.resident_stats.number_of_beds,
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
