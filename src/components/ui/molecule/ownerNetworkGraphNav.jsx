import React, { useState } from 'react';
import clsx from 'clsx';
import Logo from '../../../assets/logo';

export default function OwnerNetworkGraphNav({
  depth,
  onSetDepth,
  onClose,
  sizeMetric,
  onSetSizeMetric,
  searchQuery,
  onSetSearchQuery,
  searchResults,
  onSelectSearchResult,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <div className="w-full border-b bg-black">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center">
          {/* LEFT */}
          <div className="flex items-center">
            <Logo className="h-6 w-auto text-white" />
          </div>

          {/* CENTER */}
          <div
            className="relative flex flex-1 items-center justify-center gap-6"
            onBlur={() => {
              setTimeout(() => {
                setIsSearchOpen(false);
              }, 100);
            }}
          >
            <input
              value={searchQuery}
              onChange={(e) => {
                onSetSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                setIsSearchOpen(true);
              }}
              placeholder="Search nodes..."
              className={clsx(
                'w-[280px] rounded-lg border bg-white px-3 py-1.5 text-sm',
                'border-gray-300 placeholder:text-gray-400',
                'focus:ring-2 focus:ring-orange-400 focus:outline-none',
              )}
            />
            {/* Dropdown */}
            {isSearchOpen && (
              <div className="bg-core-white absolute top-full left-0 z-[500] mt-3 w-full overflow-hidden rounded-lg border border-gray-200 shadow-lg">
                <ul className="max-h-64 overflow-auto py-1">
                  <li className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-lg text-gray-500">
                      Search Results
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-core-black text-lg hover:cursor-pointer hover:text-red-400"
                    >
                      X
                    </button>
                  </li>
                  {searchResults.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onSelectSearchResult(n);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:cursor-pointer hover:bg-gray-50"
                      >
                        <span className="truncate">{n.label}</span>
                        <span className="ml-3 shrink-0 text-xs text-gray-400">
                          Enter
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Depth controls */}
            <div className="flex items-center gap-3">
              <span className="text-core-white text-xs font-medium tracking-wide uppercase">
                Network Depth
              </span>

              <div className="flex overflow-hidden rounded-lg border border-gray-700">
                <button
                  type="button"
                  onClick={() => onSetDepth(1)}
                  className={clsx(
                    'px-3 py-1.5 text-sm font-semibold transition',
                    depth === 1
                      ? 'bg-orange-400 text-black'
                      : 'bg-white text-black hover:bg-gray-100',
                  )}
                >
                  Depth 1
                </button>

                <button
                  type="button"
                  onClick={() => onSetDepth(2)}
                  className={clsx(
                    'border-l border-gray-300 px-3 py-1.5 text-sm font-semibold transition',
                    depth === 2
                      ? 'bg-orange-400 text-black'
                      : 'bg-white text-black hover:bg-gray-100',
                  )}
                >
                  Depth 2
                </button>
              </div>
            </div>

            {/* Node size controls (VISUAL FIRST) */}
            <div className="flex items-center gap-3">
              <span className="text-core-white text-xs font-medium tracking-wide uppercase">
                Node Size
              </span>

              <div className="flex overflow-hidden rounded-lg border border-gray-700">
                {/* default  */}
                <button
                  type="button"
                  onClick={() => onSetSizeMetric?.('default')}
                  className={clsx(
                    'px-3 py-1.5 text-sm font-semibold transition',
                    sizeMetric === 'default'
                      ? 'bg-orange-400 text-black'
                      : 'bg-white text-black hover:bg-gray-100',
                  )}
                >
                  Default
                </button>
                {/* Star rating  */}
                <button
                  type="button"
                  onClick={() => onSetSizeMetric?.('star')}
                  className={clsx(
                    'px-3 py-1.5 text-sm font-semibold transition',
                    sizeMetric === 'star'
                      ? 'bg-orange-400 text-black'
                      : 'bg-white text-black hover:bg-gray-100',
                  )}
                >
                  Star rating
                </button>

                {/* Quality (disabled for now) */}
                <button
                  type="button"
                  disabled
                  className={clsx(
                    'border-l border-gray-300 px-3 py-1.5 text-sm font-semibold transition',
                    'cursor-not-allowed bg-white text-gray-400',
                  )}
                  title="Coming soon"
                >
                  Quality
                </button>

                {/* Financial (disabled for now) */}
                <button
                  type="button"
                  disabled
                  className={clsx(
                    'border-l border-gray-300 px-3 py-1.5 text-sm font-semibold transition',
                    'cursor-not-allowed bg-white text-gray-400',
                  )}
                  title="Coming soon"
                >
                  Financial
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
