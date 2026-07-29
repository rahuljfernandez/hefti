import React from 'react';
import DeficiencyVsNationalCell from '../molecule/deficiencyVsNationalCell';

/**
 * Shared column config for the deficiency-burden tables (facilities, chains,
 * individual owners). Each table prepends its own name column(s) — the three
 * right-hand columns and the blue name-link styling are identical across all of
 * them, so they live here to stay in sync.
 */

// Props for the blue name links (facility / owner). Chains fall back to plain text.
export const burdenNameLinkProps = {
  className:
    'focus-ring-light text-paragraph-base rounded-sm text-blue-600 underline',
  style: { textDecorationThickness: '2px', textUnderlineOffset: '2px' },
};

// Deficiency figure over its vs-national bar, then penalties and fines.
export const burdenNumericColumns = [
  {
    key: 'deficiencies',
    header: "Deficiencies Vs Nat'l",
    width: 'w-48',
    mobileBlock: true,
    cell: (row) => <DeficiencyVsNationalCell row={row} />,
  },
  {
    key: 'penalties',
    header: 'Penalties',
    align: 'right',
    width: 'w-24',
    cell: (row) => row.penalties_display,
  },
  {
    key: 'fines',
    header: 'Fines',
    align: 'right',
    width: 'w-28',
    cell: (row) => row.fine_display,
  },
];
