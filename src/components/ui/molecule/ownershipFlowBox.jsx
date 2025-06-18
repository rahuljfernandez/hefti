import React from 'react';
import PropTypes from 'prop-types';

/**
 * Used within the ownerhsip flow diagram. It displays a labled data box with up to two-key value pairs.
 * 
 * Example:
 *  <OwnershipBox
             label1="FACILITY NAME"
             value1={items.name}
             label2="MANAGING EMPLOYEE"
             value2={items.managingEmployee}
             variant="orange"
           />

 * Notes:
 * -If either label2/value2 are not provided the second section does not renter
 * -The value prop can accept a string or an array then applies conditional render.
 * *** This setup will have to be re-evaluated with live data
 * -variant determines the border color and background.
 */

export function OwnershipBox({
  label1,
  label2,
  value1,
  value2,
  variant = 'default',
}) {
  const variantStyles = {
    default: 'bg-core-white border-core-black',
    orange: 'bg-orange-100 border-orange-500',
  };

  return (
    <div
      className={`space-y-2 rounded-md border-4 p-4 ${variantStyles[variant]}`}
    >
      {/*1st Line Values */}
      <div className="">
        <p className="text-label-xs text-content-tertiary uppercase">
          {label1}
        </p>
        {Array.isArray(value1) ? (
          <ul className="text-label-sm text-core-black space-y-1">
            {value1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-label-sm text-core-black font-semibold">
            {value1}
          </p>
        )}
      </div>
      {/*2nd Line Values */}
      {label2 && value2 && (
        <div>
          <p className="text-label-xs text-content-tertiary uppercase">
            {label2}
          </p>
          {Array.isArray(value2) ? (
            <ul className="text-label-sm text-core-black space-y-1">
              {value2.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-label-sm text-core-black font-semibold">
              {value2}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

OwnershipBox.propTypes = {
  label1: PropTypes.string.isRequired,
  label2: PropTypes.string,
  value1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(['default', 'orange']),
};
