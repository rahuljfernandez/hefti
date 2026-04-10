import React, { useLayoutEffect, useRef } from 'react';
import { ArrowUpIcon } from '@heroicons/react/20/solid';
import { Button } from '../atom/button';

/**
 * ResearcherComposer
 *
 * Controlled textarea input used to send messages to the Hefti Researcher AI.
 * Used on the HeftiResearch page in both the empty and active chat states.
 *
 * - Auto-resizes vertically as the user types, capped at 200px.
 * - Clicking anywhere on the composer (outside the send button) focuses the textarea.
 * - Submits on Enter; Shift+Enter inserts a newline.
 * - The send button only renders when the input has non-whitespace content.
 *
 * Props:
 *  - value: string — controlled input value
 *  - onChange: (value: string) => void — called on every keystroke
 *  - onSubmit: () => void — called when the user submits (Enter or button click)
 */
export default function ResearcherComposer({ value, onChange, onSubmit }) {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  function handleClick(event) {
    if (event.target.closest('button')) return;
    textareaRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} onClick={handleClick} className="w-full px-8 pt-5 pb-4">
      <div className="mx-auto max-w-xl space-y-3">
        <div className="border-background-primary cursor-text rounded-2xl border bg-white shadow-md transition-colors duration-150 focus-within:shadow-lg hover:border-zinc-300">
          <div className="p-3 pb-0">
            <textarea
              ref={textareaRef}
              name="prompt"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Researcher"
              rows={1}
              className="text-paragraph-base text-core-black placeholder:text-content-secondary max-h-[200px] min-h-9 w-full resize-none overflow-y-auto border-0 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex h-14 cursor-text items-center justify-end px-3">
            {value.trim() ? (
              <Button
                type="submit"
                color="blue"
                className="min-w-0 cursor-pointer rounded-xl px-3 py-2"
                aria-label="Send message"
              >
                <ArrowUpIcon className="size-5 text-white!" aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-paragraph-sm text-content-tertiary">
            This tool uses AI and can make mistakes. Please double-check responses.
          </p>
        </div>
      </div>
    </form>
  );
}
