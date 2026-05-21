import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full font-sans">

      {/* ── 1. HERO ── */}
      <section id="hero" className="bg-background-primary py-24">
        {/* Headline, subtitle, email CTA */}
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
