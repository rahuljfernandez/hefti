import React from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';

export default function Sandbox() {
  return (
    <LayoutPage>
      <div className="py-8">
        <Heading level={1}>Sandbox</Heading>
      </div>
    </LayoutPage>
  );
}
