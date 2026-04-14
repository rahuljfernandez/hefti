import React, { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import ResearcherComposer from '../components/ui/molecule/researcherComposer';
import ReactMarkdown from 'react-markdown';
import { MdComponents } from '../lib/mdComponents';

const API_BASE_URL =
  import.meta.env.RESEARCHER_FUNCTION_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

/**
 * HeftiResearch
 *
 * AI-powered researcher chat page for exploring facility and owner data.
 * Accessible via the CTA on Owner and Facility profile pages.
 *
 * - Derives `contextType` ("owner" | "facility") from the current URL path
 *   so the backend can scope its response to the right entity type.
 * - Streams assistant responses from `POST /api/researcher` using the
 *   Fetch ReadableStream API and renders them with react-markdown.
 * - Keeps a rolling history of the last 20 messages to support multi-turn
 *   conversation without unbounded context growth.
 * - Uses `flushSync` + `requestAnimationFrame` to scroll the latest user
 *   bubble to the top of the viewport immediately after send, before the
 *   assistant has produced any output.
 *
 * Route params:
 *  - slug: string — the owner or facility slug, forwarded to the API for context.
 */
export default function HeftiResearch() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const contextType = pathname.includes('/owners/') ? 'owner' : 'facility';

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [assistantMinHeight, setAssistantMinHeight] = useState(0);
  const messagesContainerRef = useRef(null);
  const lastUserMsgRef = useRef(null);

  const hasStarted = messages.length > 0;

  // Tracks the height of the scroll container so we can give the incoming assistant
  // message bubble enough min-height to fill the remaining viewport. This ensures
  // there's always enough scroll depth to push the user message to the top of the
  // view when a new message is sent, even before the assistant has streamed any content.
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    function updateAssistantMinHeight() {
      setAssistantMinHeight(Math.max(container.clientHeight - 120, 0));
    }

    updateAssistantMinHeight();

    const resizeObserver = new ResizeObserver(updateAssistantMinHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [hasStarted]);

  async function submitPrompt() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    // Snapshot history before touching state
    const history = messages; // already has prior user + assistant turns

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedPrompt,
    };
    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      isError: false,
    };

    // flushSync forces React to commit the new messages to the DOM synchronously
    // before we proceed. Without this, the requestAnimationFrame below would run
    // before the DOM has updated, meaning lastUserMsgRef wouldn't point to the
    // correct element yet and the scroll would be off.
    flushSync(() => {
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setPrompt('');
    });

    // After the DOM has updated, scroll the container so the user's message bubble
    // sits at the top of the viewport. We use requestAnimationFrame to wait one
    // paint cycle, ensuring layout is complete and getBoundingClientRect() returns
    // accurate values before we calculate the scroll offset.
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      const lastUserMessage = lastUserMsgRef.current;

      if (!container || !lastUserMessage) return;

      const containerRect = container.getBoundingClientRect();
      const messageRect = lastUserMessage.getBoundingClientRect();
      const topOffset = messageRect.top - containerRect.top;

      container.scrollTo({
        top: container.scrollTop + topOffset,
        behavior: 'auto',
      });
    });

    function setError(msg) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: msg, isError: true }
            : m,
        ),
      );
    }

    // Build what we send: trimmed history (max 20 messages) + new user message
    const outgoingMessages = [
      ...history.map(({ role, content }) => ({ role, content })).slice(-20),
      { role: 'user', content: trimmedPrompt },
    ];

    // console.log('[researcher] outgoing messages:', outgoingMessages);

    try {
      const res = await fetch(`${API_BASE_URL}/researcher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoingMessages, contextType, slug }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const payload = line.slice(6);
          if (payload === '[DONE]') break;

          const { text, error } = JSON.parse(payload);

          if (error) {
            setError(error);
            break;
          }

          if (text) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: m.content + text }
                  : m,
              ),
            );
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <>
      <Breadcrumb />

      <div className="grid h-[calc(100vh-140px)] grid-cols-1 bg-white lg:grid-cols-2">
        {/**Left-Panel Text and Input */}
        <section className="bg-background-secondary flex min-h-0 flex-col">
          <div className="ml-auto flex h-full min-h-0 w-full max-w-[640px] flex-col">
            {hasStarted ? (
              <>
                {/**Text Display */}
                <div
                  ref={messagesContainerRef}
                  className="min-h-0 flex-1 overflow-y-auto px-6 py-8"
                >
                  <div className="space-y-5">
                    {messages.map((message, i) => {
                      const isLastUser =
                        message.role === 'user' &&
                        !messages.slice(i + 1).some((m) => m.role === 'user');
                      const isLatestAssistant =
                        message.role === 'assistant' &&
                        i === messages.length - 1;
                      return (
                        <div
                          key={message.id}
                          ref={isLastUser ? lastUserMsgRef : null}
                          style={
                            isLatestAssistant
                              ? { minHeight: `${assistantMinHeight}px` }
                              : undefined
                          }
                          className={
                            message.role === 'user'
                              ? 'bg-background-primary ml-auto max-w-[85%] rounded-3xl rounded-tr-sm px-4 py-3 text-left'
                              : 'text-paragraph-base text-core-black max-w-[92%]'
                          }
                        >
                          {message.role === 'assistant' ? (
                            message.isError ? (
                              <p className="text-paragraph-base text-red-600">
                                {message.content}
                              </p>
                            ) : (
                              <ReactMarkdown components={MdComponents}>
                                {message.content}
                              </ReactMarkdown>
                            )
                          ) : (
                            <p className="text-paragraph-base text-core-black wrap-break-word whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <ResearcherComposer
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={submitPrompt}
                />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <div className="text-center">
                  <h1 className="text-heading-lg text-core-black mb-2">
                    Hefti Researcher
                  </h1>
                  <p className="text-paragraph-lg text-content-secondary">
                    Ask a question about facilities, owners, or quality data.
                  </p>
                </div>
                <ResearcherComposer
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={submitPrompt}
                />
              </div>
            )}
          </div>
        </section>

        {/**Right-Panel Images and Export */}
        <section className="flex min-h-0 flex-col bg-white">
          <div className="mr-auto flex h-full w-full max-w-[600px] flex-col"></div>
        </section>
      </div>
    </>
  );
}
