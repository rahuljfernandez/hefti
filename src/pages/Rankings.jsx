import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';

const RANKING_TITLES = {
  'top-chains': 'Top Chains',
  'top-owners': 'Top Individual Owners',
  'state-overall': 'State Rankings — Overall Rating',
  'state-financial': 'State Rankings — Financial',
  'state-staffing': 'State Rankings — Staffing',
  'state-health-outcomes': 'State Rankings — Health Outcomes',
};

const breadcrumbPages = [
  { name: 'Home', href: '/', current: false },
  { name: 'Rankings', href: '/rankings', current: true },
];

export default function Rankings() {
  const { type } = useParams();
  const title = RANKING_TITLES[type] ?? 'Rankings';

  return (
    <>
      <Breadcrumb pages={breadcrumbPages} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 xl:px-0">
        <h1 className="text-heading-lg font-semibold">{title}</h1>
      </div>
    </>
  );
}
