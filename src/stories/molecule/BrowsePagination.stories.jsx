import React, { useState } from 'react';
import BrowsePagination from '../../components/ui/molecule/browsePagination';

export default {
  title: 'COMPONENTS/Molecule/BrowsePagination',
  components: BrowsePagination,
  tags: ['autodocs'],
};

export const Default = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="bg-gray-50 p-4">
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setCurrentPage(newPage);
        }}
      />
    </div>
  );
};

Default.storyName = 'Basic Pagination Example';

export const FewPages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  return (
    <div className="bg-gray-50 p-4">
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

FewPages.storyName = 'With Few Pages';

export const ManyPages = () => {
  const [currentPage, setCurrentPage] = useState(50);
  const totalPages = 100;

  return (
    <div className="bg-gray-50 p-4">
      <BrowsePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

ManyPages.storyName = 'With Many Pages (Ellipsis)';
