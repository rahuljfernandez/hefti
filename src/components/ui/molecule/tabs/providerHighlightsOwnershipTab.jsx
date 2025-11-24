import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';
import FacilityProviderHighlights from '../../organism/facilityProviderHighlights';
import ListContainer, {
  ListContainerDivider,
} from '../../organism/ListContainer';
import { OwnershipAndStakeholders } from '../listContainerContent';
import OwnershipFlowDiagram from '../../organism/ownershipFlowDiagram';
import AdditionalInformation from '../additionalInformation';

export default function ProviderHighlightsOwnershipTab({
  ownershipLinks,
  facility,
}) {
  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Provider Highlights
      </Heading>
      <FacilityProviderHighlights items={facility} />

      {ownershipLinks.length > 0 && (
        <>
          <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
            Ownership and Stakeholders
          </Heading>
          <ListContainer
            items={ownershipLinks}
            LayoutSelector={ListContainerDivider}
            ListContent={OwnershipAndStakeholders}
          />
          <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
            Ownership Diagram
          </Heading>
          <div className="pb-8">
            <OwnershipFlowDiagram
              items={ownershipLinks}
              facility={ownershipLinks}
            />
          </div>
        </>
      )}

      <div className={ownershipLinks.length > 0 ? 'pb-8' : 'pt-8 pb-8'}>
        <AdditionalInformation items={ownershipLinks} />
      </div>
    </section>
  );
}

ProviderHighlightsOwnershipTab.propTypes = {
  ownershipLinks: PropTypes.array,
  facility: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

ProviderHighlightsOwnershipTab.defaultProps = {
  ownershipLinks: [],
  facility: null,
};
