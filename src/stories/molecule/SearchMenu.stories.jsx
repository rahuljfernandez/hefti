import React from 'react';
import SearchMenu from '../../components/ui/molecule/searchMenu';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';

export default {
  title: 'COMPONENTS/molecule/searchMenu',
};

export const Default = () => {
  const [search, setSearch] = useState('');

  const suggestions = [
    { id: 1, label: 'Sunny Acres Nursing Home' },
    { id: 2, label: 'Shady Grove Care Center' },
    { id: 3, label: 'Oak Ridge Rehab Facility' },
  ];

  return (
    <MemoryRouter>
      <div className="max-w-md p-4">
        <SearchMenu
          placeholder="Search facilities..."
          search={search}
          onSearchChange={setSearch}
          suggestions={suggestions}
          hasFetchedSuggestions={true}
          type="facilities"
        />
      </div>
    </MemoryRouter>
  );
};
