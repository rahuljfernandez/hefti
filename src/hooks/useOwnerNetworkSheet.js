import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Manages mobile owner-network bottom-sheet state and drag interactions.
 *
 * Inputs:
 * - `isOpen`, `ownerId`, `depth`: used to reset sheet state when scope changes
 * - `isDesktop`: disables mobile auto-snap behavior
 * - `hasSelection`: promotes sheet to `mid` when a node is selected
 */
export default function useOwnerNetworkSheet({
  isOpen,
  ownerId,
  depth,
  isDesktop,
  hasSelection,
}) {
  // Snap mode for resting states.
  const [sheetSnap, setSheetSnap] = useState('peek'); // 'peek' | 'mid' | 'full'
  // Viewport height is tracked so vh-based snap points stay accurate on resize/orientation changes.
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0,
  );
  // While dragging, render exact pixel height for smooth gesture response.
  const [dragHeightPx, setDragHeightPx] = useState(null);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  // Keeps pointer gesture bookkeeping outside render state updates.
  const dragStateRef = useRef({ startY: 0, startHeight: 0, pointerId: null });
  // Ref to the scrollable content area, used to avoid hijacking normal scroll.
  const sheetScrollRef = useRef(null);

  // Convert semantic snap states into concrete pixel heights.
  const snapHeights = useMemo(() => {
    const vh = viewportHeight || 800;
    return {
      peek: 96, // Tailwind h-24
      mid: Math.round(vh * 0.3), // 30vh
      full: Math.round(vh * 0.85), // 85vh
    };
  }, [viewportHeight]);

  const snappedHeightPx = snapHeights[sheetSnap] ?? snapHeights.peek;
  const renderedSheetHeightPx = dragHeightPx ?? snappedHeightPx;

  // Keep dragged height within allowed range.
  const clampSheetHeight = (height) =>
    Math.max(snapHeights.peek, Math.min(snapHeights.full, height));

  // Pick the nearest snap destination when drag ends.
  const resolveClosestSnap = (height) => {
    const candidates = Object.entries(snapHeights);
    let closest = candidates[0][0];
    let closestDiff = Math.abs(candidates[0][1] - height);

    for (let i = 1; i < candidates.length; i += 1) {
      const [snap, snapHeight] = candidates[i];
      const diff = Math.abs(snapHeight - height);
      if (diff < closestDiff) {
        closest = snap;
        closestDiff = diff;
      }
    }

    return closest;
  };

  const handleSheetPointerDown = (e) => {
    // Left-click / touch/pen only.
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!(e.target instanceof Element)) return;

    // Don't start drag from interactive controls.
    const interactiveTarget = e.target.closest(
      'input,button,a,textarea,select,[data-no-sheet-drag]',
    );
    if (interactiveTarget) return;

    // If content is scrolled, let users keep scrolling content first.
    const scroller = sheetScrollRef.current;
    if (scroller && scroller.contains(e.target) && scroller.scrollTop > 0)
      return;

    dragStateRef.current = {
      startY: e.clientY,
      startHeight: snappedHeightPx,
      pointerId: e.pointerId,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setIsDraggingSheet(true);
    setDragHeightPx(snappedHeightPx);
  };

  const handleSheetPointerMove = (e) => {
    if (!isDraggingSheet) return;
    if (dragStateRef.current.pointerId !== e.pointerId) return;

    const deltaY = e.clientY - dragStateRef.current.startY;
    const nextHeight = clampSheetHeight(
      dragStateRef.current.startHeight - deltaY,
    );
    setDragHeightPx(nextHeight);
  };

  const handleSheetPointerEnd = (e) => {
    if (!isDraggingSheet) return;
    if (dragStateRef.current.pointerId !== e.pointerId) return;

    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const finalHeight = dragHeightPx ?? snappedHeightPx;
    setSheetSnap(resolveClosestSnap(finalHeight));
    setDragHeightPx(null);
    setIsDraggingSheet(false);
    dragStateRef.current = { startY: 0, startHeight: 0, pointerId: null };
  };

  // Reset sheet whenever modal context changes.
  useEffect(() => {
    if (!isOpen) return;
    setSheetSnap('peek');
    setDragHeightPx(null);
    setIsDraggingSheet(false);
  }, [isOpen, ownerId, depth]);

  // Track viewport changes for responsive snap points.
  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Auto-manage collapsed/expanded state from selection changes on mobile.
  useEffect(() => {
    if (isDesktop) return;
    if (isDraggingSheet) return;

    if (hasSelection) {
      setSheetSnap((prev) => (prev === 'peek' ? 'mid' : prev));
    } else {
      setSheetSnap('peek');
    }
  }, [isDesktop, isDraggingSheet, hasSelection]);

  // Expose imperative handlers + derived values needed by the mobile layout.
  return {
    setSheetSnap,
    renderedSheetHeightPx,
    isDraggingSheet,
    sheetScrollRef,
    handleSheetPointerDown,
    handleSheetPointerMove,
    handleSheetPointerEnd,
  };
}
