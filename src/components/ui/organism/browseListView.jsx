import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LayoutPage from '../atom/layout-page';
import { Heading } from '../atom/heading';
import BrowsePagination from '../molecule/browsePagination';

export default function BrowseListView({ title, children }) {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <LayoutPage>
      <section className="pt-4 pb-16">
        <Heading className="text-display-xs" level={1}>
          {title}
        </Heading>
        {children}
        <div className="pt-4">
          <BrowsePagination
            currentPage={currentPage}
            totalPages={500}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </section>
    </LayoutPage>
  );
}

BrowseListView.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
