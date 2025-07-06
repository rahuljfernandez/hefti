import React from 'react';
import LayoutCard from '../atom/layout-card';
import { Heading } from '../atom/heading';

/**
 * This component is placed at the bottom of Facilities Profiles page.
 *
 */

export default function AdditionalInformation() {
  const additionalData = [
    {
      title: 'LATEST CERTIFICATION DATE',
      value: 'items.certification_date',
    },
    { title: 'LEGAL BUSINESS NAME', value: 'name' },
    { title: 'CCN', value: 'items.ccn ' },
    { title: 'CHAIN', value: 'items.chain' },
    { title: 'CHAIN SIZE', value: 'items.ownership.pe_name ' },
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
