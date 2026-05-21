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
        aria-labelledby="hero-heading"
        style={{
          backgroundImage: 'url(/src/assets/smokeyLayer.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="relative overflow-hidden bg-white py-28 text-center"
      >
        <div className="relative z-10 mx-auto max-w-[1160px] px-6">
          {/* Eyebrow — zinc-600 ensures 4.5:1 contrast on white */}
          <p className="text-label-sm text-content-secondary mb-6 uppercase">
            Health Economics Financing &amp; Transparency Initiative
          </p>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-core-black mx-auto mb-6 max-w-4xl font-serif text-5xl leading-tight font-bold tracking-tight md:text-6xl"
          >
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
              className="focus-ring-light rounded-sm text-blue-700 underline hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
              aria-label="Dr. Robert Tyler Braun (opens in new tab)"
            >
              Dr. Robert Tyler Braun
            </a>
            , assistant professor of population health sciences
          </p>

          {/* CTA button */}
          <div className="flex justify-center">
            <Link to="/" className={`${heroCtaClasses} focus-ring-dark`}>
              <CircleStackIcon
                aria-hidden="true"
                className="h-8 w-8 shrink-0 text-blue-400"
              />
              <span className="text-left">
                <span className="text-paragraph-base block">
                  Explore the HEFTI Platform
                </span>
                <span className="text-content-secondary text-paragraph-base block">
                  15,000+ facilities &amp; 51,000+ owners
                </span>
              </span>
              <ArrowRightIcon
                aria-hidden="true"
                className="text-content-inverse-secondary h-8 w-8 shrink-0"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. WHY HEFTI ── */}
      <section
        id="why"
        aria-labelledby="why-heading"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Left 1/3 — title */}
            <div>
              <p className="text-label-sm text-content-secondary mb-3 tracking-widest uppercase">
                Why HEFTI
              </p>
              <h2
                id="why-heading"
                className="text-core-black font-serif text-3xl leading-snug font-bold"
              >
                The data is public.
                <br />
                <span className="text-blue-400 italic">
                  Now it&rsquo;s usable.
                </span>
              </h2>
            </div>

            {/* Right 2/3 — body */}
            <div className="space-y-5 md:col-span-2">
              <p className="text-paragraph-lg text-content-secondary">
                Federal nursing home data is public — but it is buried across
                dozens of CMS files, formatted for compliance rather than
                research, and nearly impossible to query without a dedicated
                data team.{' '}
                <strong className="text-content-primary font-semibold">
                  HEFTI changes that.
                </strong>
              </p>
              <p className="text-paragraph-lg text-content-secondary">
                We&rsquo;ve aggregated, linked, and structured ownership,
                financial, and quality records across every Medicare and
                Medicaid-certified facility in the United States — so
                researchers, policymakers, and journalists can focus on the
                questions, not the plumbing.
              </p>
              <p className="text-paragraph-lg text-content-secondary">
                Nursing home ownership is often opaque. Corporate structures
                obscure who is ultimately responsible for the quality of care
                residents receive. HEFTI makes those connections visible — from
                the individual owner to the private equity-backed chain spanning
                dozens of states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. STATS BAR ── */}
      <section id="stats" className="bg-background-inverse-primary py-12">
        {/* 15,000 / 51,000 / 139,000 / 50 */}
      </section>

      {/* ── 4. FEATURES GRID ── */}
      <section id="features" className="bg-background-primary py-20">
        {/* "Everything you need to understand a facility at a glance" + 6 cards */}
      </section>

      {/* ── 5. CTA / Q&A ── */}
      <section id="cta" className="bg-background-secondary py-20">
        {/* "Ask hard questions. Get direct answers." */}
      </section>

      {/* ── 6. RESEARCH ── */}
      <section id="research" className="bg-background-primary py-20">
        {/* "Rigorous research. Accessible data." */}
      </section>
    </div>
  );
}
