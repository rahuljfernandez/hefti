import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "../components/ui/description-list";

export default {
  title: "UI/Description-List",
  component: DescriptionList,
};

export const basic = () => {
  return (
    <DescriptionList>
      <DescriptionTerm>Customer</DescriptionTerm>
      <DescriptionDetails>Leslie Alexander</DescriptionDetails>

      <DescriptionTerm>Email</DescriptionTerm>
      <DescriptionDetails>leslie.alexander@example.com</DescriptionDetails>

      <DescriptionTerm>Access</DescriptionTerm>
      <DescriptionDetails>Admin</DescriptionDetails>
    </DescriptionList>
  );
};
