import React from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';

export default function ContactUs() {
  return (
    <LayoutPage>
      <div className="py-8">
        <Heading level={1}>Contact Us</Heading>
      </div>
    </LayoutPage>
  );
}
