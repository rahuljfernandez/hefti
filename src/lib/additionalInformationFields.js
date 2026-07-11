/**
 * Additional Information field config for the facility profile.
 *
 * Shared between the AdditionalInformation card (bottom of the facility profile)
 * and the facility statistics CSV export, so both surface the same fields from a
 * single source. Null-safe so the CSV builder can call it before data loads.
 */
export function buildAdditionalInformation(items) {
  return [
    { title: 'LEGAL BUSINESS NAME', value: items?.parent_company_name || 'N/A' },
    { title: 'CHAIN', value: items?.chain_name || 'N/A' },
    {
      title: 'LATEST CERTIFICATION DATE',
      value: items?.certification_date || 'N/A',
    },
    { title: 'CHAIN SIZE', value: items?.chain_size || 'N/A' },
    { title: 'CCN', value: items?.ccn || 'N/A' },
  ];
}
