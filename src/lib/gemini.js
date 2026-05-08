/**
 * gemini.js  (backward-compatibility shim)
 * -----------------------------------------
 * This file used to contain all AI feature logic.
 * It has been refactored — each feature now lives in its own file:
 *
 *   src/lib/groq.js        → callGroq, cleanJson
 *   src/lib/wikipedia.js   → getWikipediaImage
 *   src/lib/itinerary.js   → generateTripItinerary  (Feature 1)
 *   src/lib/search.js      → analyzeSearchQuery      (Feature 2)
 *   src/lib/askPlace.js    → askAboutPlace           (Feature 3)
 *   src/lib/weather.js     → getWeatherAndInfo       (Feature 4)
 *   src/lib/spots.js       → generateSpots           (Feature 5)
 *   src/lib/index.js       → barrel re-export of all the above
 *
 * This file re-exports everything so any legacy imports
 * (import { x } from '../lib/gemini') continue to work.
 */

export * from './index';