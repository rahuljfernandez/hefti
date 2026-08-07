import { useState } from 'react';
import { flushSync } from 'react-dom';

const API_BASE_URL =
  import.meta.env.VITE_RESEARCHER_FUNCTION_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

/**
 * The researcher chat stream engine. Owns the streaming lifecycle and exposes
 * `submitPrompt`, which sends a turn and folds the SSE response (text + charts)
 * into the message/chart state passed in.
 *
 * Streams assistant responses from `POST /api/researcher` using the Fetch
 * ReadableStream API, accumulating SSE lines across TCP chunks before parsing.
 * Keeps a rolling history of the last 20 messages to support multi-turn
 * conversation without unbounded context growth.
 *
 * The new user message is committed synchronously with `flushSync` so the left
 * panel can pin it to the top (`pinUserMessageToTop`) before the response
 * streams in. Charts arrive asynchronously, so the right panel pins reactively
 * (see useResearchScroll).
 *
 * Owns: `isStreaming`. Drives (via the props passed in): messages, charts,
 * `chartCountRef` (incremented per chart), and `turnStartIndexRef` (snapshotted
 * at submit so the "Full session (PDF)" export can group charts by turn).
 */
export default function useResearchStream({
  contextType,
  slug,
  prompt,
  setPrompt,
  messages,
  setMessages,
  charts,
  setCharts,
  chartsRef,
  chartCountRef,
  turnStartIndexRef,
  pinUserMessageToTop,
}) {
  const [isStreaming, setIsStreaming] = useState(false);

  async function submitPrompt(override) {
    if (isStreaming) return;
    const trimmedPrompt = (
      typeof override === 'string' ? override : prompt
    ).trim();
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

    turnStartIndexRef.current = charts.length;

    /* flushSync forces React to commit the new messages to the DOM synchronously
       before we proceed. Without this, the requestAnimationFrame inside
       pinUserMessageToTop would run before the DOM has updated, meaning
       lastUserMsgRef wouldn't point to the correct element yet and the scroll
       would be off. */
    flushSync(() => {
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setPrompt('');
    });

    // Pin the new user message to the top now that it's in the DOM.
    pinUserMessageToTop();

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

    setIsStreaming(true);
    try {
      const res = await fetch(`${API_BASE_URL}/researcher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoingMessages, contextType, slug }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      /* DEBUG-ONLY: finalText/finalCharts exist solely to feed the debug log at
         the end of the stream loop. The UI is driven by setMessages/setCharts,
         not these. Remove these two declarations and their accumulation lines
         below when the debug console.log is removed. */
      let finalText = '';
      const finalCharts = [];
      let lineBuffer = '';
      let done = false;

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        done = streamDone;

        /* Accumulate into a line buffer so SSE lines split across TCP chunks are
           reassembled before parsing. Without this, large chart payloads cause
           JSON.parse failures when the chunk boundary falls mid-line. */
        lineBuffer += decoder.decode(value ?? new Uint8Array(), {
          stream: !done,
        });

        const lines = lineBuffer.split('\n');
        // Keep the last (potentially incomplete) segment in the buffer
        lineBuffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') {
            done = true;
            break;
          }

          const { text, error, chart } = JSON.parse(payload);

          if (error) {
            setError(error);
            done = true;
            break;
          }

          if (text) {
            finalText += text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: m.content + text }
                  : m,
              ),
            );
          }

          if (chart) {
            finalCharts.push(chart);
            chartCountRef.current += 1;
            chartsRef.current = [...chartsRef.current, chart];
            setCharts((prev) => [...prev, chart]);
          }
        }
      }

      /* DEBUG-ONLY: remove before production. Removing this also makes finalText
         and finalCharts (declared above) dead code — delete them together. */
      console.log('[researcher] final response:', {
        text: finalText,
        charts: finalCharts,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsStreaming(false);
      /* Stamps which charts (by index) this turn produced, so the "Full
         session (PDF)" export can group charts under the right turn —
         `charts` itself carries no turn identity. */
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                chartStart: turnStartIndexRef.current,
                chartEnd: chartCountRef.current,
              }
            : m,
        ),
      );
    }
  }

  return { isStreaming, submitPrompt };
}
