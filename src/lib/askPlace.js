/**
 * askPlace.js
 * -----------
 * Feature 3: Ask About This Place (AI Local Guide)
 *
 * Lets users ask specific questions about a travel spot.
 * The AI takes on the role of a friendly local guide and answers concisely.
 * Used inside each TripCard via the "Ask AI" button.
 */

import { callGroq } from './groq';

/**
 * askAboutPlace — answers a user question about a specific location.
 * @param {string} placeName - name of the travel spot (e.g. "Om Beach")
 * @param {string} question  - user's question (e.g. "Is this good for solo travel in Dec?")
 * @returns {string} - AI response (1-3 sentences)
 */
export const askAboutPlace = async (placeName, question) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: `You are a friendly local guide for ${placeName}. Give a helpful, concise answer in under 3 sentences.`,
      },
      {
        role: 'user',
        content: question,
      },
    ]);
    return content;
  } catch (error) {
    console.error('[askPlace] Error asking about place:', error);
    return "I'm having trouble retrieving that information right now!";
  }
};
