import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertBody,
  AlertActions,
} from "../components/ui/alert";

export default {
  title: "UI/Alert",
  component: Alert,
};

export const Basic = () => (
  <Alert open={true} onClose={() => {}}>
    <div className="text-black dark:text-white">Hello from Alert!</div>
  </Alert>
);

export const Small = () => (
  <Alert open={true} onClose={() => {}} size="sm">
    <AlertTitle>Small</AlertTitle>
  </Alert>
);
export const Medium = () => (
  <Alert open={true} onClose={() => {}} size="md">
    <AlertTitle>Medium</AlertTitle>
  </Alert>
);

export const Large = () => (
  <Alert open={true} onClose={() => {}} size="lg">
    <AlertTitle>Large</AlertTitle>
  </Alert>
);
