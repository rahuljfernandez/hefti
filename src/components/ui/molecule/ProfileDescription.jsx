const facilityData = [
  { title: 'LOCATION', value: '2840 West Clary St, Saint Charles, MO 66301' },
  { title: 'NUMBER OF CERTIFIED BEDS', value: '180' },
  { title: 'CCN', value: '265118' },
  { title: 'AVERAGE NUMBER OF RESIDENTS PER DAY', value: '54.6' },
  { title: 'LEGAL BUSINESS NAME', value: 'Clay Street Healthcare Llc' },
];

export default function ProfileDescription() {
  return (
    <div>
      <div className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {facilityData.map(({ title, value }) => (
            <div key={title} className="px-4 pb-6 sm:col-span-1 sm:px-0">
              <dt className="text-label-sm text-content-secondary">{title}</dt>
              <dd className="text-paragraph-base text-content-primary mt-1">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
