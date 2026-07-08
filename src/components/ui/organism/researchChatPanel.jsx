import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ResearcherComposer from '../molecule/researcherComposer';
import ResearchChatMessage from '../molecule/researchChatMessage';
import ResearchEmptyState from '../molecule/researchEmptyState';
import DimOverlay from '../../../lib/shareability/researchPanelDimOverlay';

/**
 * Left researcher panel: the chat transcript (or the pre-conversation welcome)
 * plus the prompt composer. The transcript's per-message booleans are derived
 * here since they depend on the full message list and streaming state. Shows
 * the highlight/dim accent when the share widget targets this panel.
 */
export default function ResearchChatPanel({
  highlighted,
  dimmed,
  hasStarted,
  messages,
  isStreaming,
  contextType,
  prompt,
  onPromptChange,
  onSubmitPrompt,
  assistantMinHeight,
  messagesContainerRef,
  lastUserMsgRef,
  assistantContentRefs,
}) {
  return (
    <section
      className={clsx(
        'bg-background-tertiary relative flex min-h-0 flex-col transition-shadow',
        highlighted && 'ring-2 ring-blue-600 ring-inset',
      )}
    >
      {dimmed && <DimOverlay />}
      <div className="ml-auto flex h-full min-h-0 w-full max-w-[640px] flex-col">
        {hasStarted ? (
          <div
            ref={messagesContainerRef}
            className="min-h-0 flex-1 overflow-y-auto px-6 py-8"
          >
            <div className="space-y-2">
              {messages.map((message, i) => {
                const isLastUser =
                  message.role === 'user' &&
                  !messages.slice(i + 1).some((m) => m.role === 'user');
                const isLatestAssistant =
                  message.role === 'assistant' && i === messages.length - 1;
                const showShareRow =
                  message.role === 'assistant' &&
                  !message.isError &&
                  !(isLatestAssistant && isStreaming) &&
                  message.content.trim().length > 0;
                return (
                  <ResearchChatMessage
                    key={message.id}
                    message={message}
                    isLastUser={isLastUser}
                    isLatestAssistant={isLatestAssistant}
                    showShareRow={showShareRow}
                    assistantMinHeight={assistantMinHeight}
                    lastUserMsgRef={lastUserMsgRef}
                    assistantContentRefs={assistantContentRefs}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <ResearchEmptyState
            contextType={contextType}
            onSelectPrompt={onSubmitPrompt}
          />
        )}
        {/* Single composer instance shared by both branches — staying mounted
            across the empty→started flip preserves its focus/IME state. */}
        <ResearcherComposer
          value={prompt}
          onChange={onPromptChange}
          onSubmit={onSubmitPrompt}
        />
      </div>
    </section>
  );
}

ResearchChatPanel.propTypes = {
  highlighted: PropTypes.bool,
  dimmed: PropTypes.bool,
  hasStarted: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  isStreaming: PropTypes.bool,
  contextType: PropTypes.oneOf(['owner', 'facility']).isRequired,
  prompt: PropTypes.string,
  onPromptChange: PropTypes.func.isRequired,
  onSubmitPrompt: PropTypes.func.isRequired,
  assistantMinHeight: PropTypes.number,
  messagesContainerRef: PropTypes.shape({ current: PropTypes.any }),
  lastUserMsgRef: PropTypes.shape({ current: PropTypes.any }),
  assistantContentRefs: PropTypes.shape({ current: PropTypes.instanceOf(Map) }),
};
