/**
 * spots.js
 * --------
 * Feature 5: Spot Discovery
 *
 * Generates 6 real, authentic travel spots for a given destination and vibe.
 * Each spot is enriched with a real photograph fetched from Wikipedia.
 * Falls back to LoremFlickr (keyword-tagged) if Wikipedia has no image.
 */

import { callGroq, cleanJson } from './groq';
import { getWikipediaImage } from './wikipedia';

/**
 * generateSpots — fetches AI-generated spots with real location images.
 * @param {string} destination - e.g. "Gokarna"
 * @param {string} vibe        - e.g. "chill" | "adventure" | "food" | "nature" | "any"
 * @param {string} crowd       - e.g. "low" | "medium" | "high"
 * @returns {Array} - array of spot objects with images attached
 */
export const generateSpots = async (destination, vibe, crowd) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: `You are an expert local travel planner. Generate 6 REAL, authentic travel spots in or near the destination.
Return ONLY a valid JSON array. Each object MUST match this structure exactly:
{
  "id": "unique-id",
  "name": "Real Spot Name",
  "location": "Specific area, City",
  "vibe": "chill|adventure|food|nature|culture",
  "budget": number,
  "crowdLevel": "low|medium|high",
  "tags": ["tag1", "tag2"],
  "rating": number,
  "popularity": number,
  "description": "Two-sentence description of the spot.",
  "wikiTitle": "Exact Wikipedia page name (e.g. 'Om Beach' or 'Hadimba Devi Temple')",
  "searchTerms": ["Spot Name City", "Landmark Area"]
}`,
      },
      {
        role: 'user',
        content: `Destination: ${destination}. Vibe: ${vibe}. Crowd tolerance: ${crowd}.
CRITICAL: For 'wikiTitle', use the most likely Wikipedia page title that has a PHOTO of this specific spot.
For 'searchTerms', always include the spot name AND city/region to help Wikipedia find the right page.
Example — Om Beach in Gokarna: wikiTitle: "Om Beach", searchTerms: ["Om Beach Gokarna", "Beaches in Gokarna"].`,
      },
    ]);

    const spots = JSON.parse(cleanJson(content));

    // Fetch Wikipedia images for all spots in parallel
    const spotsWithImages = await Promise.all(
      spots.map(async (spot) => {
        const wikiImage = await getWikipediaImage(spot.wikiTitle, spot.searchTerms);

        // Fallback: LoremFlickr with keyword tags from spot name + destination
        const tags = `${spot.name},${destination}`
          .split(/[\s,]+/)
          .filter((t) => t.length > 2)
          .join(',');
        const fallback = `https://loremflickr.com/800/600/${encodeURIComponent(tags)}/all`;

        return {
          ...spot,
          image: wikiImage || fallback,
        };
      })
    );

    return spotsWithImages;
  } catch (error) {
    console.error('[spots] Error generating spots:', error);
    return [];
  }
};
