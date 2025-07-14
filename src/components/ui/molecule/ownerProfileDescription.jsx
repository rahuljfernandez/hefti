import React from 'react';
import PropTypes from 'prop-types';
import { formatUSD } from '../../../lib/stringFormatters';

/**
 * Component for the facility profile
 */

//Todo:
//Waiting on updated data.  The entire shape of the data will need to be contructed on the backend.  Will need to figure out breakdowns
export default function OwnerProfileDescription({ items }) {
  if (!items) return <div>No owner data available.</div>;

  const operationalBreakdown = items.operational_breakdown ?? {};
  const ownershipRolesBreakdown = items.ownership_roles_breakdown ?? {};

  // Use real data if available, otherwise fallback to hardcoded values
  const ownerData = [
    { title: 'OWNERSHIP ROLES', value: items.cms_broad_ownership_role },
    {
      title: 'STATES OR TERRITORIES',
      value: items.cms_owner_states,
    },
    { title: 'TOTAL DEFICIENCIES', value: items.cms_owner_n_deficiencies },
    { title: 'TOTAL PENALTIES', value: items.cms_owner_total_penalties },
    { title: 'TOTAL FINES', value: formatUSD(items.cms_owner_total_fines) },
    { title: 'OWNERSHIP TYPE', value: items.cms_ownership_type },
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
