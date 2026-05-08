/**
 * weather.js
 * ----------
 * Feature 4: Weather & Vibe Predictor
 *
 * Given a destination name, uses Groq to estimate the current season's
 * weather and overall travel vibe, then attaches a real Wikipedia photo
 * of the location for a rich visual experience.
 */

import { callGroq, cleanJson } from './groq';
import { getWikipediaImage } from './wikipedia';

/**
 * getWeatherAndInfo — returns weather summary + location image for a destination.
 * @param {string} location - destination name, e.g. "Spiti Valley"
 * @returns {{ temp, condition, description, wikiTitle, searchTerms, image } | null}
 */
export const getWeatherAndInfo = async (location) => {
  try {
    const content = await callGroq(
      [
        {
          role: 'system',
          content: `You are a travel AI. Return ONLY a valid JSON object for the weather/vibe of the given location.
Structure: {
  "temp": "31°C",
  "condition": "Sunny",
  "description": "A quick 1-sentence vibe/weather summary.",
  "wikiTitle": "Exact Wikipedia page title for this destination",
  "searchTerms": ["City Name India", "Destination Landmark"]
}
Make an educated guess for the current season (May).`,
        },
        {
          role: 'user',
          content: `Weather and vibe for: ${location}`,
        },
      ],
      true
    );

    const weatherData = JSON.parse(cleanJson(content));
    const image = await getWikipediaImage(weatherData.wikiTitle, weatherData.searchTerms);

    return {
      ...weatherData,
      image:
        image ||
        `https://loremflickr.com/1200/600/${encodeURIComponent(location)},landscape/all`,
    };
  } catch (error) {
    console.error('[weather] Error fetching weather & info:', error);
    return null;
  }
};
