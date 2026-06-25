import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { DocumentTextIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { MdComponents } from '../../../lib/mdComponents';
import { copyText, copyRichText } from '../../../lib/shareability/shareActions';
import { ShareButton, ShareButtonRow, HoverReveal } from './shareability';

/**
 * A single chat turn in the researcher's left panel. Renders one of three
 * shapes by role/state: an assistant error, a normal assistant turn (rendered
 * markdown + a copy-text / copy-rich-text share row), or a user turn (its
 * bubble + a copy-text share row).
 *
 * Booleans (`isLastUser`, `isLatestAssistant`, `showShareRow`) are derived by
 * the parent, which has the full message list and streaming state.
 *
 * @param lastUserMsgRef - attached to the outer node only when this is the last
 *   user message, so the parent can pin it to the top of the viewport.
 * @param assistantContentRefs - message.id -> rendered markdown node map, read
 *   for "copy as rich text" (and written here via the content ref callback).
 */
export default function ChatMessage({
  message,
  isLastUser,
  isLatestAssistant,
  showShareRow,
  assistantMinHeight,
  lastUserMsgRef,
  assistantContentRefs,
}) {
  return (
    <div
      ref={isLastUser ? lastUserMsgRef : null}
      style={
        isLatestAssistant ? { minHeight: `${assistantMinHeight}px` } : undefined
      }
      className={
        message.role === 'user'
          ? 'group ml-auto max-w-[85%]'
          : 'group text-paragraph-base text-core-black max-w-[92%]'
      }
    >
      {message.role === 'assistant' ? (
        message.isError ? (
          <p className="text-paragraph-base text-red-600">{message.content}</p>
        ) : (
          <>
            <div
              className="flow-root [&>*:last-child]:mb-0"
              ref={(el) => {
                if (el) {
                  assistantContentRefs.current.set(message.id, el);
                } else {
                  assistantContentRefs.current.delete(message.id);
                }
              }}
            >
              <ReactMarkdown components={MdComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
            {showShareRow && (
              <HoverReveal show={isLatestAssistant} className="mt-2">
                <ShareButtonRow>
                  <ShareButton
                    icon={DocumentTextIcon}
                    label="Copy text"
                    onClick={() => copyText(message.content)}
                  />
                  <ShareButton
                    icon={ClipboardDocumentIcon}
                    label="Copy as rich text"
                    onClick={() =>
                      copyRichText(
                        assistantContentRefs.current.get(message.id)
                          ?.innerHTML ?? '',
                        message.content,
                      )
                    }
                  />
                </ShareButtonRow>
              </HoverReveal>
            )}
          </>
        )
      ) : (
        <>
          <div className="bg-background-primary rounded-3xl rounded-tr-sm px-4 py-3 text-left">
            <p className="text-paragraph-base text-core-black wrap-break-word whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <HoverReveal className="mt-2 flex justify-end">
            <ShareButtonRow>
              <ShareButton
                icon={DocumentTextIcon}
                label="Copy text"
                onClick={() => copyText(message.content)}
              />
            </ShareButtonRow>
          </HoverReveal>
        </>
      )}
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    isError: PropTypes.bool,
  }).isRequired,
  isLastUser: PropTypes.bool,
  isLatestAssistant: PropTypes.bool,
  showShareRow: PropTypes.bool,
  assistantMinHeight: PropTypes.number,
  lastUserMsgRef: PropTypes.shape({ current: PropTypes.any }),
  assistantContentRefs: PropTypes.shape({ current: PropTypes.instanceOf(Map) }),
};
