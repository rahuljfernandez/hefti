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

export default function ProviderHighlightsOwnershipTab({ facility }) {
  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Provider Highlights
      </Heading>
      <FacilityProviderHighlights items={facility} />
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
