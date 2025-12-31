// Updated chatbot.js — client-side streaming integration with /api/chat
// Assumes index.html and chatbot.css are unchanged except this script is used.
// Sends the user message to POST /api/chat and reads the streaming response.

document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const themeToggle = document.getElementById('theme-toggle');
  const chatbotRoot = document.getElementById('chatbot');

  const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const scrollToBottom = () => { messagesEl.scrollTop = messagesEl.scrollHeight; };

  const createMessageElement = (role, text, {typing = false} = {}) => {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${role}`;
    wrapper.setAttribute('data-role', role);

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? 'Me' : 'AI';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    if (typing) {
      // typing indicator
      bubble.innerHTML = '<div class="typing" aria-hidden="true"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    } else {
      bubble.innerHTML = esc(text).replace(/\n/g, '<br/>');
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    return { wrapper, bubble };
  };

  // initial welcome
  const welcome = createMessageElement('bot', "Hello! I'm your assistant. Ask me anything.");
  messagesEl.appendChild(welcome.wrapper);
  scrollToBottom();

  // resize textarea
  const resizeTextarea = () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  };
  input.addEventListener('input', resizeTextarea);
  resizeTextarea();

  // STREAMING sendMessage
  let currentAbortController = null;

  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;
    // append user message
    const userMsg = createMessageElement('user', text);
    messagesEl.appendChild(userMsg.wrapper);
    input.value = '';
    resizeTextarea();
    scrollToBottom();

    // append typing bubble for bot
    const { wrapper: typingWrapper, bubble: typingBubble } = createMessageElement('bot', '', { typing: true });
    messagesEl.appendChild(typingWrapper);
    scrollToBottom();

    // cancel previous if exists
    if (currentAbortController) {
      currentAbortController.abort();
    }
    const ac = new AbortController();
    currentAbortController = ac;

    try {
      // POST to server endpoint that proxies to OpenAI
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // you can send full conversation here; for demo only the user message:
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: text }
          ],
          // model: optional; server can choose default
        }),
        signal: ac.signal,
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Server error: ${resp.status} ${errText}`);
      }

      // Stream response from server (which is streaming from OpenAI)
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let partial = ''; // accumulated assistant text

      // Some servers stream NDJSON lines like: data: {...}\n\n
      // We'll parse both raw text and NDJSON "data: " format robustly.
      let buffer = '';

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) {
          done = true;
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Attempt to parse for "data: " blocks (OpenAI streaming)
        // Split on double-newline which separates events
        const parts = buffer.split(/\r\n\r\n|\n\n/);
        // leave last part in buffer (it may be incomplete)
        buffer = parts.pop();

        for (const part of parts) {
          // possible forms:
          // "data: [DONE]" or "data: {json...}"
          const lines = part.split(/\r\n|\n/).map(l => l.trim()).filter(Boolean);
          for (const line of lines) {
            const prefix = line.startsWith('data:') ? 'data:' : null;
            const payload = prefix ? line.slice(5).trim() : line;
            if (!payload) continue;
            if (payload === '[DONE]') {
              // stream finished
              done = true;
              break;
            }
            // Try to parse JSON
            try {
              const obj = JSON.parse(payload);
              // structure for chat completion streaming:
              // { choices: [ { delta: { content: "..." } } ] }
              const choices = obj.choices || [];
              const textDelta = (choices[0] && choices[0].delta && choices[0].delta.content) || '';
              if (textDelta) {
                partial += textDelta;
                // update typing bubble with current partial text
                typingBubble.innerHTML = esc(partial).replace(/\n/g, '<br/>');
                scrollToBottom();
              }
            } catch (err) {
              // not JSON - fallback: append raw payload
              partial += payload;
              typingBubble.innerHTML = esc(partial).replace(/\n/g, '<br/>');
              scrollToBottom();
            }
          }
        }
      }

      // stream finished: replace typing with final assistant message
      const finalBubble = createMessageElement('bot', partial);
      messagesEl.replaceChild(finalBubble.wrapper, typingWrapper);
      scrollToBottom();
    } catch (err) {
      if (err.name === 'AbortError') {
        // request was aborted by a new send; remove typing indicator
        messagesEl.removeChild(typingWrapper);
      } else {
        console.error('Chat error', err);
        // show error in bot bubble
        const errBubble = createMessageElement('bot', 'Sorry — an error occurred: ' + err.message);
        messagesEl.replaceChild(errBubble.wrapper, typingWrapper);
        scrollToBottom();
      }
    } finally {
      currentAbortController = null;
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    const isDark = chatbotRoot.classList.toggle('dark-theme');
    themeToggle.setAttribute('aria-pressed', String(isDark));
  });
});
