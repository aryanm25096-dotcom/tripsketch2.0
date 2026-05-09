import { callGroq, cleanJson } from './groq.js';
import { getWikipediaImage } from './wikipedia.js';

export const generateSpots = async (destination, vibe, crowd) => {
  try {
    const content = await callGroq(
      [
        {
          role: 'system',
          content: `You are an expert local travel planner. Generate 6 REAL, authentic travel spots in or near the destination.
Return ONLY valid JSON. START your response with '[' and END with ']'. 
NO markdown, NO code blocks, NO commentary, NO 'Here is your JSON'.
Follow this exact array structure:
[
  {
    "id": 1,
    "name": "Spot Name",
    "location": "Area, City",
    "description": "Short 1-sentence vibe",
    "vibe": "Nature|Culture|Food|Adventure",
    "rating": 4.8,
    "tags": ["tag1", "tag2"],
    "wikiTitle": "Exact Wikipedia page name",
    "searchTerms": ["Spot Name City"]
  }
]`,
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

    const cleaned = cleanJson(content);
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('[spots] JSON Parse Error. Raw content was:', content);
      console.error('[spots] Cleaned content was:', cleaned);
      return [];
    }

    const spots = Array.isArray(parsed) ? parsed : parsed?.spots;
    if (!Array.isArray(spots)) {
      console.warn('[spots] Result is not an array:', parsed);
      return [];
    }

    
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
  } 
  catch (error) {
    console.error('[spots] Error generating spots:', error);
    return [];
  }
};
