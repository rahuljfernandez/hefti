import React from 'react';
import { Link } from 'react-router-dom';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';
import { ErrorBanner } from '../components/ui/atom/errorBanner.jsx';

export default function NotFound() {
  return (
    <div className="bg-background-secondary font-sans">
      <LayoutPage>
        <div className="py-8">
          <Heading level={1} className="text-display-xs">
            Page not found
          </Heading>
          <ErrorBanner
            title="We couldn't find that page"
            message="The link may be out of date, or the address may have been mistyped."
          />
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              to="/nursing-homes"
              className="focus-ring-light text-paragraph-base rounded-sm text-blue-700 underline hover:text-blue-600"
            >
              Go to the nursing home platform
            </Link>
            <Link
              to="/"
              className="focus-ring-light text-paragraph-base rounded-sm text-blue-700 underline hover:text-blue-600"
            >
              Back to the HEFTI home page
            </Link>
          </div>
        </div>
      </LayoutPage>
    </div>
  );
}
