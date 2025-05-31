import { Disclosure } from '@headlessui/react';

// const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

/**
 * Sourced from Application UI - list items have a gap between them
 */
export default function ListContainerSeperate({ items = [], renderItem }) {
  return (
    <ul role="list" className="space-y-3">
      {items.map((item, i) => (
        <li
          key={item.id || i}
          className="overflow-hidden bg-red-300 px-4 py-4 shadow-sm sm:rounded-md sm:px-6"
        >
          <Disclosure>{() => renderItem(item)}</Disclosure>
        </li>
      ))}
    </ul>
  );
}
