import { copyText, downloadCsv } from './shareActions';
import { toTitleCase } from '../toTitleCase';
import { formatOwnershipPercentage } from '../stringFormatters';
import { ownerRoleMap } from '../ownerRoleHelper';

/**
 * profileShareActions
 *
 * Share actions for the facility and owner profile headers. Mirrors how
 * rankingShareActions / researchShareActions sit on the generic shareActions.js
 * primitives: this file owns the profile-specific data shaping (the copy-link
 * action + the CSV column configs); ProfileHeader builds the ShareWidget
 * categories from these.
 *
 * The CSV for each profile is the primary tabular list on that page:
 * - Facility profile -> its ownership & stakeholders
 * - Owner profile    -> its associated facilities
 */

/* Copies a link to the current profile to the clipboard. Reads the live URL so
   the copied link carries whatever slug/route the visitor is actually on. */
export function copyProfileLink() {
  return copyText(window.location.href);
}

/* Writes the supplied rows to CSV via the given config. Returns false on an
   empty set so the ShareWidget segment can surface its empty state instead of
   downloading a header-only file. */
export function downloadProfileCsv(rows, config) {
  if (!rows?.length) return false;
  return downloadCsv(rows.map(config.toRow), config.filename, config.headers);
}

/* Facility profile CSV: one row per ownership/stakeholder link
   (facility.facility_ownership_links), matching the on-page
   "Ownership and Stakeholders" list. */
export const facilityStakeholdersExportConfig = {
  filename: 'ownership-stakeholders.csv',
  tooltip: 'Download ownership & stakeholders as CSV',
  headers: ['Owner', 'Ownership Type', 'Role', 'Ownership %'],
  toRow: (link) => [
    toTitleCase(link.ownership_entity?.cms_ownership_name || ''),
    toTitleCase(link.cms_ownership_type || ''),
    toTitleCase(link.cms_ownership_role || ''),
    formatOwnershipPercentage(link.cms_ownership_percentage),
  ],
};

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
