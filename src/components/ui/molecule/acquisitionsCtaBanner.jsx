import React from 'react';
import PropTypes from 'prop-types';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import CtaLinkButton from '../atom/ctaLinkButton';

/* Shared purple call-to-action banner for ownership-change / acquisitions
   sections. Renders the gradient panel and dark link button; the message is
   passed as children so each surface supplies its own copy. The /acquisitions
   route doesn't exist yet, so `to` is a placeholder until it's built. */

export default function AcquisitionsCtaBanner({
  to = '/acquisitions',
  label,
  children,
  background = 'bg-linear-to-r from-purple-50 to-purple-200',
  className,
}) {
  return (
    <div
      className={clsx(
        'border-border-primary flex flex-col gap-4 rounded-xl border px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6',
        background,
        className,
      )}
    >
      <p className="text-paragraph-base text-content-primary">{children}</p>
      <CtaLinkButton to={to} icon={ArrowRightIcon}>
        {label}
      </CtaLinkButton>
    </div>
  );
}

AcquisitionsCtaBanner.propTypes = {
  to: PropTypes.string,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  background: PropTypes.string,
  className: PropTypes.string,
};
