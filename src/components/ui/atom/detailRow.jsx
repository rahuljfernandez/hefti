import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * One label/value pair with a rule beneath it — the building block the
 * Property Details tables are assembled from.
 *
 * The rule is intrinsic rather than a prop: this row *is* the ruled design, and
 * DetailTable / DetailTableSplit are only arrangements of it. For the plain,
 * ruleless metadata layout (addresses, identifiers, certification dates), reach
 * for FieldGrid instead — that is a separate design, not a variant of this one.
 *
 * Renders <dt>/<dd>, so it has to sit inside a <dl>; DetailTable provides one.
 */
export default function DetailRow({ label, value, className }) {
  return (
    <div
      className={clsx(
        'border-border-primary flex items-baseline justify-between gap-4 border-b py-3',
        className,
      )}
    >
      <dt className="text-paragraph-sm text-content-secondary">{label}</dt>
      <dd className="text-paragraph-sm text-content-primary text-right">
        {value}
      </dd>
    </div>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  className: PropTypes.string,
};
