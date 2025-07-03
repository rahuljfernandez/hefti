import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for the facility profile
 */

//Todo:
//Waiting on updated data.  The entire shape of the data will need to be contructed on the backend.  Will need to figure out breakdowns
export default function OwnerProfileDescription({ items }) {
  const ownerData = [
    { title: 'OWNERSHIP ROLES', value: 5 },
    { title: 'STATES OR TERRITORIES', value: ['FL, MD'] },
    { title: 'TOTAL DEFICIENCIES', value: 20 },
    { title: 'TOTAL PENALTIES', value: 5 },
    { title: 'TOTAL FINES', value: 230000 },
    { title: 'OWNERSHIP TYPE', value: items.ownership_type },
    {
      title: 'OPERATIONAL BREAKDOWN',
      breakdown: items.operational_breakdown,
    },
    {
      title: 'OWNERSHIP ROLES BREAKDOWN',
      breakdown: items.ownership_roles_breakdown,
    },
  ];
  return (
    <div className="mt-6">
      <dl className="grid grid-cols-1 sm:grid-cols-2">
        {ownerData.map(({ title, value, breakdown }) => (
          <div key={title} className="px-4 pb-6 sm:col-span-1 sm:px-0">
            <dt className="text-label-sm text-content-secondary">{title}</dt>
            <dd className="text-paragraph-base text-content-primary mt-1">
              {breakdown ? (
                <ul className="space-y-1">
                  {Object.entries(breakdown).map(([k, v]) => (
                    <li key={k}>
                      <span className="font-semibold">{v}</span> {k}
                    </li>
                  ))}
                </ul>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
