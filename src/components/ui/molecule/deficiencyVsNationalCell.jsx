import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/* Deficiency figure over a bar scaled to the worst row in the set — red above
   the national average, gray at or below it. Caption is omitted while the
   national benchmark is still loading (vs_national_label null). Shared by the
   facilities and owners deficiency-burden tables; `metric_display` lets each
   caller format its own figure (facility counts are integers, owner averages
   carry a decimal). */
export default function DeficiencyVsNationalCell({ row }) {
  return (
    <div>
      <p
        className={clsx(
          'text-paragraph-base font-semibold',
          row.above_national ? 'text-red-600' : 'text-core-black',
        )}
      >
        {row.metric_display ?? row.deficiencies}
      </p>
      <div
        aria-hidden="true"
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className={clsx(
            'h-full rounded-full',
            row.above_national ? 'bg-red-500' : 'bg-gray-400',
          )}
          style={{ width: `${Math.round(row.bar_fraction * 100)}%` }}
        />
      </div>
      {row.vs_national_label && (
        <p className="text-paragraph-sm text-content-secondary mt-1">
          {row.vs_national_label}
        </p>
      )}
    </div>
  );
}

DeficiencyVsNationalCell.propTypes = {
  row: PropTypes.object.isRequired,
};
