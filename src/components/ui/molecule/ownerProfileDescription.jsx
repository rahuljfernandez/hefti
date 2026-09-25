import React from 'react';
import PropTypes from 'prop-types';
import { formatUSD } from '../../../lib/stringFormatters';
import { countOwnerRoles } from '../../../lib/ownerRoleHelper';

/**
 * Component for the owner profile
 */

export default function OwnerProfileDescription({ items }) {
  if (!items) return <div>No owner data available.</div>;
  /* An owner can hold several roles at one facility (e.g. direct owner and
     corporate officer), so total roles and total facilities differ. */
  const roleCounts = countOwnerRoles(items.facilities);
  const totalRoles = roleCounts.reduce((total, { count }) => total + count, 0);
  return (
    <div className="mt-6">
      <div className="text-paragraph-base grid grid-cols-1 gap-x-8 gap-y-6 font-sans md:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              TOTAL FACILITIES
            </p>
            <p className="">
              {items.cms_owner_total_facilities?.toLocaleString() || '—'}
            </p>
          </div>

          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              TOTAL ROLES
            </p>
            <p className="">{totalRoles ? totalRoles.toLocaleString() : '—'}</p>
          </div>

          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              STATES OR TERRITORIES
            </p>
            <p className="">{items.cms_owner_states || '—'}</p>
          </div>

          <div>
            <p className="text-content-secondary text-label-sm tracking-wider uppercase">
              TOTAL DEFICIENCIES
            </p>
            <p className="">
              {items.cms_owner_total_deficiencies?.toLocaleString() || '—'}
            </p>
          </div>

          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              TOTAL PENALTIES
            </p>
            <p className="">
              {items.cms_owner_total_penalties?.toLocaleString() || '—'}
            </p>
          </div>

          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              TOTAL FINES
            </p>
            <p className="">{formatUSD(items.cms_owner_total_fines) || '—'}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              OWNERSHIP TYPE
            </p>
            <p className="">{items.cms_ownership_type || '—'}</p>
          </div>

          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              OPERATIONAL BREAKDOWN
            </p>
            <p className="text-content-secondary">
              <span className="text-core-black font-bold">
                {items.cms_for_profit_ownership_n}
              </span>{' '}
              For Profit
            </p>
            <p className="text-content-secondary">
              {' '}
              <span className="text-core-black font-bold">
                {items.cms_non_profit_ownership_n}
              </span>{' '}
              Nonprofit
            </p>
            <p className="text-content-secondary">
              {' '}
              <span className="text-core-black font-bold">
                {items.cms_government_ownership_n}
              </span>{' '}
              Government
            </p>
          </div>

          <div>
            <p className="text-content-secondary text-label-sm tracking-wider">
              ROLE BREAKDOWN
            </p>
            {roleCounts.length ? (
              roleCounts.map(({ label, count }) => (
                <p key={label} className="text-content-secondary">
                  <span className="text-core-black font-bold">
                    {count.toLocaleString()}
                  </span>{' '}
                  {label}
                </p>
              ))
            ) : (
              <p>—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

OwnerProfileDescription.propTypes = {
  items: PropTypes.shape({
    cms_owner_total_facilities: PropTypes.number,
    cms_ownership_type: PropTypes.string,
    cms_owner_states: PropTypes.string,
    cms_owner_total_deficiencies: PropTypes.number,
    cms_owner_total_penalties: PropTypes.number,
    cms_owner_total_fines: PropTypes.number,

    cms_for_profit_ownership_n: PropTypes.number,
    cms_non_profit_ownership_n: PropTypes.number,
    cms_government_ownership_n: PropTypes.number,

    facilities: PropTypes.arrayOf(
      PropTypes.shape({
        cms_ownership_roles: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
  }),
};
