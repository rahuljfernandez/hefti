import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';
import LayoutCard from '../atom/layout-card';

/** Circular prev/next control. Positioning is supplied by `className` so the
 *  same button works both in the desktop side gutters and, on mobile, inline
 *  beside the dot tracker. */
function CarouselArrow({ direction, onClick, className }) {
  const Icon = direction === 'prev' ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      className={clsx(
        'focus-ring-light border-border-primary bg-core-white text-content-secondary hover:text-core-black flex size-10 items-center justify-center rounded-full border shadow-sm transition hover:cursor-pointer hover:shadow',
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}

CarouselArrow.propTypes = {
  direction: PropTypes.oneOf(['prev', 'next']).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

/**
 * Carousel — a single white "container" that houses one slide at a time.
 *
 * Reflecting the trending-charts design, the container owns all the chrome:
 * the active slide's title/subtitle header, the prev/next arrows, and the dot
 * tracker along the bottom. Only the slide body (a chart, a placeholder tile,
 * …) swaps as the user flips through. The carousel loops, so the arrows never
 * disable at the ends.
 *
 * The arrows sit in the side gutters on desktop; on mobile (where those gutters
 * are dropped to give the slide full width) they move inline to flank the dots.
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

  if (!slides.length) return null;

  const activeSlide = slides[selectedIndex] ?? slides[0];

  return (
    <LayoutCard>
      <div role="group" aria-roledescription="carousel" aria-label={ariaLabel}>
        {/* Same horizontal inset as the viewport below so the title/subtitle
            line up with the slide body rather than the arrow gutters. */}
        <div className="mb-4 lg:mx-12">
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
          <div className="overflow-hidden lg:mx-12" ref={emblaRef}>
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

          {/* Desktop: arrows in the side gutters. */}
          <CarouselArrow
            direction="prev"
            onClick={scrollPrev}
            className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 lg:flex"
          />
          <CarouselArrow
            direction="next"
            onClick={scrollNext}
            className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 lg:flex"
          />
        </div>

        {/* Mobile: arrows flank the dots; desktop: dots only, centered. */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <CarouselArrow
            direction="prev"
            onClick={scrollPrev}
            className="lg:hidden"
          />
          <div className="flex items-center gap-2.5">
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
          <CarouselArrow
            direction="next"
            onClick={scrollNext}
            className="lg:hidden"
          />
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
