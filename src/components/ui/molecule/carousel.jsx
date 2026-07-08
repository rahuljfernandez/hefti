import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';
import LayoutCard from '../atom/layout-card';

/**
 * Carousel — a single white "container" that houses one slide at a time.
 *
 * Reflecting the trending-charts design, the container owns all the chrome:
 * the active slide's title/subtitle header, the prev/next arrows in the side
 * gutters, and the dot tracker along the bottom. Only the slide body (a chart,
 * a placeholder tile, …) swaps as the user flips through. The carousel loops,
 * so the arrows never disable at the ends.
 *
 * @example
 * <Carousel
 *   ariaLabel="Trending charts"
 *   slides={[
 *     { title: 'Ownership changes', subtitle: 'By month', content: <MyChart /> },
 *   ]}
 * />
 */
export default function Carousel({ slides, options, ariaLabel }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, ...options });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return undefined;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const activeSlide = slides[selectedIndex] ?? slides[0];

  const arrowClasses =
    'focus-ring-light absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary bg-core-white text-content-secondary shadow-sm transition hover:cursor-pointer hover:text-core-black hover:shadow';

  return (
    <LayoutCard>
      <div role="group" aria-roledescription="carousel" aria-label={ariaLabel}>
        {/* Same horizontal inset as the viewport below so the title/subtitle
            line up with the slide body rather than the arrow gutters. */}
        <div className="mx-12 mb-4">
          <Heading level={3} className="text-heading-xs">
            {activeSlide.title}
          </Heading>
          {activeSlide.subtitle && (
            <p className="text-paragraph-sm text-content-secondary mt-1">
              {activeSlide.subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          <div className="mx-12 overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div
                  /* Slides are a fixed, caller-ordered list; index keys are stable. */
                  key={index}
                  className="min-w-0 flex-[0_0_100%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${slides.length}`}
                  aria-hidden={index !== selectedIndex}
                >
                  {slide.content}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className={clsx(arrowClasses, 'left-0')}
          >
            <ArrowLeftIcon aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className={clsx(arrowClasses, 'right-0')}
          >
            <ArrowRightIcon aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5">
          {slides.map((_, index) => (
            <button
              /* Dots map one-to-one with the fixed slide list. */
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
              className={clsx(
                'focus-ring-light size-2.5 rounded-full transition hover:cursor-pointer',
                index === selectedIndex
                  ? 'bg-content-primary'
                  : 'bg-border-primary hover:bg-content-tertiary',
              )}
            />
          ))}
        </div>
      </div>
    </LayoutCard>
  );
}

Carousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  // Embla options object, merged over the { loop: true } default.
  options: PropTypes.object,
  ariaLabel: PropTypes.string,
};
