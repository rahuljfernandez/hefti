/**
 * Additional Information field config for the facility profile.
 *
 * Shared between the AdditionalInformation card (bottom of the facility profile)
 * and the facility statistics CSV export, so both surface the same fields from a
 * single source. Null-safe so the CSV builder can call it before data loads.
 *
 * Titles are stored in canonical case (so the CSV reads consistently with the
 * other stat labels and acronyms like CCN stay intact); the card upcases them
 * visually via CSS.
 */
export function buildAdditionalInformation(items) {
  return [
    { title: 'Legal Business Name', value: items?.parent_company_name || 'N/A' },
    { title: 'Chain', value: items?.chain_name || 'N/A' },
    {
      title: 'Latest Certification Date',
      value: items?.certification_date || 'N/A',
    },
    { title: 'Chain Size', value: items?.chain_size || 'N/A' },
    { title: 'CCN', value: items?.ccn || 'N/A' },
  ];
}
