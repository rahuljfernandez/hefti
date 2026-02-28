import React, { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import StarRating from './starRating';
import { Badge } from '../atom/badge';
import { getBadgeColorOwnerProfile } from '../../../lib/getBadgeColor';
import LayoutCard from '../atom/layout-card';

export default function OwnerNetworkSidePanel({
  data,
  selectedNodeId,
  onClear,
  onSelectNode,
}) {
  const selectedNode = useMemo(() => {
    if (!data?.nodes?.length || !selectedNodeId) return null;
    return (
      data.nodes.find((n) => String(n.id) === String(selectedNodeId)) ?? null
    );
  }, [data, selectedNodeId]);

  if (!selectedNodeId) return null;

  return (
    <div className="flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-hidden md:w-[375px] xl:w-[450px]">
      {selectedNode ? (
        <HubPanel
          selectedNode={selectedNode}
          onClear={onClear}
          onSelectNode={onSelectNode}
        />
      ) : (
        <OwnerPanel selectedNode={selectedNode} onClear={onClear} />
      )}
    </div>
  );
}
//side panel for all nodes other than hub
function OwnerPanel({ selectedNode, onClear }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-start justify-between px-4 py-5 sm:p-6">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">
            {selectedNode?.label}
          </div>
          <div>
            <Badge
              color={getBadgeColorOwnerProfile(
                selectedNode.meta.cms_ownership_type,
              )}
            >
              {selectedNode.meta.cms_ownership_type}
            </Badge>
          </div>
          <div>
            {' '}
            <StarRating
              title="Average Facility Rating"
              rating={selectedNode.meta.star_rating}
            />
          </div>
          <div>{selectedNode.meta.total_facilities} Facilities</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Details
        </div>

        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-900">
              CMS ownership type:
            </span>{' '}
            {selectedNode.meta.cms_ownership_type}
          </div>
          <div>
            <span className="font-medium text-gray-900">State:</span>{' '}
            {selectedNode.meta.state}
          </div>
        </div>
      </div>
    </div>
  );
}

//side panel for only Hub node
function HubPanel({ selectedNode, onClear, onSelectNode }) {
  const shared = selectedNode?.meta?.sharedFacilities ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-start justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">
            {selectedNode?.label}
          </div>
          <div>
            <Badge
              color={getBadgeColorOwnerProfile(
                selectedNode.meta.cms_ownership_type,
              )}
            >
              {selectedNode.meta.cms_ownership_type}
            </Badge>
          </div>
          <div>
            {' '}
            <StarRating
              title="Average Facility Rating"
              rating={selectedNode.meta.star_rating}
            />
          </div>
          <div>{selectedNode.meta.total_facilities} Facilities</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          OWnership Relations Count
        </div>
        <ul className="mt-2 rounded-lg">
          {shared.map((owner) => (
            <li key={owner.ownerId}>
              <button
                type="button"
                onClick={() => onSelectNode?.(owner.ownerId)} // <-- THIS pins/selects Sigma node
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="truncate">{owner.ownerName}</span>
                <span className="ml-3 shrink-0 text-xs text-gray-500">
                  {owner.count}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-900">
              CMS ownership type:
            </span>{' '}
            {selectedNode.meta.cms_ownership_type}
          </div>
          <div>
            <span className="font-medium text-gray-900">State:</span>{' '}
            {selectedNode.meta.state}
          </div>
        </div>
      </div>
    </div>
  );
}
