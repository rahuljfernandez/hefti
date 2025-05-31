import { OwnershipAndStakeholders } from '../../components/ui/molecule/listContainerContent';
import ListContainer, {
  ListContainerDivider,
  ListContainerSeperate,
} from '../../components/ui/organism/ListContainer';

export default {
  title: 'COMPONENTS/Organism/ListContainer',
  components: ListContainer,
};

const Template = (args) => <ListContainer {...args} />;

const ownershipData = [
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

export const OwnershipStakeholdersDivider = Template.bind({});
OwnershipStakeholdersDivider.args = {
  items: ownershipData,
  LayoutSelector: ListContainerDivider,
  ListContent: OwnershipAndStakeholders,
};

export const OwnershipStakeholdersSeperate = Template.bind({});
OwnershipStakeholdersSeperate.args = {
  items: ownershipData,
  LayoutSelector: ListContainerSeperate,
  ListContent: OwnershipAndStakeholders,
};
