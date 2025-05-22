import { Label } from "../components/ui/fieldset";
import { Radio, RadioField, RadioGroup } from "../components/ui/radio";

export default {
  title: "UI/Radio",
  component: Radio,
};

export const Basic = () => {
  return (
    <RadioGroup
      name="resale"
      defaultValue="permit"
      aria-label="Resale and transfers"
    >
      <RadioField>
        <Radio value="permit" />
        <Label>Allow tickets to be resold</Label>
      </RadioField>
      <RadioField>
        <Radio value="forbid" />
        <Label>Don’t allow tickets to be resold</Label>
      </RadioField>
    </RadioGroup>
  );
};
