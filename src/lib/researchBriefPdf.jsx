import React from 'react';
import PropTypes from 'prop-types';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Rect,
  StyleSheet,
} from '@react-pdf/renderer';

const BRAND_DARK = '#09090b'; // --content-primary
const BRAND_SECONDARY = '#71717a'; // --content-secondary
const BRAND_BORDER = '#e4e4e7';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    color: BRAND_DARK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagline: {
    marginLeft: 8,
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: BRAND_SECONDARY,
    lineHeight: 1.3,
  },
  badge: {
    borderWidth: 1,
    borderColor: BRAND_BORDER,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 8,
    letterSpacing: 1,
    color: BRAND_SECONDARY,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 2,
  },
  generatedDate: {
    fontSize: 9,
    color: BRAND_SECONDARY,
    marginBottom: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BRAND_BORDER,
    marginBottom: 16,
  },
  turn: {
    marginBottom: 20,
  },
  promptLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: BRAND_SECONDARY,
    marginBottom: 4,
  },
  promptText: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 10,
  },
  narrative: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  chartBlock: {
    marginBottom: 16,
  },
  chartImage: {
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: BRAND_BORDER,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: BRAND_SECONDARY,
  },
});

/* Recreates the mark in src/assets/logo.jsx (same rect coordinates) using
   react-pdf's own Svg/Rect primitives. react-pdf can't render a real DOM
   <svg>, and the original is hardcoded fill="white" for the dark navbar —
   invisible on this brief's white page — so this is a small dark-fill
   recreation rather than a reuse of that component. */
function LogoMark() {
  return (
    <Svg viewBox="0 0 100 24" style={{ width: 56, height: 13.44 }}>
      <Rect x="4.17188" y="0" width="6.26087" height="23.9999" fill={BRAND_DARK} />
      <Rect x="20.3438" y="0" width="6.26087" height="23.9999" fill={BRAND_DARK} />
      {/* The four rects below are the original logo.jsx rects with a
         rotate(±90, cx, cy) transform — precomputed here as plain
         axis-aligned rects instead, since react-pdf's Svg/Rect transform
         parsing rendered them garbled rather than rotated. */}
      <Rect x="0" y="8.86914" width="99.1304" height="6.26085" fill={BRAND_DARK} />
      <Rect x="30.2578" y="0" width="16.6957" height="5.21737" fill={BRAND_DARK} />
      <Rect
        x="30.2578"
        y="18.7822"
        width="16.6957"
        height="5.21737"
        fill={BRAND_DARK}
      />
      <Rect x="29.7344" y="0" width="5.21739" height="24" fill={BRAND_DARK} />
      <Rect x="50.0859" y="0" width="6.26087" height="24" fill={BRAND_DARK} />
      <Rect x="50.0859" y="0" width="17.2174" height="5.21737" fill={BRAND_DARK} />
      <Rect x="68.8633" y="0" width="20.8696" height="5.21737" fill={BRAND_DARK} />
      <Rect
        x="76.16883"
        y="3.13086"
        width="6.26087"
        height="20.86914"
        fill={BRAND_DARK}
      />
      <Rect x="92.86803" y="0" width="6.26087" height="23.9999" fill={BRAND_DARK} />
    </Svg>
  );
}

/* The captured PNG is a screenshot of the chart's whole card (see
   ChartWrapper in ResearchChart.jsx — its title/description live inside the
   same ref that gets rasterized), so it already has its own title and
   description baked in. Rendering them again here as PDF <Text> duplicated
   that content on top of the image. */
function ChartBlock({ chart }) {
  return (
    <View style={styles.chartBlock} wrap={false}>
      <Image style={styles.chartImage} src={chart.dataUrl} />
    </View>
  );
}

ChartBlock.propTypes = {
  chart: PropTypes.shape({
    dataUrl: PropTypes.string.isRequired,
  }).isRequired,
};

function Turn({ turn }) {
  return (
    <View style={styles.turn}>
      <Text style={styles.promptLabel}>PROMPT</Text>
      <Text style={styles.promptText}>{turn.prompt}</Text>
      {turn.narrative && <Text style={styles.narrative}>{turn.narrative}</Text>}
      {turn.charts.map((chart, i) => (
        <ChartBlock key={i} chart={chart} />
      ))}
    </View>
  );
}

Turn.propTypes = {
  turn: PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    narrative: PropTypes.string,
    charts: PropTypes.array.isRequired,
  }).isRequired,
};

/**
 * ResearchBriefDocument — the "Full session (PDF)" export. Purely
 * presentational: the caller (see researchShareActions.js) is responsible
 * for capturing each chart's PNG and grouping messages into turns before
 * handing them here, so this file has no DOM/ref dependencies and can be
 * unit-rendered on its own.
 *
 * Pagination is react-pdf's default content-driven flow — turns aren't
 * forced onto their own page; a long turn spills onto a continuation page.
 * Each chart's image+caption is wrapped `wrap={false}` so it can only ever
 * move to the next page as a whole block, never get sliced across one.
 */
export default function ResearchBriefDocument({ subjectName, turns }) {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <LogoMark />
            <Text style={styles.tagline}>
              HEALTH ECONOMICS FINANCING &{'\n'}TRANSPARENCY INITIATIVE
            </Text>
          </View>
          <Text style={styles.badge}>RESEARCH BRIEF</Text>
        </View>

        <Text style={styles.title}>{subjectName}</Text>
        <Text style={styles.generatedDate}>Generated {generatedDate}</Text>
        <View style={styles.divider} />

        {turns.map((turn, i) => (
          <Turn key={i} turn={turn} />
        ))}

        <View style={styles.footer} fixed>
          <Text>
            Generated by HEFTI Researcher — AI generated, verify against
            source CMS data
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

ResearchBriefDocument.propTypes = {
  subjectName: PropTypes.string,
  turns: PropTypes.arrayOf(
    PropTypes.shape({
      prompt: PropTypes.string.isRequired,
      narrative: PropTypes.string,
      charts: PropTypes.array.isRequired,
    }),
  ).isRequired,
};
