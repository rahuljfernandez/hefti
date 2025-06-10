import React from 'react';
import PropTypes from 'prop-types';
import OwnershipFlowCard from '../molecule/ownershipFlowCard';
import { OwnershipBox } from '../molecule/ownershipFlowBox';

export function IndirectOwnersFlowSection({ items }) {
  return (
    <OwnershipFlowCard title="INDIRECT OWNER">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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

export function DirectOwnersFlowSection() {}
export function FacilityFlowSection() {}
export function OperatorFlowSection() {}
