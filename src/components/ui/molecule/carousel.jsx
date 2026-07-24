import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';

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
 * Carousel — a single "container" that houses one slide at a time.
 *
 * Reflecting the trending-charts design, the container owns all the chrome:
 * the active slide's title/subtitle header, the prev/next arrows, and the dot
 * tracker along the bottom. Only the slide body (a chart, a placeholder tile,
 * …) swaps as the user flips through. The carousel loops, so the arrows never
 * disable at the ends.
 *
 * The prev/next arrows sit at the two edges of the row beneath the slide, with
 * the dot tracker centered between them.
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
    <div role="group" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="mb-4">
        <Heading level={3} className="text-heading-xs">
          {activeSlide.title}
        </Heading>
        {activeSlide.subtitle && (
          <p className="text-paragraph-sm text-content-secondary mt-1">
            {activeSlide.subtitle}
          </p>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
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

      {/* Arrows flank the dot tracker, the group centered as a whole. */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <CarouselArrow direction="prev" onClick={scrollPrev} />
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
        <CarouselArrow direction="next" onClick={scrollNext} />
      </div>
    </div>
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
