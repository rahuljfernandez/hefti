import React from 'react';
import NetworkSidePanelAccordion from './networkSidePanelAccordion';
import { NetworkSidePanelList } from './listContainerContent';
import PropTypes from 'prop-types';

export default function OwnerNetworkContent({
  mode,
  shared,
  onSelectNode,
  variant,
}) {
  const isHub = mode === 'hub';

  return (
    <>
      {isHub ? (
        <>
          <NetworkSidePanelAccordion
            title="Ownership Relations Count"
            defaultOpen
            variant={variant}
          >
            {/**Children */}
            <div className="max-h-64 overflow-y-auto">
              <ul className="mt-2 rounded-lg">
                {shared.map((owner) => (
                  <li key={owner.ownerId}>
                    <NetworkSidePanelList
                      item={owner}
                      onSelectNode={onSelectNode}
                      variant={variant}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </NetworkSidePanelAccordion>
          <NetworkSidePanelAccordion
            title="Clinical Quality Measures"
            variant={variant}
          >
            {' '}
            {/**Children */}
          </NetworkSidePanelAccordion>
          <NetworkSidePanelAccordion title="Staffing" variant={variant}>
            {/**Children */}{' '}
          </NetworkSidePanelAccordion>
        </>
      ) : (
        <>
          <NetworkSidePanelAccordion
            title="Clinical Quality Measures"
            variant={variant}
          >
            {' '}
            {/**Children */}
          </NetworkSidePanelAccordion>
          <NetworkSidePanelAccordion title="Staffing" variant={variant}>
            {/**Children */}{' '}
          </NetworkSidePanelAccordion>
        </>
      )}
    </>
  );
}

OwnerNetworkContent.propTypes = {
  mode: PropTypes.oneOf(['hub', 'non-hub']).isRequired,
  shared: PropTypes.arrayOf(
    PropTypes.shape({
      ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      ownerName: PropTypes.string,
      count: PropTypes.number,
      cms_ownership_type: PropTypes.string,
    }),
  ),
  onSelectNode: PropTypes.func,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

OwnerNetworkContent.defaultProps = {
  shared: [],
  onSelectNode: undefined,
};
