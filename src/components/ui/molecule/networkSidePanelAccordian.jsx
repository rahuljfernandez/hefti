import React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function NetworkSidePanelSection({
  title,
  defaultOpen = false,
  children,
}) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="bg-border-secondary border-border-primary min-h-14 border-t border-b">
          <DisclosureButton className="flex w-full items-center justify-between px-4 py-3 text-left">
            <span className="text-core-black text-paragraph-base">{title}</span>
            <ChevronDownIcon
              className={`h-5 w-5 text-zinc-700 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </DisclosureButton>

          <DisclosurePanel className="">{children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
