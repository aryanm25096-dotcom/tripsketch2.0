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
export { callGroq, cleanJson } from './groq.js';
export { getWikipediaImage } from './wikipedia.js';

// Feature 1 — AI Trip Planner
export { generateTripItinerary } from './itinerary.js';

// Feature 2 — Natural Language Search
export { analyzeSearchQuery } from './search.js';

// Feature 3 — Ask About a Place
export { askAboutPlace } from './askPlace.js';

// Feature 4 — Weather & Vibe
export { getWeatherAndInfo } from './weather.js';

// Feature 5 — Spot Discovery
export { generateSpots } from './spots.js';
