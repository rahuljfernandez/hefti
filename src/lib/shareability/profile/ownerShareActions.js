import { toTitleCase } from '../../toTitleCase';
import { ownerRoleMap } from '../../ownerRoleHelper';

/**
 * ownerShareActions
 *
 * Owner-profile export logic, layered on the generic shareActions.js primitives
 * and the shared helpers in profileShareActions.js (copy-link / generic CSV
 * category). Owns the owner-specific data shaping; OwnersProfile composes these
 * into its header export set.
 */

/* Owner profile CSV: one row per associated facility. Rows are the
   relatedFacilities the page already derives (facility fields spread with the
   owner's role on that facility). Owner Role uses the same ownerRoleMap label
   as the on-page RelatedFacilities card. */
export const ownerFacilitiesExportConfig = {
  filename: 'associated-facilities.csv',
  tooltip: 'Download associated facilities as CSV',
  headers: ['Name', 'Address', 'City', 'State', 'CMS Rating', 'Owner Role'],
  toRow: (facility) => [
    toTitleCase(facility.provider_name || ''),
    toTitleCase(facility.street_address || ''),
    toTitleCase(facility.city || ''),
    facility.state || '',
    facility.overall_rating ?? '',
    ownerRoleMap[facility.cms_ownership_role]?.label ??
      toTitleCase(facility.cms_ownership_role || ''),
  ],
};
