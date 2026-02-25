import React, { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import StarRating from './starRating';
import { Badge } from '../atom/badge';
import { getBadgeColorOwnerProfile } from '../../../lib/getBadgeColor';

export default function OwnerNetworkSidePanel({
  data,
  selectedNodeId,
  onClear,
}) {
  const selectedNode = useMemo(() => {
    if (!data?.nodes?.length || !selectedNodeId) return null;
    return (
      data.nodes.find((n) => String(n.id) === String(selectedNodeId)) ?? null
    );
  }, [data, selectedNodeId]);

  if (!selectedNodeId) return null;

  console.log('data', data);
  console.log('selected', selectedNode);

  return (
    <div className="flex h-full flex-col">
      {selectedNode.type === 'owner' ? (
        <OwnerPanel selectedNode={selectedNode} onClear={onClear} />
      ) : (
        <HubPanel selectedNode={selectedNode} onClear={onClear} />
      )}
    </div>
  );
}
//side panel for all nodes other than hub
function OwnerPanel({ selectedNode, onClear }) {
  return (
    <div className="flex h-full flex-col">
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

        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1 text-gray-400 hover:cursor-pointer hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
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
function HubPanel({ selectedNode, onClear }) {
  return (
    <div className="flex h-full flex-col">
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

        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1 text-gray-400 hover:cursor-pointer hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          OWnership Relations Count
        </div>
        {selectedNode.meta.sharedFacilities.map((f) => (
          <ul key={f.ownerId}>
            <li>
              {f.ownerName} {f.count}
            </li>
          </ul>
        ))}

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
