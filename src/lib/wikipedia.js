/**
 * wikipedia.js
 * ------------
 * Fetches real location images from Wikipedia using a two-stage API approach:
 *   1. Search API → finds the best-matching Wikipedia page title
 *   2. REST Summary API → extracts the page's thumbnail at 1000px resolution
 *
 * Used by: weather.js, spots.js
 */

/**
 * getWikipediaImage — fetches the best available photo for a given location name.
 * Tries multiple search terms in order, skips disambiguation pages.
 *
 * @param {string} wikiTitle     - Primary Wikipedia page title (e.g. "Om Beach")
 * @param {string[]} fallbackTerms - Secondary search terms (e.g. ["Om Beach Gokarna"])
 * @returns {string|null} - Image URL (1000px) or null if nothing found
 */
export const getWikipediaImage = async (wikiTitle, fallbackTerms = []) => {
  const queries = [wikiTitle, ...fallbackTerms].filter(Boolean);

  for (const query of queries) {
    try {
      // Stage 1: Search Wikipedia for the most relevant page
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=3`
      );
      const searchData = await searchRes.json();

      if (searchData.query?.search?.length > 0) {
        // Skip disambiguation pages ("may refer to")
        const candidates = searchData.query.search.filter(
          (s) => !s.snippet.toLowerCase().includes('may refer to')
        );
        const bestMatch =
          candidates.length > 0
            ? candidates[0].title
            : searchData.query.search[0].title;

        // Stage 2: Fetch the page summary + thumbnail
        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatch)}`
        );

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.thumbnail?.source) {
            // Upgrade to 1000px resolution
            return summaryData.thumbnail.source.replace(/\/\d+px-/, '/1000px-');
          }
        }
      }
    } catch (e) {
      console.warn('Wikipedia image search failed for:', query);
    }
  }

  return null; // No image found — caller should apply a fallback
};
