import React from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';

const CONTACT_EMAIL = 'heftiresearch@gmail.com';

export default function ContactUs() {
  return (
    <div className="bg-background-secondary min-h-screen font-sans">
      <LayoutPage>
        <div className="py-8">
          <Heading level={1} className="text-display-xs">
            Contact Us
          </Heading>
          <p className="text-paragraph-base text-content-primary mt-8 max-w-prose leading-relaxed">
            If you have any questions or need assistance, please contact us at{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="focus-ring-light rounded-sm text-blue-700 underline hover:text-blue-600"
            >
              {CONTACT_EMAIL}
            </a>
            . We’ll be happy to help and will get back to you as soon as
            possible.
          </p>
        </div>
      </LayoutPage>
    </div>
  );
}
