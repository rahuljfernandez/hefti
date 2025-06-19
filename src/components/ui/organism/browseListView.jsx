import React from 'react';
import PropTypes from 'prop-types';
import LayoutPage from '../atom/layout-page';
import { Heading } from '../atom/heading';
import BrowsePagination from '../molecule/browsePagination';

export default function BrowseListView({ title, children }) {
  return (
    <LayoutPage>
      <section className="space-y-4">
        <Heading className="text-display-xs" level={1}>
          {title}
        </Heading>
        {children}
        <BrowsePagination />
      </section>
    </LayoutPage>
  );
}

BrowseListView.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
