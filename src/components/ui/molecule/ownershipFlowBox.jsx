import React from 'react';

export function OwnershipBox({ label1, label2, value1, value2 }) {
  return (
    <div className="rounded-md border border-black p-4">
      {/*1st Line Values */}
      <div>
        <p className="text-label-xs text-content-tertiary uppercase">
          {label1}
        </p>
        <p className="text-label-sm text-core-black font-semibold">{value1}</p>
      </div>
      {/*2nd Line Values */}
      <div>
        <p className="text-label-xs text-content-tertiary uppercase">
          {label2}
        </p>
        <p className="text-label-sm text-core-black font-semibold">{value2}</p>
      </div>
    </div>
  );
}
