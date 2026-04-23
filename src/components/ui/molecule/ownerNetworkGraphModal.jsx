import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import useIsDesktop from '../../../hooks/useIsDesktop';
import useOwnerNetworkSheet from '../../../hooks/useOwnerNetworkSheet';
import useOwnerNetworkGraphController from '../../../hooks/useOwnerNetworkGraphController';
import useAccessibleModal from '../../../hooks/useAccessibleModal';
import OwnerNetworkGraphDesktopLayout from './ownerNetworkGraphDesktopLayout';
import OwnerNetworkGraphMobileLayout from './ownerNetworkGraphMobileLayout';

/**
 * Controller component for the Owner Network Graph modal.
 *
 * Responsibilities:
 * - Fetches network data for the selected owner + depth
 * - Owns shared graph state (selection, search, pin requests, sizing/filter controls)
  * - Handles mobile bottom-sheet snap + drag behavior
 * - Applies dialog semantics and shared modal accessibility behavior
 * - Routes rendering to desktop/mobile layout shells
 *
 * Composition:
 * - `OwnerNetworkGraphDesktopLayout`: desktop shell (nav, filter overlay, side panel)
 * - `OwnerNetworkGraphMobileLayout`: mobile shell (graph + draggable bottom sheet)
 *
 * Hooks Used:
 * - `useIsDesktop`: selects desktop vs mobile layout shell
 * - `useOwnerNetworkGraphController`: owns shared feature state + graph data fetch
 * - `useOwnerNetworkSheet`: owns mobile bottom-sheet snap + drag behavior
 * - `useAccessibleModal`: owns focus entry/restore, Escape handling, scroll lock,
 *   and focus trapping for the custom modal shell
 *
 * Notes:
 * - `restoreFocusRef` points to the launcher trigger so focus returns there on close
 * - `selectedNodeId` stores explicit user selection
 * - `defaultNodeId` keeps the hub details visible after initial load
 */

export default function OwnerNetworkGraphModal({
  isOpen,
  onClose,
  ownerId,
  restoreFocusRef,
}) {
  const isDesktop = useIsDesktop();
  const dialogRef = useRef(null);
  const titleId = useId();

  useAccessibleModal({
    isOpen,
    onClose,
    dialogRef,
    restoreFocusRef,
  });

  // Centralized feature controller:
  // fetch/status state, selection + pin coordination, search state, and graph filters.
  const {
    data,
    status,
    depth,
    nodeSizeMetric,
    searchQuery,
    searchResults,
    pinRequestNodeId,
    isSearchOpen,
    effectiveSelectedNodeId,
    effectiveSelectedNode,
    setDepth,
    setNodeSizeMetric,
    setSearchQuery,
    setSearchResults,
    setSelectedNodeId,
    setIsSearchOpen,
    handleSelectSearchResult,
    handleSelectNode,
    handleClearSelection,
    handlePinRequestConsumed,
    handleRetry,
  } = useOwnerNetworkGraphController({
    isOpen,
    ownerId,
  });

  // Encapsulated mobile bottom-sheet drag/snap behavior.
  const {
    setSheetSnap,
    renderedSheetHeightPx,
    isDraggingSheet,
    sheetScrollRef,
    handleSheetPointerDown,
    handleSheetPointerMove,
    handleSheetPointerEnd,
  } = useOwnerNetworkSheet({
    isOpen,
    ownerId,
    depth,
    isDesktop,
    // When a node is selected, mobile sheet auto-promotes from `peek` to `mid`.
    hasSelection: Boolean(effectiveSelectedNodeId),
  });

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-100 outline-none"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <h2 id={titleId} className="sr-only">
        Owner network graph
      </h2>
      <div className="relative z-10 h-full">
        {isDesktop ? (
          <OwnerNetworkGraphDesktopLayout
            onClose={onClose}
            searchQuery={searchQuery}
            onSetSearchQuery={setSearchQuery}
            searchResults={searchResults}
            isSearchOpen={isSearchOpen}
            onSetIsSearchOpen={setIsSearchOpen}
            onSelectSearchResult={handleSelectSearchResult}
            status={status}
            data={data}
            onSelectNode={setSelectedNodeId}
            pinRequestNodeId={pinRequestNodeId}
            onPinRequestConsumed={handlePinRequestConsumed}
            onSearchResults={setSearchResults}
            nodeSizeMetric={nodeSizeMetric}
            onSetDepth={setDepth}
            depth={depth}
            onSetNodeSizeMetric={setNodeSizeMetric}
            selectedNodeId={effectiveSelectedNodeId}
            onClearSelection={handleClearSelection}
            onSelectSidePanelNode={handleSelectNode}
            onRetry={handleRetry}
          />
        ) : (
          <OwnerNetworkGraphMobileLayout
            status={status}
            data={data}
            onSelectNode={setSelectedNodeId}
            pinRequestNodeId={pinRequestNodeId}
            onPinRequestConsumed={handlePinRequestConsumed}
            searchQuery={searchQuery}
            onSearchResults={setSearchResults}
            nodeSizeMetric={nodeSizeMetric}
            isSearchOpen={isSearchOpen}
            onSetSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSelectSearchResult={handleSelectSearchResult}
            onSetIsSearchOpen={setIsSearchOpen}
            onSearchOpen={() => setSheetSnap('full')}
            renderedSheetHeightPx={renderedSheetHeightPx}
            isDraggingSheet={isDraggingSheet}
            onSheetPointerDown={handleSheetPointerDown}
            onSheetPointerMove={handleSheetPointerMove}
            onSheetPointerEnd={handleSheetPointerEnd}
            sheetScrollRef={sheetScrollRef}
            selectedNode={effectiveSelectedNode}
            onSelectContentNode={handleSelectNode}
            onClose={onClose}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>,
    document.body
  );
}

OwnerNetworkGraphModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  restoreFocusRef: PropTypes.shape({ current: PropTypes.any }),
};
