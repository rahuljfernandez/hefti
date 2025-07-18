export const ownershipData = [
  {
    id: 1,
    CMS_Ownership_Type: 'Individual',
    CMS_Ownership_Name: 'ZAHLER, JACOB',
    CMS_Ownership_Percentage: 'NOT APPLICABLE',
    CMS_Ownership_Role: 'OPERATIONAL/MANAGERIAL CONTROL',
    Address: '123 Placeholder Ave',
    Contact: 'info@cmsholdings.com',
  },
  {
    id: 2,
    CMS_Ownership_Type: 'Individual',
    CMS_Ownership_Name: 'ZAHLER, CHAIM',
    CMS_Ownership_Percentage: 'NO PERCENTAGE PROVIDED',
    CMS_Ownership_Role: '5% OR GREATER INDIRECT OWNERSHIP INTEREST',
    Address: '456 Sample Blvd',
    Contact: 'chaim@cms.com',
  },
  {
    id: 3,
    CMS_Ownership_Type: 'Individual',
    CMS_Ownership_Name: 'ZAHLER, JACOB',
    CMS_Ownership_Percentage: 'NOT APPLICABLE',
    CMS_Ownership_Role: 'CORPORATE OFFICER',
    Address: '789 Health Rd',
    Contact: 'jacob@cms.com',
  },
  {
    id: 4,
    CMS_Ownership_Type: 'Organization',
    CMS_Ownership_Name: 'FDZ CONSULTING LLC',
    CMS_Ownership_Percentage: 'NO PERCENTAGE PROVIDED',
    CMS_Ownership_Role: '5% OR GREATER INDIRECT OWNERSHIP INTEREST',
    Address: '1010 Consult Ave',
    Contact: 'info@fdzconsulting.com',
  },
  {
    id: 5,
    CMS_Ownership_Type: 'Organization',
    CMS_Ownership_Name: 'LAKE EUSTIS OPERATING HOLI',
    CMS_Ownership_Percentage: '100%',
    CMS_Ownership_Role: '5% OR GREATER DIRECT OWNERSHIP INTEREST',
    Address: '2020 Holdings Blvd',
    Contact: 'contact@lakeeustis.com',
  },
  {
    id: 6,
    CMS_Ownership_Type: 'Individual',
    CMS_Ownership_Name: 'ZANZIPER, NAFTALI',
    CMS_Ownership_Percentage: '50%',
    CMS_Ownership_Role: 'MANAGING EMPLOYEE',
    Address: '3030 Manager Ln',
    Contact: 'naftali@corp.com',
  },
  {
    id: 7,
    CMS_Ownership_Type: 'Individual',
    CMS_Ownership_Name: 'GUTMAN, SAMUEL',
    CMS_Ownership_Percentage: 'NOT APPLICABLE',
    CMS_Ownership_Role: 'CORPORATE OFFICER',
    Address: '4040 Executive St',
    Contact: 'samuel@gutmanco.com',
  },
  {
    id: 8,
    CMS_Ownership_Type: 'Organization',
    CMS_Ownership_Name: 'ARCH OPCO HOLDINGS, LLC',
    CMS_Ownership_Percentage: '100%',
    CMS_Ownership_Role: '5% OR GREATER INDIRECT OWNERSHIP INTEREST',
    Address: '5050 Archway Pkwy',
    Contact: 'admin@archopco.com',
  },
  {
    id: 9,
    CMS_Ownership_Type: 'Individual',
    CMS_Ownership_Name: 'THORNGREN, DANIEL',
    CMS_Ownership_Percentage: 'NOT APPLICABLE',
    CMS_Ownership_Role: 'MANAGING EMPLOYEE',
    Address: '6060 Staff Ct',
    Contact: 'daniel@employees.org',
  },
];

export const deficiencyReports = [
  {
    id: 1,
    Report_Date: 'August 29, 2024',
    Report_Type: 'Standard Report',
    Deficiencies: 23,
    Infections: 1,
    Fine_Amount: 279310.77,
    Payment_Suspension: 0,
  },
  {
    id: 2,
    Report_Date: 'June 5, 2024',
    Report_Type: 'Compliant Report',
    Deficiencies: 0,
    Infections: 2,
    Fine_Amount: 0,
    Payment_Suspension: 2,
  },
  {
    id: 3,
    Report_Date: 'May 2, 2024',
    Report_Type: 'Compliant Report',
    Deficiencies: 1,
    Infections: 0,
    Fine_Amount: 0,
    Payment_Suspension: 0,
  },
  {
    id: 4,
    Report_Date: 'April 17, 2024',
    Report_Type: 'Compliant Report',
    Deficiencies: 6,
    Infections: 0,
    Fine_Amount: 0,
    Payment_Suspension: 0,
  },
  {
    id: 5,
    Report_Date: 'February 23, 2024',
    Report_Type: 'Standard Report',
    Deficiencies: 18,
    Infections: 0,
    Fine_Amount: 279310,
    Payment_Suspension: 1,
  },
  {
    id: 6,
    Report_Date: 'January 18, 2024',
    Report_Type: 'Compliant Report',
    Deficiencies: 1,
    Infections: 0,
    Fine_Amount: 0,
    Payment_Suspension: 0,
  },
  {
    id: 7,
    Report_Date: 'December 14, 2023',
    Report_Type: 'Compliant Report',
    Deficiencies: 4,
    Infections: 0,
    Fine_Amount: 0,
    Payment_Suspension: 0,
  },
];

