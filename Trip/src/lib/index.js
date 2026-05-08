/**
 * index.js
 * --------
 * Barrel export for the lib/ folder.
 *
 * Re-exports all features so existing imports like:
 *   import { generateSpots } from '../lib/gemini'
 * can be updated to:
 *   import { generateSpots } from '../lib'
 *
 * Also re-exports shared utilities for direct use if needed.
 */

// Shared utilities
export { callGroq, cleanJson } from './groq';
export { getWikipediaImage } from './wikipedia';

// Feature 1 — AI Trip Planner
export { generateTripItinerary } from './itinerary';

// Feature 2 — Natural Language Search
export { analyzeSearchQuery } from './search';

// Feature 3 — Ask About a Place
export { askAboutPlace } from './askPlace';

// Feature 4 — Weather & Vibe
export { getWeatherAndInfo } from './weather';

// Feature 5 — Spot Discovery
export { generateSpots } from './spots';
