import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function SearchMenu({ placeholder }) {
  const [query, setQuery] = useState();
  return (
    <div className="mt-2 grid w-full grid-cols-1">
      <input
        autoFocus
        className="col-start-1 row-start-1 h-14 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        placeholder={placeholder}
        onChange={(event) => setQuery(event.target.value)}
        onBlur={() => setQuery('')}
      />
      <MagnifyingGlassIcon
        className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
        aria-hidden="true"
      />
    </div>
  );
}

SearchMenu.propTypes = {
  placeholder: PropTypes.string.isRequired,
};
