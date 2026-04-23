import { useEffect, useRef } from 'react';

/**
 * Shared accessibility behavior for custom modal/dialog components.
 *
 * Responsibilities:
 * - moves focus into the dialog when it opens
 * - restores focus to the trigger when it closes
 * - closes on Escape
 * - locks body scroll while open
 * - traps keyboard focus inside the dialog
 */
export default function useAccessibleModal({
  isOpen,
  onClose,
  dialogRef,
  restoreFocusRef,
}) {
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
  }, [isOpen, dialogRef]);

  useEffect(() => {
    if (!wasOpenRef.current || isOpen) return;
    restoreFocusRef?.current?.focus?.();
  }, [isOpen, restoreFocusRef]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const bodyChildren = Array.from(document.body.children);
    const siblingsToInert = bodyChildren.filter(
      (element) => element !== dialogRef.current,
    );
    const previousStates = siblingsToInert.map((element) => ({
      element,
      ariaHidden: element.getAttribute('aria-hidden'),
      inert: element.inert,
    }));

    siblingsToInert.forEach((element) => {
      element.setAttribute('aria-hidden', 'true');
      element.inert = true;
    });

    return () => {
      previousStates.forEach(({ element, ariaHidden, inert }) => {
        if (ariaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', ariaHidden);
        }
        element.inert = inert;
      });
    };
  }, [isOpen, dialogRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleFocusTrap = (event) => {
      if (event.key !== 'Tab') return;
      if (!dialogRef.current) return;

      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll(focusableSelectors.join(',')),
      ).filter(
        (element) =>
          element instanceof HTMLElement &&
          !element.hasAttribute('disabled') &&
          element.getAttribute('aria-hidden') !== 'true',
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleFocusTrap);
    return () => window.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen, dialogRef]);

  useEffect(() => {
    wasOpenRef.current = isOpen;
  }, [isOpen]);
}
