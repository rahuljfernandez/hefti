import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LayoutPage from '../atom/layout-page';
import { Heading } from '../atom/heading';
import BrowsePagination from '../molecule/browsePagination';
import SelectMenu from '../molecule/selectMenu';
import SearchMenu from '../molecule/searchMenu';

export default function BrowseListView({
  title,
  children,
  searchPlaceholder,
  currentPage,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  suggestions,
}) {
  return (
    <LayoutPage>
      <section className="pt-4 pb-16">
        <Heading className="text-display-xs" level={1}>
          {title}
        </Heading>

        {/*Search Bar */}
        <div className="py-8">
          <Heading className="text-label-lg font-bold"> Search by name</Heading>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
            <div className="w-full md:flex-[2]">
              <SearchMenu
                placeholder={searchPlaceholder}
                search={search}
                onChange={onSearchChange}
                suggestions={suggestions}
              />
            </div>
            <div className="flex w-full gap-2 md:flex-[1] md:flex-row">
              <SelectMenu />
              <SelectMenu />
            </div>
          </div>
        </div>

        {/*List items */}
        {children}

        {/*Pagination Scroll */}
        {totalPages > 1 && (
          <div className="pt-8">
            <BrowsePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </section>
    </LayoutPage>
  );
}

BrowseListView.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  search: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  suggestions: PropTypes.array,
};
