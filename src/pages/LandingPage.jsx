import React from 'react';
import { Link } from 'react-router-dom';
import LayoutCard from '../components/ui/atom/layout-card';
import {
  CircleStackIcon,
  ArrowRightIcon,
  LightBulbIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

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
        <div className="relative z-10 mx-auto max-w-[1160px]">
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
          <p className="text-heading-xs text-content-secondary mb-4 px-16">
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
        className="bg-background-secondary py-20"
      >
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Left 1/3 — title */}
            <div>
              <p className="text-label-sm text-content-secondary mb-3 uppercase">
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
      <section
        id="stats"
        aria-label="Platform statistics"
        className="bg-slate-900 py-14"
      >
        <div className="mx-auto max-w-[1160px]">
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-slate-700 md:grid-cols-4">
            {[
              {
                stat: '15,000+',
                label: 'Certified nursing facilities tracked nationwide',
              },
              {
                stat: '51,000+',
                label: 'Distinct ownership entities in the database',
              },
              {
                stat: '159,000+',
                label: 'Ownership linkages mapped across facilities',
              },
              {
                stat: '50+',
                label: 'States with full facility and ownership coverage',
              },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-slate-900 px-6 py-8">
                <dt className="text-paragraph-base text-content-tertiary">
                  {label}
                </dt>
                <dd className="mt-2 font-serif text-5xl font-bold tracking-tight text-white">
                  {stat.replace('+', '')}
                  <span className="align-super text-3xl text-blue-400">+</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 4. FEATURES GRID ── */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="bg-background-secondary py-20"
      >
        <div className="mx-auto max-w-[1160px] px-6">
          {/* Section header */}
          <div className="mb-12 max-w-3xl">
            <p className="text-label-sm text-content-secondary mb-3 uppercase">
              What you can explore
            </p>
            <h2
              id="features-heading"
              className="text-core-black font-serif text-3xl leading-snug font-bold"
            >
              Everything you need to understand a facility
              <br />
              <span className="text-blue-400 italic">
                or a corporate ownership network.
              </span>
            </h2>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-zinc-200 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Ownership Networks',
                body: 'Trace direct and indirect ownership relationships across facilities. Map corporate structures, identify chains, and understand who ultimately controls a nursing home — including private equity and REIT interests.',
              },
              {
                num: '02',
                title: 'Quality & Compliance',
                body: 'CMS star ratings, health inspection scores, staffing hours per resident day, and full deficiency and civil money penalty records — benchmarked against state and national averages.',
              },
              {
                num: '03',
                title: 'Financial Performance',
                body: 'Operating margins, total revenue, related-party transactions, and staffing costs from Medicare Cost Reports — aggregated to the owner level to surface financial patterns across portfolios.',
              },
              {
                num: '04',
                title: 'Staffing Data',
                body: 'RN, LPN, and CNA hours per resident day from Payroll-Based Journal data — with turnover rates and workforce composition at the facility level, comparable to state and national peers.',
              },
              {
                num: '05',
                title: 'State Rankings',
                body: 'Compare states on financial performance, staffing levels, and health outcomes. Drill down to see which facilities are driving performance in any state on any measure.',
              },
              {
                num: '06',
                title: 'Network Visualization',
                body: 'An interactive graph view of ownership relationships between facilities and their owners. Click any node to explore quality, finance, and staffing metrics across connected entities.',
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-white px-8 py-8">
                <p className="text-label-xs text-content-tertiary mb-3">
                  {num}
                </p>
                <h3 className="text-heading-xs text-core-black mb-3">
                  {title}
                </h3>
                <p className="text-paragraph-base text-content-secondary">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HEFTI RESEARCHER ── */}
      <section
        id="cta"
        aria-labelledby="cta-heading"
        className="bg-blue-50 py-20"
      >
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Left — title + description */}
            <div>
              <p className="text-label-sm text-content-secondary mb-3 uppercase">
                HEFTI Researcher
              </p>
              <h2
                id="cta-heading"
                className="text-core-black font-serif text-3xl leading-snug font-bold"
              >
                Ask hard questions.
                <br />
                <span className="text-blue-400 italic">
                  Get data-grounded answers.
                </span>
              </h2>
              <p className="text-paragraph-lg text-content-secondary mt-5">
                An AI assistant built specifically for nursing home data.
                Domain-aware, schema-aware, and grounded in actual CMS records —
                no SQL required.
              </p>
            </div>

            {/* Right — feature list */}
            <div className="space-y-6">
              {[
                {
                  icon: LightBulbIcon,
                  title: 'Domain-aware AI',
                  body: 'Knows CMS schema, ownership roles, and data definitions. No need to explain the context.',
                },
                {
                  icon: CircleStackIcon,
                  title: 'Grounded in real records',
                  body: 'Every response is backed by actual database queries.',
                },
                {
                  icon: PresentationChartBarIcon,
                  title: 'Charts alongside answers',
                  body: 'Ranking and comparison queries render live charts ready to export or share.',
                },
                {
                  icon: TableCellsIcon,
                  title: 'Context-aware conversations',
                  body: 'Open from any facility or owner profile and it already knows the entity in scope.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    <Icon
                      aria-hidden="true"
                      className="text-content-primary h-6 w-6"
                    />
                  </div>
                  <div>
                    <p className="text-label-lg text-core-black">{title}</p>
                    <p className="text-paragraph-base text-content-secondary mt-1">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RESEARCH ── */}
      <section
        id="research"
        aria-labelledby="research-heading"
        className="bg-background-secondary py-20"
      >
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {/* Left 2/3 — content */}
            <div className="space-y-5 md:col-span-2">
              <p className="text-label-sm text-content-secondary mb-3 uppercase">
                About the initiative
              </p>
              <h2
                id="research-heading"
                className="font-serif text-4xl leading-tight font-bold text-zinc-900"
              >
                Rigorous research.
                <br />
                <span className="text-blue-400 italic">Accessible data.</span>
              </h2>
              <p className="text-paragraph-lg text-content-secondary">
                The Health Economics Financing and Transparency Initiative
                (HEFTI) is dedicated to fostering ownership transparency and
                informed decision-making in healthcare by offering a
                comprehensive suite of resources for a wide range of users.
              </p>
              <p className="text-paragraph-lg text-content-secondary">
                HEFTI provides ownership, financial, and quality data for all
                long-term care organizations — including those that are publicly
                traded and private equity owned — in the United States. The
                initiative also leads learning initiatives, creates quarterly
                reports summarizing mergers and acquisition trends, and
                disseminates empirical research.
              </p>
              <p className="text-paragraph-lg text-content-secondary">
                The platform and its datasets are accessible to researchers,
                policymakers, and the general audience through
                easy-to-understand data visualizations and tools. Methodology
                documentation is available for research and citation purposes.
              </p>
              <p className="text-paragraph-lg text-content-secondary">
                HEFTI is led by Dr. Robert Tyler Braun, assistant professor of
                population health sciences at Weill Cornell Medicine, and the
                HEFTI research team.
              </p>
            </div>

            {/* Right 1/3 — contact card */}
            <div>
              <LayoutCard>
                <div className="space-y-5">
                  <div>
                    <p className="text-label-sm text-content-secondary mb-3 uppercase">
                      Initiative Lead
                    </p>
                    <p className="text-label-base font-semibold text-zinc-900">
                      Dr. Robert Tyler Braun
                    </p>
                    <p className="text-paragraph-sm text-content-secondary">
                      Assistant Professor, Population Health Sciences Weill
                      Cornell Medicine
                    </p>
                  </div>

                  <hr className="border-border-primary" />

                  <div>
                    <p className="text-label-sm text-content-secondary mb-3 uppercase">
                      Contact
                    </p>
                    <address className="not-italic">
                      <p className="text-paragraph-sm text-content-secondary">
                        Cornell Health Policy Center
                        <br />
                        Population Health Sciences
                        <br />
                        575 Lexington Ave | 425 E. 61st Street
                        <br />
                        3rd Floor, New York, NY 10022
                      </p>
                      <p className="text-paragraph-sm text-content-secondary mt-3">
                        <a
                          href="tel:+16469628001"
                          className="focus-ring-light rounded-sm hover:text-blue-600"
                          aria-label="Call (646) 962-8001"
                        >
                          (646) 962-8001
                        </a>
                        <br />
                        <a
                          href="mailto:hefti@med.cornell.edu"
                          className="focus-ring-light rounded-sm text-blue-700 underline hover:text-blue-600"
                        >
                          hefti@med.cornell.edu
                        </a>
                      </p>
                    </address>
                  </div>

                  <hr className="border-border-primary" />

                  <div>
                    <p className="text-label-sm text-content-secondary mb-3 uppercase">
                      Funding
                    </p>
                    <a
                      href="https://arnoldventures.org"
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring-light text-paragraph-sm rounded-sm text-blue-700 underline hover:text-blue-600"
                      aria-label="Arnold Ventures (opens in new tab)"
                    >
                      Arnold Ventures
                    </a>
                  </div>
                </div>
              </LayoutCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
