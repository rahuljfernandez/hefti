export default function NetworkFilter(){
    return (
        Depth controls
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
                    {/* Node size controls  */}
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
    )
}