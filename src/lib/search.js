/**
 * search.js
 * ---------
 * Feature 2: Natural Language Search Analyzer
 *
 * Takes a free-text user query (e.g. "chill solo trip under 2000 budget")
 * and extracts structured JSON parameters like vibe, budget, and tags.
 * These are used to filter and rank travel spots dynamically.
 */

import { callGroq, cleanJson } from './groq';

/**
 * analyzeSearchQuery — parses a natural language query into structured search filters.
 * @param {string} query - raw user input, e.g. "I want a pet-friendly adventure trip"
 * @returns {{ vibe: string, maxBudget: number|null, tags: string[] } | null}
 */
export const analyzeSearchQuery = async (query) => {
  try {
    const content = await callGroq(
      [
        {
          role: 'system',
          content: `Analyze the user's travel search query and extract key JSON parameters. 
Return ONLY a valid JSON object with this structure:
{"vibe":"chill|adventure|food|nature|any","maxBudget":number|null,"tags":["solo","group","pet-friendly","couple"]}
If a field is not mentioned, use null or "any".`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      true // request JSON mode
    );

    return JSON.parse(cleanJson(content));
  } catch (error) {
    console.error('[search] Error analyzing query:', error);
    return null;
  }
};
