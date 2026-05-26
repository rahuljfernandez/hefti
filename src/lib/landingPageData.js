import {
  LightBulbIcon,
  CircleStackIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

export const landingStats = [
  {
    stat: '15,000',
    label: 'Certified nursing facilities tracked nationwide',
  },
  {
    stat: '51,000',
    label: 'Distinct ownership entities in the database',
  },
  {
    stat: '159,000',
    label: 'Ownership linkages mapped across facilities',
  },
  {
    stat: '50',
    label: 'States with full facility and ownership coverage',
  },
];

export const landingFeatures = [
  {
    num: '01',
    title: 'Ownership Networks',
    body: 'Trace direct and indirect ownership relationships across facilities. Map corporate structures, identify chains, and understand who ultimately controls a nursing home — including private equity and REIT interests.',
  },
  {
    num: '02',
    title: 'Quality & Compliance',
    body: 'CMS star ratings, health inspection scores, staffing hours per resident day, and full deficiency and civil money penalty records — benchmarked against state and national averages.',
  },
  {
    num: '03',
    title: 'Financial Performance',
    body: 'Operating margins, total revenue, related-party transactions, and staffing costs from Medicare Cost Reports — aggregated to the owner level to surface financial patterns across portfolios.',
  },
  {
    num: '04',
    title: 'Staffing Data',
    body: 'RN, LPN, and CNA hours per resident day from Payroll-Based Journal data — with turnover rates and workforce composition at the facility level, comparable to state and national peers.',
  },
  {
    num: '05',
    title: 'State Rankings',
    body: 'Compare states on financial performance, staffing levels, and health outcomes. Drill down to see which facilities are driving performance in any state on any measure.',
  },
  {
    num: '06',
    title: 'Network Visualization',
    body: 'An interactive graph view of ownership relationships between facilities and their owners. Click any node to explore quality, finance, and staffing metrics across connected entities.',
  },
];

export const contactCard = {
  lead: {
    name: 'Dr. Robert Tyler Braun',
    title: 'Assistant Professor, Population Health Sciences Weill Cornell Medicine',
  },
  address: [
    'Cornell Health Policy Center',
    'Population Health Sciences',
    '575 Lexington Ave | 425 E. 61st Street',
    '3rd Floor, New York, NY 10022',
  ],
  phone: { display: '(646) 962-8001', href: 'tel:+16469628001' },
  email: 'hefti@med.cornell.edu',
  funder: { name: 'Arnold Ventures', href: 'https://arnoldventures.org' },
};

export const researcherFeatures = [
  {
    icon: LightBulbIcon,
    title: 'Domain-aware AI',
    body: 'Knows CMS schema, ownership roles, and data definitions. No need to explain the context.',
  },
  {
    icon: CircleStackIcon,
    title: 'Grounded in real records',
    body: 'Every response is backed by actual database queries.',
  },
  {
    icon: PresentationChartBarIcon,
    title: 'Charts alongside answers',
    body: 'Ranking and comparison queries render live charts ready to export or share.',
  },
  {
    icon: TableCellsIcon,
    title: 'Context-aware conversations',
    body: 'Open from any facility or owner profile and it already knows the entity in scope.',
  },
];
