import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Two-column label/value grid — the plain, ruleless metadata layout used for
 * blocks of identifiers (addresses, parcel numbers, certification dates).
 *
 * Fields flow in row-major order, so `fields` reads top-to-bottom as
 * left, right, left, right… Labels are stored in canonical case and upcased
 * here via CSS, so exports and screen readers get real words rather than
 * shouted ones.
 *
 * Not to be confused with DetailTable, which is the ruled label/value design
 * used inside the Property Details disclosures. Two similar-looking layouts,
 * two different components, deliberately.
 */

/* `value` is a node, not a string. Existing call sites render a <Badge> for
   ownership affiliation and a multi-line address broken by <br />, so anything
   narrower than PropTypes.node would fail the migration described below. */

/* Pending migration — this component was extracted while building Location
   Information on the Property Details tab, and is intentionally used only
   there for now. Two existing sections hand-roll this exact markup and should
   be swapped over in a separate, standalone PR:

     - molecule/additionalInformation.jsx  (the <dl> around the field map)
     - molecule/facilityProfileDescription.jsx  (the <dl> of profile fields)

   Both carry byte-identical grid and row classes, so each swap is a pure
   refactor with no visual diff. One divergence to reconcile when it happens:
   additionalInformation upcases labels via CSS (as this component does), while
   facilityProfileDescription hardcodes them uppercase in the JSX — those
   literals need lowering to canonical case as part of the move. */

/* `valueClassName` exists so a section can display values in caps (pass
   'uppercase') without the shouting being baked into the string. Same technique
   the labels above already use: CSS transforms the rendering, the DOM keeps real
   words. Uppercasing in JS instead would reach copy/paste and CSV exports, and
   some screen readers spell all-caps multi-word strings out letter by letter. */
export default function FieldGrid({ fields, className, valueClassName }) {
  return (
    <dl className={clsx('grid grid-cols-1 sm:grid-cols-2', className)}>
      {fields.map(({ label, value }) => (
        <div key={label} className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary uppercase">
            {label}
          </dt>
          <dd
            className={clsx(
              'text-paragraph-base text-content-primary mt-1',
              valueClassName,
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

FieldGrid.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node,
    }),
  ).isRequired,
  className: PropTypes.string,
  valueClassName: PropTypes.string,
};
