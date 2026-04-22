/**
 * Breadcrumb page definitions for all routes.
 *
 * Static arrays are used for list pages whose trail never changes.
 * Factory functions are used for pages that need runtime data (slug, entity name, context type).
 * Each item shape: { name: string, to: string, current: boolean }
 * The item with current: true renders as plain text; all others render as links.
 */

import { toTitleCase } from './toTitleCase';

// Home > All Nursing Homes
export const facilityListPages = [
  { name: 'Home', to: '/', current: false },
  { name: 'All Nursing Homes', to: '/facilities', current: true },
];

// Home > All Owners
export const ownerListPages = [
  { name: 'Home', to: '/', current: false },
  { name: 'All Owners', to: '/owners', current: true },
];

// Home > All Nursing Homes > [Facility Name]
// facilityName falls back to '...' while the API response is still loading.
export function getFacilityProfilePages(slug, facilityName) {
  return [
    { name: 'Home', to: '/', current: false },
    { name: 'All Nursing Homes', to: '/facilities', current: false },
    { name: facilityName || '...', to: `/facilities/${slug}`, current: true },
  ];
}

// Home > All Owners > [Owner Name]
// ownerName falls back to '...' while the API response is still loading.
export function getOwnerProfilePages(slug, ownerName) {
  return [
    { name: 'Home', to: '/', current: false },
    { name: 'All Owners', to: '/owners', current: false },
    { name: ownerName || '...', to: `/owners/${slug}`, current: true },
  ];
}

// Home > [All Owners | All Nursing Homes] > [Entity Name] > Researcher
// The entity name is derived from the URL slug since the research page doesn't fetch entity data.
export function getResearchPages(slug, contextType) {
  const isOwner = contextType === 'owner';
  return [
    { name: 'Home', to: '/', current: false },
    { name: isOwner ? 'All Owners' : 'All Nursing Homes', to: isOwner ? '/owners' : '/facilities', current: false },
    { name: toTitleCase(slug.replace(/-/g, ' ')), to: isOwner ? `/owners/${slug}` : `/facilities/${slug}`, current: false },
    { name: 'Researcher', to: '#', current: true },
  ];
}
