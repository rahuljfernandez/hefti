/* Profile tab config, one array per context (facility / owner / state). Each is
   fully independent so tabs can diverge per context — labels, ordering, or
   context-specific tabs — without a shared base to work around. Where the three
   agree on a label they must agree exactly; `Real Estate` is one tab to a reader
   moving between a facility, its owner, and its state. `name` is the identity
   matched by each page's tab switch and
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
    name: 'Real Estate',
    displayTitle: 'Real Estate',
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
    name: 'Real Estate',
    displayTitle: 'Real Estate',
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
  {
    name: 'Real Estate',
    displayTitle: 'Real Estate',
    href: '#',
  },
];
