#!/usr/bin/env node
import { cleanJson } from '../src/lib/groq.js';

console.log('groq.js quick tester — running cleanJson checks\n');

const cases = [
  {
    name: 'code block with trailing comma',
    input: 'Here is the JSON:\n```json\n{ "a": 1, "b": 2, }\n```',
  },
  {
    name: 'array with trailing comma',
    input: '[1, 2, 3,]',
  },
  {
    name: 'unescaped newlines in string',
    input: '{\n  "text": "line1\nline2"\n}',
  },
  {
    name: 'clean JSON object',
    input: '{"ok": true, "n": 5}',
  },
];

for (const c of cases) {
  console.log(`Case: ${c.name}`);
  console.log('Original:');
  console.log(c.input);
  const cleaned = cleanJson(c.input);
  console.log('\nCleaned:');
  console.log(cleaned);
  try {
    const parsed = JSON.parse(cleaned);
    console.log('\nParsed:', parsed);
  } catch (e) {
    console.log('\nParsed: <failed to parse> —', e.message);
  }
  console.log('\n' + '-'.repeat(60) + '\n');
}

// Note about Groq API call
if (!process.env.VITE_GROQ_API_KEY) {
  console.log('VITE_GROQ_API_KEY is not set — skipping network call to callGroq.');
} else {
  console.log('VITE_GROQ_API_KEY is set. If you want, you can call callGroq manually.');
}

console.log('\nDone.');
