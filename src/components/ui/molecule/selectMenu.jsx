import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

/**
 *
 * Sourced from Application UI/ Select Menus/ Simple native
 */
export default function SelectMenu() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:mt-2">
        <select
          id="location"
          name="location"
          defaultValue=""
          className="col-start-1 row-start-1 h-14 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          <option value="" disabled>
            Sort
          </option>
          <option>United States</option>
          <option>Mexico</option>
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        />
      </div>
    </div>
  );
}
