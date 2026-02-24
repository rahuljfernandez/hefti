import React, { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

  const meta = selectedNode?.meta ?? {};
  const cmsType = meta.cms_ownership_type;

  if (!selectedNodeId) return null; // panel container will still animate width

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">
            {selectedNode?.label || selectedNode?.id}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            ID: {selectedNode?.id}
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Details
        </div>

        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-900">
              CMS ownership type:
            </span>{' '}
            {cmsType}
          </div>
          <div>
            <span className="font-medium text-gray-900">State:</span>{' '}
            {meta.state}
          </div>
        </div>
      </div>
    </div>
  );
}
