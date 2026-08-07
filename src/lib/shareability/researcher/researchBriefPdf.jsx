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

/**
 * researchBriefPdf — the react-pdf template for the "Full session (PDF)"
 * research brief export.
 *
 * Composed bottom-up from local helper components:
 * -LogoMark (the brand mark redrawn with react-pdf primitives)
 * -PdfImage
 * -PdfTable (the two chart renderings)
 * -ChartBlock (picks between them perchart)
 * -Turn (one prompt/response/chart group)
 *
 * ResearchBriefDocument, the default export, assembles them into the paginated document.
 *
 * Rendered by researchShareActions.jsx, which prepares the turn/chart data.
 */

const BRAND_DARK = '#09090b'; // --content-primary
const BRAND_SECONDARY = '#71717a'; // --content-secondary
const BRAND_BORDER = '#e4e4e7';

const PAGE_WIDTH = 612; // LETTER, points
const PAGE_PADDING_HORIZONTAL = 40;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_PADDING_HORIZONTAL * 2;

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: PAGE_PADDING_HORIZONTAL,
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
  tableTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 2,
  },
  tableDescription: {
    fontSize: 9,
    color: BRAND_SECONDARY,
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BRAND_DARK,
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: BRAND_BORDER,
    paddingVertical: 3,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: BRAND_DARK,
    paddingRight: 6,
  },
  tableCell: {
    fontSize: 8,
    color: BRAND_DARK,
    paddingRight: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: PAGE_PADDING_HORIZONTAL,
    right: PAGE_PADDING_HORIZONTAL,
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
   <svg>*/
function LogoMark() {
  return (
    <Svg viewBox="0 0 100 24" style={{ width: 56, height: 13.44 }}>
      <Rect
        x="4.17188"
        y="0"
        width="6.26087"
        height="23.9999"
        fill={BRAND_DARK}
      />
      <Rect
        x="20.3438"
        y="0"
        width="6.26087"
        height="23.9999"
        fill={BRAND_DARK}
      />
      {/* The four rects below are the original logo.jsx rects with a
         rotate(±90, cx, cy) transform — precomputed here as plain
         axis-aligned rects instead, since react-pdf's Svg/Rect transform
         parsing rendered them garbled rather than rotated. */}
      <Rect
        x="0"
        y="8.86914"
        width="99.1304"
        height="6.26085"
        fill={BRAND_DARK}
      />
      <Rect
        x="30.2578"
        y="0"
        width="16.6957"
        height="5.21737"
        fill={BRAND_DARK}
      />
      <Rect
        x="30.2578"
        y="18.7822"
        width="16.6957"
        height="5.21737"
        fill={BRAND_DARK}
      />
      <Rect x="29.7344" y="0" width="5.21739" height="24" fill={BRAND_DARK} />
      <Rect x="50.0859" y="0" width="6.26087" height="24" fill={BRAND_DARK} />
      <Rect
        x="50.0859"
        y="0"
        width="17.2174"
        height="5.21737"
        fill={BRAND_DARK}
      />
      <Rect
        x="68.8633"
        y="0"
        width="20.8696"
        height="5.21737"
        fill={BRAND_DARK}
      />
      <Rect
        x="76.16883"
        y="3.13086"
        width="6.26087"
        height="20.86914"
        fill={BRAND_DARK}
      />
      <Rect
        x="92.86803"
        y="0"
        width="6.26087"
        height="23.9999"
        fill={BRAND_DARK}
      />
    </Svg>
  );
}

/* The captured PNG is a screenshot of the chart's whole card (see
   ChartWrapper in ResearchChart.jsx — its title/description live inside the
   same ref that gets rasterized), so it already has its own title and
   description baked in. Rendering them again here as PDF <Text> would
   duplicate that content on top of the image. */
function PdfImage({ block }) {
  /* Explicit width+height (from the capture's real aspect ratio) — left to
     react-pdf, an <Image> with only a width can mis-measure and squish the
     image to whatever vertical space is left on the page. */
  return (
    <View style={styles.chartBlock} wrap={false}>
      <Image
        style={{
          width: CONTENT_WIDTH,
          height: CONTENT_WIDTH / block.aspectRatio,
        }}
        src={block.dataUrl}
      />
    </View>
  );
}

PdfImage.propTypes = {
  block: PropTypes.shape({
    dataUrl: PropTypes.string.isRequired,
    aspectRatio: PropTypes.number.isRequired,
  }).isRequired,
};

/* First (label) column gets double weight; the rest share the remaining
   width equally. flexBasis 0 makes flexGrow the sole width driver, so the
   ratio holds regardless of cell content length. */
function columnFlex(index) {
  return { flexGrow: index === 0 ? 2 : 1, flexBasis: 0 };
}

/* Renders a `table` chart natively from its structured rows (not a
   screenshot), so every column is present and the table paginates and stays
   crisp. The block wrapper is intentionally NOT wrap={false} — the table must
   be able to break across pages; only individual rows are kept atomic. */
function PdfTable({ block }) {
  return (
    <View style={styles.chartBlock}>
      {block.title && <Text style={styles.tableTitle}>{block.title}</Text>}
      {block.description && (
        <Text style={styles.tableDescription}>{block.description}</Text>
      )}
      <View>
        {/* `fixed` reprints the header row at the top of each page the table
            spans, so columns stay labeled when a long table breaks. */}
        <View style={styles.tableHeaderRow} fixed>
          {block.headers.map((header, i) => (
            <Text key={i} style={[styles.tableHeaderCell, columnFlex(i)]}>
              {String(header ?? '')}
            </Text>
          ))}
        </View>
        {block.rows.map((row, r) => (
          <View key={r} style={styles.tableRow} wrap={false}>
            {block.headers.map((_, c) => (
              <Text key={c} style={[styles.tableCell, columnFlex(c)]}>
                {String(row[c] ?? '')}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

PdfTable.propTypes = {
  block: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    headers: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
  }).isRequired,
};

/* Dispatches each chart to a native PDF table (for `table` charts) or a
   captured-image render (everything else). */
function ChartBlock({ block }) {
  return block.type === 'table' ? (
    <PdfTable block={block} />
  ) : (
    <PdfImage block={block} />
  );
}

ChartBlock.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.oneOf(['image', 'table']).isRequired,
  }).isRequired,
};

/* Renders one conversation turn — its prompt, the assistant's narrative, and
   that turn's charts — as a single section of the brief. */
function Turn({ turn }) {
  return (
    <View style={styles.turn}>
      <Text style={styles.promptLabel}>PROMPT</Text>
      <Text style={styles.promptText}>{turn.prompt}</Text>
      {turn.narrative && <Text style={styles.narrative}>{turn.narrative}</Text>}
      {turn.charts.map((block, i) => (
        <ChartBlock key={i} block={block} />
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
 * presentational: the caller (researchShareActions.jsx) groups messages into
 * turns and prepares each chart as either a captured PNG (visual charts) or
 * structured table data, so this file has no DOM/ref dependencies.
 *
 * Pagination is react-pdf's content-driven flow — a long turn spills onto a
 * continuation page. Image blocks are `wrap={false}` so an image is never
 * sliced across a page break; tables flow but keep each row atomic.
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
            Generated by HEFTI Researcher — AI generated, verify against source
            CMS data
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
