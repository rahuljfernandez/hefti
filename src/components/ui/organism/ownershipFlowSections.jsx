import React from 'react';
import PropTypes from 'prop-types';
import OwnershipFlowCard from '../molecule/ownershipFlowCard';
import { OwnershipBox } from '../molecule/ownershipFlowBox';
import { ArrowLeftIcon, ArrowUpIcon } from '@heroicons/react/16/solid';

/**
 * This file contains 4 components that make up the OwnershipFlowDiagram.
 * Currently hardcoded and will have to be reviewed when working with real data
 * Each component is wrapped in an OwnershipFlowCard to set consistent style and the individual title and bg color for that section.
 * Each component will have different rendering of the OwnershipBox to display information relavent to the its section.
 */

export function IndirectOwnersFlowSection({ items }) {
  return (
    <OwnershipFlowCard title="INDIRECT OWNER" color="bg-purple-50">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {items.map((owner, index) => (
          <OwnershipBox
            key={index}
            label1="INDIRECT OWNER"
            value1={owner.name}
            label2="OWNERSHIP PERCENTAGE"
            value2={
              owner.ownershipPercentage === null
                ? 'No Percentage provided'
                : owner.ownershipPercentage
            }
          />
        ))}
      </div>
    </OwnershipFlowCard>
  );
}

IndirectOwnersFlowSection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      ownershipPercentage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
    }),
  ).isRequired,
};

export function DirectOwnersFlowSection({ items }) {
  return (
    <OwnershipFlowCard title="DIRECT OWNER" color="bg-blue-50">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {items.map((owner, index) => (
          <OwnershipBox
            key={index}
            label1="DIRECT OWNER"
            value1={owner.name}
            label2="CORPORATE OFFICER"
            value2={owner.corporateOfficer}
          />
        ))}
      </div>
    </OwnershipFlowCard>
  );
}

DirectOwnersFlowSection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      corporateOfficer: PropTypes.string,
    }),
  ).isRequired,
};

//When we get real data will have to inspect the conditional render here.

export function FacilityFlowSection({ items }) {
  return (
    <OwnershipFlowCard title="FACILITY" color="bg-orange-50">
      {/*Mobile hasflex-col layout and up arrow then at md swtiches to flex-row
      with left pointing arrow*/}
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        {items.propertyOwner?.name && items.propertyOwner?.type && (
          <>
            <div>
              <OwnershipBox
                label1="PROPERTY OWNER"
                value1={items.propertyOwner.name}
                label2="OWNER TYPE"
                value2={items.propertyOwner.type}
              />
            </div>
            <ArrowUpIcon className="h-5 w-5 md:hidden" />
            <ArrowLeftIcon className="hidden h-5 w-5 md:block" />
          </>
        )}

        <div>
          <OwnershipBox
            label1="FACILITY NAME"
            value1={items.name}
            label2="MANAGING EMPLOYEE"
            value2={items.managingEmployee}
            variant="orange"
          />
        </div>
      </div>
    </OwnershipFlowCard>
  );
}

FacilityFlowSection.propTypes = {
  items: PropTypes.shape({
    propertyOwner: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    managingEmployee: PropTypes.string,
  }).isRequired,
};

//Check if there is only ever 1 operator
export function OperatorFlowSection({ items }) {
  return (
    <OwnershipFlowCard title="OPERATOR" color="bg-yellow-50">
      <div className="flex items-center justify-center gap-4">
        <OwnershipBox label1="FACILITY OPERATOR" value1={items.name} />
      </div>
    </OwnershipFlowCard>
  );
}

OperatorFlowSection.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};
