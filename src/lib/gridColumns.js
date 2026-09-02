/* Full literals, never `sm:grid-cols-${n}` — Tailwind cannot see a class name
   assembled at runtime. Shared so the card grids stay in step; add an entry
   here rather than starting a second copy. */
export const gridColsClass = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};
