import React from 'react';
import LayoutCard from '../atom/layout-card';
import { Heading } from '../atom/heading';
import PropTypes from 'prop-types';

/**
 * This component is placed at the bottom of Facilities Profiles page.
 *
 */

export default function AdditionalInformation({ items }) {
  const additionalData = [
    { title: 'LEGAL BUSINESS NAME', value: items.parent_company_name || 'N/A' },
    { title: 'CHAIN', value: items.chain_name || 'N/A' },
    {
      title: 'LATEST CERTIFICATION DATE',
      value: items.certification_date || 'N/A',
    },

    { title: 'CHAIN SIZE', value: items.chain_size || 'N/A' },
    { title: 'CCN', value: items.ccn || 'N/A' },
  ];
  return (
    <LayoutCard>
      <div className="mt-6">
        <Heading level={3} className="text-heading-xs pb-6">
          Additional Information
        </Heading>
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {additionalData.map(({ title, value }) => (
            <div key={title} className="px-4 pb-6 sm:col-span-1 sm:px-0">
              <dt className="text-label-sm text-content-secondary">{title}</dt>
              <dd className="text-paragraph-base text-content-primary mt-1">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </LayoutCard>
  );
}

AdditionalInformation.propTypes = {
  items: PropTypes.shape({
    parent_company_name: PropTypes.string,
    chain_name: PropTypes.string,
    certification_date: PropTypes.string,
    chain_size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ccn: PropTypes.string,
  }).isRequired,
};