export const penaltiesData = [
  {
    id: 1,
    Report_Date: 'December 14, 2023',
    Fine_Amount: 125000,
    Payment_Suspension: 1,
    Has_Report: true,
  },
  {
    id: 2,
    Report_Date: 'January 18, 2024',
    Fine_Amount: 50000,
    Payment_Suspension: 0,
    Has_Report: true,
  },
  {
    id: 3,
    Report_Date: 'March 18, 2024',
    Fine_Amount: 0,
    Payment_Suspension: 2,
    Has_Report: false,
  },
  {
    id: 4,
    Report_Date: 'June 18, 2024',
    Fine_Amount: 175000,
    Payment_Suspension: 1,
    Has_Report: true,
  },
  {
    id: 5,
    Report_Date: 'July 18, 2024',
    Fine_Amount: 0,
    Payment_Suspension: 0,
    Has_Report: false,
  },
];
export const relatedFacilitiesData = [
  {
    Facility_Name: 'Sunrise Care Center',
    Address: '123 Sunrise Blvd',
    City: 'Orlando',
    State: 'FL',
    CMS_Rating: 4,
    Total_Deficiencies: 12,
    Serious_Deficiencies: 2,
  },

  {
    Facility_Name: 'Green Valley Nursing Home',
    Address: '456 Greenway Dr',
    City: 'Austin',
    State: 'TX',
    CMS_Rating: 3,
    Total_Deficiencies: 15,
    Serious_Deficiencies: 4,
  },
  {
    Facility_Name: 'Ocean Breeze Living',
    Address: '789 Coastal Ave',
    City: 'San Diego',
    State: 'CA',
    CMS_Rating: 5,
    Total_Deficiencies: 5,
    Serious_Deficiencies: 0,
  },
  {
    Facility_Name: 'Hilltop Health & Rehab',
    Address: '101 Hill St',
    City: 'Denver',
    State: 'CO',
    CMS_Rating: 2,
    Total_Deficiencies: 20,
    Serious_Deficiencies: 6,
  },
  {
    Facility_Name: 'Maplewood Manor',
    Address: '202 Maple Ln',
    City: 'Nashville',
    State: 'TN',
    CMS_Rating: 4,
    Total_Deficiencies: 10,
    Serious_Deficiencies: 1,
  },
];

export const ownershipProfileData = {
  operator: {
    name: 'Clay Street Consulting LLC',
  },
  facility: {
    name: 'Aspen Point Health And Rehabilitation',
    managingEmployee: 'Keesha Robinson',
    propertyOwner: {
      name: 'Omega Healthcare Investors, Inc.',
      type: 'REIT',
    },
  },
  directOwners: [
    {
      name: 'VHS MO OPCO Holdings LLC',
      corporateOfficer: [
        'William Miller',
        'William Millr',
        'William Miler',
        'William Mller',
      ],
    },
  ],
  indirectOwners: [
    {
      name: 'Vertical Health Services LLC',
      ownershipPercentage: null,
    },
    {
      name: 'VHS Holdco LLC',
      ownershipPercentage: '5%',
    },
    {
      name: 'VHS Ultimate Parent LLC',
      ownershipPercentage: null,
    },
    {
      name: 'William Miller',
      ownershipPercentage: null,
    },
    {
      name: 'Vertical Health Services LLC',
      ownershipPercentage: null,
    },
    {
      name: 'VHS Holdco LLC',
      ownershipPercentage: '5%',
    },
  ],
};

export const nursingHomesMock = [
  {
    id: 1,
    name: 'Sunny Acres Nursing Home',
    address: '123 Sunshine Lane',
    city: 'Orlando',
    state: 'FL',
    ownership: {
      parent_company_name: 'ARCH OPCO HOLDINGS, LLC',
      ownership_type: 'For Profit - Corporation',
    },
  },
  {
    id: 2,
    name: 'Shady Grove Care Center',
    address: '456 Shady Oak Blvd',
    city: 'Miami',
    state: 'FL',
    ownership: {
      parent_company_name: 'BDCC CONSULTING GROUP LLC',
      ownership_type: 'Nonprofit - Corporation',
    },
  },
  {
    id: 3,
    name: 'Oak Ridge Rehab Facility',
    address: '789 Oak Ridge Drive',
    city: 'Tampa',
    state: 'FL',
    ownership: {
      parent_company_name: '',
      ownership_type: 'Government - County',
    },
  },
];

export const facilitiesMock = [
  {
    id: 1,
    name: 'Sunny Acres Nursing Home',
    city: 'Orlando',
    state: 'FL',
  },
  {
    id: 2,
    name: 'Shady Grove Care Center',
    city: 'Miami',
    state: 'FL',
  },
];

export const ownersMock = [
  {
    cms_ownership_name: 'ARCH OPCO HOLDINGS, LLC',
    cms_ownership_type: 'Organization',
    facilities: { state: 'FL' },
  },
  {
    cms_ownership_name: 'DEMONS, KEITH',
    cms_ownership_type: 'Individual',
    facilities: { state: 'FL' },
  },
];
