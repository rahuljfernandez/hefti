import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * Carousel — a generic, one-slide-per-view Embla carousel.
 *
 * Renders each entry of `slides` as a full-width slide the user can flip
 * through with the prev/next arrows (positioned in the horizontal gutters to
 * either side of the slides) or the dot indicators below. Prev/next disable
 * themselves at the ends since the carousel does not loop by default.
 *
 * The component is deliberately presentation-agnostic: slides supply their own
 * cards/headings, so it can house real charts and placeholder tiles alike.
 *
 * @example
 * <Carousel
 *   ariaLabel="Trending charts"
 *   slides={[<MyChart key="a" />, <Placeholder key="b" />]}
 * />
 */
export default function Carousel({ slides, options, ariaLabel }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, ...options });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return undefined;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const arrowClasses =
    'focus-ring-light absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary bg-core-white text-content-secondary shadow-sm transition hover:cursor-pointer hover:text-core-black hover:shadow disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:text-content-secondary';

  return (
    <div
      className="relative px-6 sm:px-12"
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              /* Slides are a fixed, caller-ordered list; index keys are stable. */
              key={index}
              className="min-w-0 flex-[0_0_100%] px-1"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={index !== selectedIndex}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
        className={clsx(arrowClasses, 'left-0')}
      >
        <ArrowLeftIcon aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next slide"
        className={clsx(arrowClasses, 'right-0')}
      >
        <ArrowRightIcon aria-hidden="true" className="size-5" />
      </button>

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
  );
}

Carousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.node).isRequired,
  // Embla options object, merged over the { loop: false } default.
  options: PropTypes.object,
  ariaLabel: PropTypes.string,
};
