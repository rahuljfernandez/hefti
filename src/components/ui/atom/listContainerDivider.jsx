import { Disclosure } from '@headlessui/react';

const itemsTest = [{ id: 1 }, { id: 2 }, { id: 3 }];

/**
 * Sourced from Application UI - list items have a divider line between them
 */
export default function ListContainerDivider({
  items = [itemsTest],
  renderItem,
}) {
  return (
    <div className="overflow-hidden bg-red-200 shadow-sm sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {items.map((item, i) => (
          <li key={item.id || i} className="px-4 py-4 sm:px-6">
            <Disclosure>{() => renderItem(item)}</Disclosure>
          </li>
        ))}
      </ul>
    </div>
  );
}
