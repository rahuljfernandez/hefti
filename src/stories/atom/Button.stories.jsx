import { Button } from '../../components/ui/atom/button';

export default {
  title: 'COMPONENTS/Atom/Button',
  component: Button,
  args: {
    children: 'Click me!',
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [
        'zinc',
        'white',
        'dark',
        'light',
        'dark/white',
        'dark/zinc',
        'indigo',
        'cyan',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
      ],
    },
    outline: {
      control: 'boolean',
    },
    plain: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
};

export const Color = (args) => <Button {...args} />;
Color.args = {
  color: 'indigo',
  outline: false,
  plain: false,
};

export const Outline = (args) => <Button {...args} />;

Outline.args = {
  color: 'rose',
  outline: true,
  plain: false,
};
Outline.parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#1e1e1e' },
      { name: 'zinc', value: '#f8fafc' },
    ],
  },
};

export const Plain = (args) => <Button {...args} />;

Plain.args = {
  color: 'zinc',
  outline: false,
  plain: true,
};
