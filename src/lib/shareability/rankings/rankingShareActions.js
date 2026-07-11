import { downloadCsv } from '../primitives/shareActions';
import { toTitleCase } from '../../toTitleCase';

/**
 * rankingShareActions
 *
 * Share actions for ranked entity lists — the recurring `{ name, count }`
 * shape behind the home page's Top 10 lists, the browse pages, and profile
 * rankings. Keeping the row/header shaping here (rather than re-deriving it at
 * each call site) mirrors how chartExport.js owns chart-shape knowledge on top
 * of the generic primitives in shareActions.js. Page components pass only the
 * data plus metadata (entity label, filename).
 */

export function downloadRankingCsv(items, { entityLabel, filename }) {
  return downloadCsv(
    items.map((item) => [toTitleCase(item.name), item.count]),
    filename,
    [entityLabel, 'Facilities'],
  );
}
