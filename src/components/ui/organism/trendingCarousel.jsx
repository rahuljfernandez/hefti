import React, { useId } from 'react';
import { Heading } from '../atom/heading';
import Carousel from '../molecule/carousel';
import MonthlyOwnershipChangeChart from './monthlyOwnershipChangeChart';

/**
 * @fileoverview "Trending in Nursing Home Data" home-page section.
 *
 * Houses the trending charts in a single Embla carousel container. The
 * container supplies the title/subtitle, arrows, and dot tracker; each slide
 * only provides the body that swaps inside it. Today one real chart exists
 * (MonthlyOwnershipChangeChart, which renders bare); the remaining slides are
 * placeholder tiles so the carousel stays navigable until more charts are built.
 */

/**
 * Empty chart area standing in for a trending chart that has not been built
 * yet. The carousel container renders its title/subtitle, so this is only the
 * body.
 */
function PlaceholderChart() {
  return (
    <div
      className="bg-background-primary h-[580px] w-full rounded-lg"
      aria-hidden="true"
    />
  );
}

export default function TrendingCarousel() {
  const headingId = useId();

  const slides = [
    {
      title: 'Monthly SNF Ownership Change Volume',
      subtitle: 'Facilities with ownership changes, by month',
      content: <MonthlyOwnershipChangeChart />,
    },
    {
      title: 'placeholder1 title',
      subtitle: 'placeholder1 subtitle',
      content: <PlaceholderChart />,
    },
    {
      title: 'placeholder2 title',
      subtitle: 'placeholder2 subtitle',
      content: <PlaceholderChart />,
    },
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
