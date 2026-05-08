import { callGroq, cleanJson } from './groq.js';
import { getWikipediaImage } from './wikipedia.js';

export const generateSpots = async (destination, vibe, crowd) => {
  try {
    const content = await callGroq(
      [
        {
          role: 'system',
          content: `You are an expert local travel planner. Generate 6 REAL, authentic travel spots in or near the destination.
Return ONLY valid JSON (no markdown, no commentary) in this exact structure:
{
  "spots": [
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
    }
  ]
}`,
        },
        {
          role: 'user',
          content: `Destination: ${destination}. Vibe: ${vibe}. Crowd tolerance: ${crowd}.
CRITICAL: For 'wikiTitle', use the most likely Wikipedia page title that has a PHOTO of this specific spot.
For 'searchTerms', always include the spot name AND city/region to help Wikipedia find the right page.
Example — Om Beach in Gokarna: wikiTitle: "Om Beach", searchTerms: ["Om Beach Gokarna", "Beaches in Gokarna"].`,
        },
      ],
      true
    );

    const parsed = JSON.parse(cleanJson(content));
    const spots = Array.isArray(parsed) ? parsed : parsed?.spots;
    if (!Array.isArray(spots)) return [];

    
    const spotsWithImages = await Promise.all(
      spots.map(async (spot) => {
        const wikiImage = await getWikipediaImage(spot.wikiTitle, spot.searchTerms);

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
