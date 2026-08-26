/**
 * Breadcrumb page definitions for all routes.
 *
 * Static arrays are used for list pages whose trail never changes.
 * Factory functions are used for pages that need runtime data (slug, entity name, context type).
 * Rankings factory functions accept contextType ('owner' | 'facility') to branch between owner and facility trails.
 * Each item shape: { name: string, to: string, current: boolean }
 * The item with current: true renders as plain text; all others render as links.
 */

import { toTitleCase } from './toTitleCase';

// Home > All Nursing Homes
export const facilityListPages = [
  { name: 'Home', to: '/nursing-homes', current: false },
  { name: 'All Nursing Homes', to: '/nursing-homes/facilities', current: true },
];

// Home > Rankings
export const rankingsListPages = [
  { name: 'Home', to: '/nursing-homes', current: false },
  { name: 'Rankings', to: '/nursing-homes/rankings', current: true },
];

// Home > All Owners
export const ownerListPages = [
  { name: 'Home', to: '/nursing-homes', current: false },
  { name: 'All Owners', to: '/nursing-homes/owners', current: true },
];

// Home > Rankings > All Nursing Homes (when arriving from rankings/chains)
export const rankingsFacilityListPages = [
  { name: 'Home', to: '/nursing-homes', current: false },
  { name: 'Rankings', to: '/nursing-homes/rankings/chains', current: false },
  { name: 'All Nursing Homes', to: '/nursing-homes/facilities', current: true },
];

// Home > Rankings > [Owner Name] (when arriving from rankings/individual-owners)
export function getRankingsOwnerProfilePages(slug, ownerName) {
  return [
    { name: 'Home', to: '/nursing-homes', current: false },
    { name: 'Rankings', to: '/nursing-homes/rankings/individual-owners', current: false },
    { name: ownerName || '...', to: `/nursing-homes/owners/${slug}`, current: true },
  ];
}

// Home > Rankings > All Nursing Homes > [Facility Name] (when arriving from rankings/chains)
export function getRankingsFacilityProfilePages(slug, facilityName) {
  return [
    { name: 'Home', to: '/nursing-homes', current: false },
    { name: 'Rankings', to: '/nursing-homes/rankings/chains', current: false },
    { name: 'All Nursing Homes', to: '/nursing-homes/facilities', current: false },
    { name: facilityName || '...', to: `/nursing-homes/facilities/${slug}`, current: true },
  ];
}

// Home > All Nursing Homes > [Facility Name]
// facilityName falls back to '...' while the API response is still loading.
export function getFacilityProfilePages(slug, facilityName) {
  return [
    { name: 'Home', to: '/nursing-homes', current: false },
    { name: 'All Nursing Homes', to: '/nursing-homes/facilities', current: false },
    { name: facilityName || '...', to: `/nursing-homes/facilities/${slug}`, current: true },
  ];
}

// Home > All Owners > [Owner Name]
// ownerName falls back to '...' while the API response is still loading.
export function getOwnerProfilePages(slug, ownerName) {
  return [
    { name: 'Home', to: '/nursing-homes', current: false },
    { name: 'All Owners', to: '/nursing-homes/owners', current: false },
    { name: ownerName || '...', to: `/nursing-homes/owners/${slug}`, current: true },
  ];
}

// Home > Rankings > [All Nursing Homes >] [Entity Name] > Researcher (when arriving via rankings)
// Facility trail includes the "All Nursing Homes" list step; owner trail goes directly to the profile.
export function getRankingsResearchPages(slug, contextType) {
  const isOwner = contextType === 'owner';
  const base = [
    { name: 'Home', to: '/nursing-homes', current: false },
    { name: 'Rankings', to: isOwner ? '/nursing-homes/rankings/individual-owners' : '/nursing-homes/rankings/chains', current: false },
  ];
  if (!isOwner) {
    base.push({ name: 'All Nursing Homes', to: '/nursing-homes/facilities', current: false });
  }
  base.push(
    { name: toTitleCase(slug.replace(/-/g, ' ')), to: isOwner ? `/nursing-homes/owners/${slug}` : `/nursing-homes/facilities/${slug}`, current: false },
    { name: 'Researcher', to: '#', current: true },
  );
  return base;
}

// Home > [All Owners | All Nursing Homes] > [Entity Name] > Researcher
// The entity name is derived from the URL slug since the research page doesn't fetch entity data.
export function getResearchPages(slug, contextType) {
  const isOwner = contextType === 'owner';
  return [
    { name: 'Home', to: '/nursing-homes', current: false },
    { name: isOwner ? 'All Owners' : 'All Nursing Homes', to: isOwner ? '/nursing-homes/owners' : '/nursing-homes/facilities', current: false },
    { name: toTitleCase(slug.replace(/-/g, ' ')), to: isOwner ? `/nursing-homes/owners/${slug}` : `/nursing-homes/facilities/${slug}`, current: false },
    { name: 'Researcher', to: '#', current: true },
  ];
}
