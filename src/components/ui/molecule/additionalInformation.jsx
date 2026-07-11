import React from 'react';
import LayoutCard from '../atom/layout-card';
import { Heading } from '../atom/heading';
import PropTypes from 'prop-types';
import { buildAdditionalInformation } from '../../../lib/additionalInformationFields';

/**
 * Metadata panel at the bottom of the facility profile — a two-column list of
 * facility identifiers (legal business name, chain, certification date, CCN…).
 * Fields come from buildAdditionalInformation, shared with the stats CSV; labels
 * are stored in canonical case and upcased here via CSS.
 */

export default function AdditionalInformation({ items }) {
  const additionalData = buildAdditionalInformation(items);

  return (
    <LayoutCard>
      <div className="mt-6">
        <Heading level={3} className="text-heading-xs pb-6">
          Additional Information
        </Heading>
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {additionalData.map(({ title, value }) => (
            <div key={title} className="px-4 pb-6 sm:col-span-1 sm:px-0">
              <dt className="text-label-sm text-content-secondary uppercase">
                {title}
              </dt>
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
