import React, { useState } from 'react';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import ResearcherComposer from '../components/ui/molecule/researcherComposer';

export default function HeftiResearch() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);

  const hasStarted = messages.length > 0;

  function submitPrompt() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: currentMessages.length + 1, role: 'user', content: trimmedPrompt },
    ]);
    setPrompt('');
  }

  return (
    <>
      <Breadcrumb />

      <div className="grid h-[calc(100vh-140px)] grid-cols-1 bg-white lg:grid-cols-[minmax(320px,0.95fr)_minmax(420px,1.05fr)]">
        {/**Left-Panel Text and Input */}
        <section className="bg-background-secondary flex min-h-0 flex-col">
          <div className="ml-auto flex h-full min-h-0 w-full max-w-[585px] flex-col">
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
                        <p className="text-paragraph-base text-core-black wrap-break-word whitespace-pre-wrap">
                          {message.content}
                        </p>
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
