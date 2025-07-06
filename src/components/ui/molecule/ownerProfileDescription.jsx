import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for the facility profile
 */

//Todo:
//Waiting on updated data.  The entire shape of the data will need to be contructed on the backend.  Will need to figure out breakdowns
export default function OwnerProfileDescription({ items }) {
  if (!items) return <div>No owner data available.</div>;

  const ownershipType = items.ownership_type ?? 'N/A';
  const operationalBreakdown = items.operational_breakdown ?? {};
  const ownershipRolesBreakdown = items.ownership_roles_breakdown ?? {};

  // Use real data if available, otherwise fallback to hardcoded values
  const ownerData = [
    { title: 'OWNERSHIP ROLES', value: items.ownership_roles ?? 5 },
    { title: 'STATES OR TERRITORIES', value: items.states_territories ?? ['FL, MD'] },
    { title: 'TOTAL DEFICIENCIES', value: items.total_deficiencies ?? 20 },
    { title: 'TOTAL PENALTIES', value: items.total_penalties ?? 5 },
    { title: 'TOTAL FINES', value: items.total_fines ?? 230000 },
    { title: 'OWNERSHIP TYPE', value: ownershipType },
    {
      title: 'OPERATIONAL BREAKDOWN',
      breakdown: operationalBreakdown,
    },
    {
      title: 'OWNERSHIP ROLES BREAKDOWN',
      breakdown: ownershipRolesBreakdown,
    },
  ];
  return (
    <div className="mt-6">
      <dl className="grid grid-cols-1 sm:grid-cols-2">
        {ownerData.map(({ title, value, breakdown }) => (
          <div key={title} className="px-4 pb-6 sm:col-span-1 sm:px-0">
            <dt className="text-label-sm text-content-secondary">{title}</dt>
            <dd className="text-paragraph-base text-content-primary mt-1">
              {breakdown && Object.keys(breakdown).length > 0 ? (
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
