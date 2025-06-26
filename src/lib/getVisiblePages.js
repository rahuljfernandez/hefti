/**
 * Generates a smart, windowed list of page numbers for pagination with ellipsis.
 *
 * Example output:
 * - totalPages = 5, currentPage = 2 → [1, 2, 3, 4, 5]
 * - totalPages = 10, currentPage = 2 → [1, 2, 3, '...', 10]
 * - totalPages = 10, currentPage = 5 → [1, '...', 4, 5, 6, '...', 10]
 *
 */

export function getVisiblePages(currentPage, totalPages) {
  const pages = [];

  //5 or fewer pages just show all
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    //Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    //Define the window around the current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    //Add the window to the pages array
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    //add trailing ellipsis if we have pages left after the window
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);
  }

  return pages;
}
