/**
 * groq.js
 * -------
 * Shared utilities for calling the Groq API and safely parsing LLM JSON responses.
 * Every feature module imports from here — do not add feature-specific logic here.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const parseRetryAfterMs = (message) => {
  // Example: "Please try again in 13.27s."
  const match = String(message).match(/try again in\s+(\d+(?:\.\d+)?)s/i);
  if (!match) return null;
  const seconds = Number(match[1]);
  if (!Number.isFinite(seconds)) return null;
  return Math.max(250, Math.ceil(seconds * 1000));
};

/**
 * callGroq — sends a message array to the Groq LLM and returns the raw text response.
 * @param {Array} messages  - OpenAI-format message array [{role, content}]
 * @param {boolean} isJson  - if true, requests JSON-mode output from the model
 */
export const callGroq = async (messages, isJson = false) => {
  if (!GROQ_API_KEY) {
    console.warn('Groq API key is missing. Add VITE_GROQ_API_KEY to your .env file.');
    throw new Error('Missing VITE_GROQ_API_KEY');
  }

  const body = {
    model: 'llama-3.1-8b-instant',
    messages,
    max_tokens: 1500, // Prevent truncated responses
  };

  if (isJson) {
    body.response_format = { type: 'json_object' };
  }

  const doFetch = async () =>
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

  let response = await doFetch();

  // One automatic retry on rate limits
  if (!response.ok && response.status === 429) {
    let retryMs = 1500;
    try {
      const err = await response.json();
      retryMs = parseRetryAfterMs(err?.error?.message) ?? retryMs;
    } catch {
      // ignore
    }
    await sleep(retryMs);
    response = await doFetch();
  }

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  if (isJson) {
    try {
      JSON.parse(cleanJson(content)); // Validate silently
    } catch {
      console.error('Groq returned invalid JSON:', content);
    }
  }

  return content;
};

/**
 * cleanJson — robustly extracts a JSON object or array from a raw LLM string.
 * Handles markdown code blocks, trailing commas, and conversational preambles.
 * @param {string} str - raw string from the LLM
 * @returns {string} - cleaned JSON string ready to parse
 */
export const cleanJson = (str) => {
  try {
    let cleaned = str.replace(/```json|```/g, '').trim();

    const startIdx = cleaned.search(/[[]{]/);
    if (startIdx === -1) return cleaned;

    const char = cleaned[startIdx];
    const closingChar = char === '[' ? ']' : '}';
    const endIdx = cleaned.lastIndexOf(closingChar);

    if (endIdx === -1) return cleaned;

    cleaned = cleaned.substring(startIdx, endIdx + 1);
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1'); // Remove trailing commas

    return cleaned;
  } catch (e) {
    console.error('Error in cleanJson:', e);
    return str;
  }
};
