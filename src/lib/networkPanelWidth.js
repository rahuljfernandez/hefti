/* The graph modal's two side columns — the filter overlay on the left, the
   details panel on the right — are one width at each breakpoint. Shared so
   they can't drift apart; full literals, since Tailwind cannot see a class
   name assembled at runtime. */
export const networkPanelWidthClass = 'w-[300px] xl:w-[375px]';
