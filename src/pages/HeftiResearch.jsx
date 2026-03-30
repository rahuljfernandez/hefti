import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import ResearcherComposer from '../components/ui/molecule/researcherComposer';
import ReactMarkdown from 'react-markdown';
import { MdComponents } from '../lib/mdComponents';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

export default function HeftiResearch() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const contextType = pathname.includes('/owners/') ? 'owner' : 'facility';

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);

  const hasStarted = messages.length > 0;

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
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setPrompt('');

    // Build what we send: clean history + new user message (no empty assistant placeholder)
    const outgoingMessages = [
      ...history.map(({ role, content }) => ({ role, content })),
      { role: 'user', content: trimmedPrompt },
    ];

    console.log('[researcher] outgoing messages:', outgoingMessages);

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
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: `Error: ${error}` }
                  : m,
              ),
            );
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
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: 'Something went wrong. Please try again.' }
            : m,
        ),
      );
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
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
                  <div className="space-y-5">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={
                          message.role === 'user'
                            ? 'bg-background-primary ml-auto max-w-[85%] rounded-3xl rounded-tr-sm px-4 py-3 text-left'
                            : 'text-paragraph-base text-core-black max-w-[92%]'
                        }
                      >
                        {message.role === 'assistant' ? (
                          <ReactMarkdown components={MdComponents}>
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <p className="text-paragraph-base text-core-black wrap-break-word whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                      </div>
                    ))}
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
