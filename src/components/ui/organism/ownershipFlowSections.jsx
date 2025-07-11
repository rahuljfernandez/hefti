import React, { useState } from 'react';
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
  const [showAll, setShowAll] = useState(false);
  console.log('items:', items);
  const indirectOwner = items.filter(
    (owner) =>
      owner.cms_ownership_role === '5% OR GREATER INDIRECT OWNERSHIP INTEREST',
  );
  if (!indirectOwner.length) return null;

  const displayedOwners = showAll ? indirectOwner : indirectOwner.slice(0, 10);
  return (
    <>
      <OwnershipFlowCard title="INDIRECT OWNER" color="bg-purple-50">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {displayedOwners.map((owner, index) => (
            <OwnershipBox
              key={index}
              label1="INDIRECT OWNER"
              value1={owner.ownership_entity.cms_ownership_name}
              label2="OWNERSHIP PERCENTAGE"
              value2={
                owner.cms_ownership_percentage === null
                  ? 'No Percentage provided'
                  : owner.cms_ownership_percentage
              }
            />
          ))}
        </div>
        {/* Load All link */}
        {!showAll && indirectOwner.length > 10 && (
          <div className="mt-4 w-full text-center">
            <button
              onClick={() => setShowAll(true)}
              className="text-paragraph-base cursor-pointer text-blue-700 underline hover:text-blue-800"
            >
              Load {indirectOwner.length - 10} More
            </button>
          </div>
        )}
      </OwnershipFlowCard>

      <div className="bg-core-white flex justify-center px-4 py-4 sm:px-6">
        {<ArrowUpIcon className="h-5 w-5" />}
      </div>
    </>
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

export function DirectOwnersFlowSection({ items, facility }) {
  const { pe_name } = facility;
  const directOwner = items.filter(
    (owner) =>
      owner.cms_ownership_role === '5% OR GREATER DIRECT OWNERSHIP INTEREST',
  );
  if (!directOwner.length) return null;
  return (
    <>
      <OwnershipFlowCard title="DIRECT OWNER" color="bg-blue-50">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-wrap">
          {directOwner.map((owner, index) => (
            <OwnershipBox
              key={index}
              label1="DIRECT OWNER"
              value1={owner.ownership_entity.cms_ownership_name}
              label2="OWNERSHIP PERCENTAGE"
              value2={
                owner.cms_ownership_percentage === null
                  ? 'No Percentage provided'
                  : owner.cms_ownership_percentage
              }
            />
          ))}
          {pe_name && (
            <>
              <span className="text-xl font-bold">+</span>
              <OwnershipBox
                label1="DIRECT OWNER"
                value1={pe_name}
                label2="OWNERSHIP AFFILLIATION"
                value2="PRIVATE EQUITY"
              />
            </>
          )}
        </div>
      </OwnershipFlowCard>
      <div className="bg-core-white flex justify-center px-4 py-4 sm:px-6">
        {<ArrowUpIcon className="h-5 w-5" />}
        {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
      </div>
    </>
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

export function CorporateFlowSection({ items = [] }) {
  const corporateOfficer = items
    .filter((owner) => owner.cms_ownership_role === 'CORPORATE OFFICER')
    .map((owner) => owner.ownership_entity.cms_ownership_name);

  const corporateDirector = items
    .filter((owner) => owner.cms_ownership_role === 'CORPORATE DIRECTOR')
    .map((owner) => owner.ownership_entity.cms_ownership_name);

  if (!corporateOfficer.length && !corporateDirector.length) return null;

  return (
    <>
      <OwnershipFlowCard title="CORPORATE MANAGEMENT" color="bg-red-50">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <OwnershipBox
            {...(corporateOfficer.length > 0 && {
              label1: 'CORPORATE OFFICER',
              value1: corporateOfficer,
            })}
            {...(corporateDirector.length > 0 && {
              label2: 'CORPORATE DIRECTOR',
              value2: corporateDirector,
            })}
          />
        </div>
      </OwnershipFlowCard>
      <div className="bg-core-white flex justify-center px-4 py-4 sm:px-6"></div>
    </>
  );
}

CorporateFlowSection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      cms_ownership_role: PropTypes.string.isRequired,
      cms_ownership_percentage: PropTypes.string,
      ownership_entity: PropTypes.shape({
        cms_ownership_name: PropTypes.string.isRequired,
        cms_ownership_type: PropTypes.string,
      }).isRequired,
    }),
  ).isRequired,
};
//When we get real data will have to inspect the conditional render here.

export function FacilityFlowSection({ items, facility, hasOperator }) {
  const { provider_name, reit_name } = facility;
  const managingEmployee = items
    .filter((owner) => owner.cms_ownership_role === 'MANAGING EMPLOYEE')
    .map((owner) => owner.ownership_entity.cms_ownership_name);

  const securityInterest = items
    .filter(
      (owner) => owner.cms_ownership_role === '5% OR GREATER SECURITY INTEREST',
    )
    .map((owner) => owner.ownership_entity.cms_ownership_name);

  const mortgageInterest = items
    .filter(
      (owner) => owner.cms_ownership_role === '5% OR GREATER MORTGAGE INTEREST',
    )
    .map((owner) => owner.ownership_entity.cms_ownership_name);

  const partnershipInterest = items
    .filter((owner) => owner.cms_ownership_role === 'PARTNERSHIP INTEREST')
    .map((owner) => owner.ownership_entity.cms_ownership_name);

  return (
    <>
      <OwnershipFlowCard title="FACILITY" color="bg-orange-50">
        {/*Mobile has flex-col layout and up arrow then at md swtiches to flex-row
      with left pointing arrow*/}
        <div className="flex flex-col items-center justify-center pb-4 md:flex-row">
          <div>
            <OwnershipBox
              label1="FACILITY NAME"
              value1={provider_name}
              {...(managingEmployee.length > 0 && {
                label2: 'MANAGING EMPLOYEE',
                value2: managingEmployee,
              })}
              variant="orange"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          {securityInterest.length > 0 && (
            <OwnershipBox
              label1="SECURITY INTEREST"
              value1={securityInterest}
            />
          )}
          {partnershipInterest.length > 0 && (
            <OwnershipBox
              label1="PARTNERSHIP INTEREST"
              value1={partnershipInterest}
            />
          )}
          {mortgageInterest.length > 0 && (
            <OwnershipBox
              label1="MORTGAGE INTEREST"
              value1={mortgageInterest}
            />
          )}

          {reit_name && (
            <>
              <span className="text-xl font-bold">+</span>
              <OwnershipBox label1="REIT" value1={reit_name} />
            </>
          )}
        </div>
      </OwnershipFlowCard>
      <div className="bg-core-white flex justify-center px-4 py-4 sm:px-6">
        {hasOperator && <ArrowUpIcon className="h-5 w-5" />}
        {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
      </div>
    </>
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
  const operator = items
    .filter(
      (owner) => owner.cms_ownership_role === 'OPERATIONAL/MANAGERIAL CONTROL',
    )
    .map((owner) => owner.ownership_entity.cms_ownership_name);
  if (!operator.length) return null;
  return (
    <OwnershipFlowCard title="OPERATOR" color="bg-yellow-50">
      <div className="flex items-center justify-center gap-4">
        <OwnershipBox label1="FACILITY OPERATOR" value1={operator} />
      </div>
    </OwnershipFlowCard>
  );
}

OperatorFlowSection.propTypes = {
  items: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};
