/**
 * itinerary.js
 * ------------
 * Feature 1: AI Trip Planner
 *
 * Generates a detailed, day-by-day travel itinerary for a given destination or prompt.
 * Returns a rich Markdown-formatted string with offbeat spots, food, and stay suggestions.
 */

import { callGroq } from './groq';

/**
 * generateTripItinerary — produces a full trip plan from a natural language prompt.
 * @param {string} prompt - e.g. "3 days in Coorg with a chill vibe and local food"
 * @returns {string} - Markdown-formatted itinerary
 */
export const generateTripItinerary = async (prompt) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content:
          'You are an expert, local-vibe travel planner. Return a detailed, day-by-day itinerary with offbeat spots, food, and stay suggestions. Keep the tone warm, adventurous, and visually descriptive. Format the response beautifully using Markdown.',
      },
      {
        role: 'user',
        content: `Plan a trip: ${prompt}`,
      },
    ]);
    return content;
  } catch (error) {
    console.error('[itinerary] Error generating itinerary:', error);
    return "Oops! We couldn't generate the itinerary right now. Please check your Groq API key.";
  }
};
