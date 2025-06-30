import React from 'react';
import SelectMenu from '../../components/ui/molecule/selectMenu';
import { useState } from 'react';

export default {
  title: 'COMPONENTS/molecule/SelectMenu',
};

export const SortVariant = () => {
  const [sort, setSort] = useState(null);

  return (
    <div className="max-w-xs p-4">
      <SelectMenu
        variant="sort"
        onSortChange={(val) => {
          setSort(val);
        }}
        onFilterChange={() => {}}
      />
      <p className="mt-2 text-sm text-gray-600">
        Current selection: {sort ?? 'None'}
      </p>
    </div>
  );
};

export const StateFilterVariant = () => {
  const [filter, setFilter] = useState(null);

  return (
    <div className="max-w-xs p-4">
      <SelectMenu
        variant="filter"
        onSortChange={() => {}}
        onFilterChange={(val) => {
          setFilter(val);
        }}
      />
      <p className="mt-2 text-sm text-gray-600">
        Current selection: {filter ?? 'None'}
      </p>
    </div>
  );
};
