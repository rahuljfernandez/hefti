import { Label } from '../../components/ui/molecule/fieldset';
import { Radio, RadioField, RadioGroup } from '../../components/ui/atom/radio';

export default {
  title: 'COMPONENTS/Atom/Radio',
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
