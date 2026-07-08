import React, { useId } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import Carousel from '../molecule/carousel';
import MonthlyOwnershipChangeChart from './monthlyOwnershipChangeChart';

/**
 * @fileoverview "Trending in Nursing Home Data" home-page section.
 *
 * Houses the trending charts in an Embla carousel. Today only one real chart
 * exists (MonthlyOwnershipChangeChart); the remaining slides are placeholder
 * tiles so the carousel is navigable until more charts are built.
 */

/**
 * Placeholder slide mirroring the "flavor of the month" design: a titled card
 * with a subtitle and an empty chart area. Stands in for trending charts that
 * have not been built yet.
 */
function PlaceholderSlide({ title, subtitle }) {
  return (
    <div className="bg-core-white border-border-primary rounded-xl border p-4 shadow-sm sm:p-6">
      <Heading level={4} className="text-heading-xs">
        {title}
      </Heading>
      <p className="text-paragraph-sm text-content-secondary mt-1">{subtitle}</p>
      <div
        className="bg-background-primary mt-4 h-[500px] w-full rounded-lg"
        aria-hidden="true"
      />
    </div>
  );
}

PlaceholderSlide.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default function TrendingCarousel() {
  const headingId = useId();

  const slides = [
    <MonthlyOwnershipChangeChart key="ownership-change-volume" />,
    <PlaceholderSlide
      key="placeholder-1"
      title="Flavor of the month"
      subtitle="Flavor of the month subtitle"
    />,
    <PlaceholderSlide
      key="placeholder-2"
      title="Flavor of the month"
      subtitle="Flavor of the month subtitle"
    />,
  ];

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-5xl">
      <Heading id={headingId} level={2} className="text-heading-sm mb-6">
        Trending in Nursing Home Data
      </Heading>
      <Carousel slides={slides} ariaLabel="Trending in nursing home data" />
    </section>
  );
}
