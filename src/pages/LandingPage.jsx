import React from 'react';
import { Link } from 'react-router-dom';
import { CircleStackIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const heroCtaClasses =
  'inline-flex items-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-white shadow-lg transition hover:bg-gray-800';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full font-sans">
      {/* ── 1. HERO ── */}

      <section
        id="hero"
        style={{
          backgroundImage: 'url(/src/assets/smokeyLayer.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="relative overflow-hidden bg-white py-28 text-center"
      >
        <div className="relative z-10 mx-auto max-w-[1160px] px-6">
          {/* Eyebrow */}
          <p className="text-label-sm text-content-tertiary mb-6 uppercase">
            Health Economics Financing &amp; Transparency Initiative
          </p>

          {/* Headline */}
          <h1 className="text-core-black mx-auto mb-6 max-w-4xl font-serif text-5xl leading-tight font-bold tracking-tight md:text-6xl">
            Fostering <span className="text-blue-400 italic">ownership</span>
            <br />
            <span className="text-blue-400 italic">transparency</span> in
            <br />
            health care.
          </h1>

          {/* Subtitle */}
          <p className="text-heading-xs text-content-secondary mb-4">
            Ownership, financial, and quality data for every certified nursing
            home in the U.S.&nbsp; Built to support informed decisions and
            stronger accountability.
          </p>

          {/* Attribution */}
          <p className="text-paragraph-base text-content-secondary mb-10">
            Led by{' '}
            <a
              href="https://vivo.weill.cornell.edu/display/cwid-rtb2003"
              className="text-blue-700 underline hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              Dr. Robert Tyler Braun
            </a>
            , assistant professor of population health sciences
          </p>

          {/* CTA button */}
          <div className="flex justify-center">
            <Link to="/" className={heroCtaClasses}>
              <CircleStackIcon className="h-8 w-8 shrink-0 text-blue-400" />
              <span className="text-left">
                <span className="text-paragraph-base block">
                  Explore the HEFTI Platform
                </span>
                <span className="text-content-secondary text-paragraph-base block">
                  15,000+ facilities &amp; 51,000+ owners
                </span>
              </span>
              <ArrowRightIcon className="text-content-secondary h-8 w-8 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ── */}
      <section id="stats" className="bg-background-inverse-primary py-12">
        {/* 15,000 / 51,000 / 139,000 / 50 */}
      </section>

      {/* ── 3. FEATURES GRID ── */}
      <section id="features" className="bg-background-primary py-20">
        {/* "Everything you need to understand a facility at a glance" + 6 cards */}
      </section>

      {/* ── 4. CTA / Q&A ── */}
      <section id="cta" className="bg-background-secondary py-20">
        {/* "Ask hard questions. Get direct answers." */}
      </section>

      {/* ── 5. RESEARCH ── */}
      <section id="research" className="bg-background-primary py-20">
        {/* "Rigorous research. Accessible data." */}
      </section>
    </div>
  );
}
