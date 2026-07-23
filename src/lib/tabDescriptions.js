/* Profile tab config, one array per context (facility / owner / state). Each is
   fully independent so tabs can diverge per context — labels, ordering, or
   context-specific tabs (e.g. a future Real Estate tab) — without a shared base
   to work around. `name` is the identity matched by each page's tab switch and
   defaultTabName; `displayTitle` is the human-facing title. */

export const facilityTabsDescriptions = [
  {
    name: 'Provider Highlights',
    displayTitle: 'Provider Highlights',
    href: '#',
  },
  {
    name: 'Deficiencies & Penalties',
    displayTitle: 'Deficiencies from Inspection Reports',
    href: '#',
  },
  {
    name: 'Clinical Quality Measures',
    displayTitle: 'Clinical Quality Measures',
    href: '#',
  },
  {
    name: 'Staffing',
    displayTitle: 'Staffing Quality',
    href: '#',
  },
  {
    name: 'Financial Overview',
    displayTitle: 'Financial Snapshot',
    href: '#',
  },
  {
    name: 'Property Details',
    displayTitle: 'Property Details',
    href: '#',
  },
];

export const ownerTabsDescriptions = [
  {
    name: 'Owner Highlights',
    displayTitle: 'Owner Highlights',
    href: '#',
  },
  {
    name: 'Deficiencies & Penalties',
    displayTitle: 'Deficiencies from Inspection Reports',
    href: '#',
  },
  {
    name: 'Clinical Quality Measures',
    displayTitle: 'Clinical Quality Measures',
    href: '#',
  },
  {
    name: 'Staffing',
    displayTitle: 'Staffing Quality',
    href: '#',
  },
  {
    name: 'Financial Overview',
    displayTitle: 'Financial Snapshot',
    href: '#',
  },
  {
    name: 'Property Details',
    displayTitle: 'Property Details',
    href: '#',
  },
];

export const stateTabsDescriptions = [
  {
    name: 'State Highlights',
    displayTitle: 'State Highlights',
    href: '#',
  },
  {
    name: 'Deficiencies & Penalties',
    displayTitle: 'Deficiencies from Inspection Reports',
    href: '#',
  },
  {
    name: 'Clinical Quality Measures',
    displayTitle: 'Clinical Quality Measures',
    href: '#',
  },
  {
    name: 'Staffing',
    displayTitle: 'Staffing Quality',
    href: '#',
  },
  {
    name: 'Financial Overview',
    displayTitle: 'Financial Snapshot',
    href: '#',
  },
];
