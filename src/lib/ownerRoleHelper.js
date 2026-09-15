import { toTitleCase } from './toTitleCase';

export const ownerRoleMap = {
  '5% OR GREATER DIRECT OWNERSHIP INTEREST': {
    label: 'Direct Ownership',
  },
  '5% OR GREATER INDIRECT OWNERSHIP INTEREST': {
    label: 'Indirect Ownership',
  },
  '5% OR GREATER MORTGAGE INTEREST': {
    label: 'Mortgage Interest',
  },
  '5% OR GREATER SECURITY INTEREST': {
    label: 'Security Interest',
  },
  'PARTNERSHIP INTEREST': {
    label: 'Partnership Interest',
  },
  'CORPORATE OFFICER': {
    label: 'Corporate Officer',
  },
  'CORPORATE DIRECTOR': {
    label: 'Corporate Director',
  },
  'MANAGING EMPLOYEE': {
    label: 'Managing Employee',
  },
  'W-2 MANAGING EMPLOYEE': {
    label: 'W-2 Managing Employee',
  },
  'OPERATIONAL/MANAGERIAL CONTROL': {
    label: 'Operational/Managerial Control',
  },

  'N/A': { color: '', label: 'None' },
  'OWNERSHIP DATA NOT AVAILABLE': { color: '', label: 'None' },
};

const ROLE_ORDER = Object.keys(ownerRoleMap);
const NO_ROLE_LABEL = ownerRoleMap['N/A'].label;

/* Sorted by ownerRoleMap order so a facility's roles read the same way on every
   card; roles the map doesn't know go last as their title-cased CMS text. */
export function ownerRoleLabels(roles) {
  const rank = (role) => {
    const index = ROLE_ORDER.indexOf(role);
    return index === -1 ? ROLE_ORDER.length : index;
  };

  const labels = [
    ...new Set(
      (roles ?? [])
        .filter(Boolean)
        .sort((a, b) => rank(a) - rank(b))
        .map((role) => ownerRoleMap[role]?.label ?? toTitleCase(role)),
    ),
  ];

  // Both placeholder roles label as "None", which only means something alone.
  return labels.length > 1
    ? labels.filter((label) => label !== NO_ROLE_LABEL)
    : labels;
}
