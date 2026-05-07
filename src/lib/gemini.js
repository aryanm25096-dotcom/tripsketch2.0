// ✅ Switched from Gemini (quota exhausted) to Groq (free tier, fast)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

const callGroq = async (messages, isJson = false) => {
  if (!GROQ_API_KEY) {
    console.warn('Groq API key is missing. Add VITE_GROQ_API_KEY to your .env file.');
    throw new Error('Missing VITE_GROQ_API_KEY');
  }
  const body = {
    model: 'llama-3.1-8b-instant',
    messages,
    max_tokens: 1500, // Ensure long responses aren't cut off
  };
  if (isJson) {
    body.response_format = { type: 'json_object' };
  }
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
  }
  const data = await response.json();
  const content = data.choices[0].message.content;
  
  if (isJson) {
    try {
      // Small validation check
      const cleaned = cleanJson(content);
      JSON.parse(cleaned);
    } catch (e) {
      console.error('Groq returned invalid JSON:', content);
    }
  }
  
  return content;
};
const cleanJson = (str) => {
  try {
    // Remove potential markdown code blocks
    let cleaned = str.replace(/```json|```/g, '').trim();
    
    // Find the first occurrence of [ or {
    const startIdx = cleaned.search(/[\[\{]/);
    if (startIdx === -1) return cleaned;
    
    // Determine which character we found first and look for its matching closing character
    const char = cleaned[startIdx];
    const closingChar = char === '[' ? ']' : '}';
    const endIdx = cleaned.lastIndexOf(closingChar);
    
    if (endIdx === -1) return cleaned;
    
    cleaned = cleaned.substring(startIdx, endIdx + 1);
    
    // Remove trailing commas before closing braces/brackets (common LLM error)
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
    
    return cleaned;
  } catch (e) {
    console.error('Error in cleanJson:', e);
    return str;
  }
};

/**
 * 1. AI Trip Planner
 */
export const generateTripItinerary = async (prompt) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: 'You are an expert, local-vibe travel planner. Return a detailed, day-by-day itinerary with offbeat spots, food, and stay suggestions. Keep the tone warm, adventurous, and visually descriptive. Format the response beautifully using Markdown.',
      },
      { role: 'user', content: `Plan a trip: ${prompt}` },
    ]);
    return content;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return "Oops! We couldn't generate the itinerary right now. Please check your Groq API key.";
  }
};

/**
 * 2. Natural Language Search
 */
export const analyzeSearchQuery = async (query) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: `Analyze the user's travel search query and extract key JSON parameters. Return ONLY a valid JSON object with this structure: {"vibe":"chill|adventure|food|nature|any","maxBudget":number|null,"tags":["solo","group","pet-friendly","couple"]}. If a field is not mentioned, use null or "any".`,
      },
      { role: 'user', content: query },
    ], true);
    return JSON.parse(cleanJson(content));
  } catch (error) {
    console.error('Error analyzing query:', error);
    return null;
  }
};

/**
 * 3. Ask About This Place
 */
export const askAboutPlace = async (placeName, question) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: `You are a friendly local guide for ${placeName}. Give a helpful, concise answer in under 3 sentences.`,
      },
      { role: 'user', content: question },
    ]);
    return content;
  } catch (error) {
    console.error('Error asking about place:', error);
    return "I'm having trouble retrieving that information right now!";
  }
};

/**
 * 4. Get Weather & Info
 */
export const getWeatherAndInfo = async (location) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: `You are a travel AI. Return ONLY a valid JSON object for the weather/vibe of the given location. Structure: {"temp":"31°C","condition":"Sunny","description":"A quick 1-sentence vibe/weather summary.", "wikiTitle": "Exact Wikipedia page title", "searchTerms": ["Term 1", "Term 2"]}. Make an educated guess for the current season.`,
      },
      { role: 'user', content: `Weather and vibe for: ${location}` },
    ], true);
    
    const weatherData = JSON.parse(cleanJson(content));
    const image = await getWikipediaImage(weatherData.wikiTitle, weatherData.searchTerms);
    
    return {
      ...weatherData,
      image: image || `https://loremflickr.com/1200/600/${encodeURIComponent(location)},landscape/all`
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

/**
 * Helper: Fetch real location image from Wikipedia (no API key needed)
 */
const getWikipediaImage = async (wikiTitle, fallbackTerms = []) => {
  const queries = [wikiTitle, ...fallbackTerms].filter(Boolean);
  
  for (const query of queries) {
    try {
      // Step 1: Search with preference for exact title match
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=3`
      );
      const searchData = await searchRes.json();
      
      if (searchData.query?.search?.length > 0) {
        // Try to find a match that isn't a disambiguation page
        const candidates = searchData.query.search.filter(s => !s.snippet.toLowerCase().includes('may refer to'));
        const bestMatch = candidates.length > 0 ? candidates[0].title : searchData.query.search[0].title;
        
        // Step 2: Get the summary/thumbnail
        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatch)}`
        );
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.thumbnail?.source) {
            return summaryData.thumbnail.source.replace(/\/\d+px-/, '/1000px-');
          }
        }
      }
    } catch (e) {
      console.warn('Wikipedia search failed for:', query);
    }
  }
  return null;
};

/**
 * 5. Generate Real Spots with Wikipedia images
 */
export const generateSpots = async (destination, vibe, crowd) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: `You are an expert local travel planner. Generate 6 REAL, authentic travel spots in or near the destination. Return ONLY a valid JSON array. Each object MUST match this structure exactly:
{"id":"unique-id","name":"Real Name","location":"Specific location, City","vibe":"chill|adventure|food|nature|culture","budget":number,"crowdLevel":"low|medium|high","tags":["tag1","tag2"],"rating":number,"popularity":number,"description":"2-sentence description.","wikiTitle":"Exact Wikipedia page name (e.g. 'Om Beach, Gokarna' or 'Hadimba Devi Temple')","searchTerms":["Landmark Name City", "Specific Spot Name"]}`,
      },
      {
        role: 'user',
        content: `Destination: ${destination}. Vibe: ${vibe}. Crowd tolerance: ${crowd}. 
        CRITICAL: For 'wikiTitle', provide the most likely Wikipedia page name that has a photo of the SPECIFIC spot. 
        For 'searchTerms', include the spot name PLUS the city name to ensure Wikipedia Search finds the right page. 
        Example for Om Beach in Gokarna: wikiTitle: "Om Beach", searchTerms: ["Om Beach Gokarna", "Beaches in Gokarna"].`,
      },
    ]);

    const cleanedContent = cleanJson(content);
    const spots = JSON.parse(cleanedContent);

    // Fetch Wikipedia images in parallel
    const spotsWithImages = await Promise.all(
      spots.map(async (spot) => {
        const wikiImage = await getWikipediaImage(spot.wikiTitle, spot.searchTerms);
        
        // If Wikipedia fails, use LoremFlickr with specific tags
        const tags = `${spot.name},${destination}`.split(/[\s,]+/).filter(t => t.length > 2).join(',');
        const fallback = `https://loremflickr.com/800/600/${encodeURIComponent(tags)}/all`;
        
        return {
          ...spot,
          image: wikiImage || fallback,
        };
      })
    );

    return spotsWithImages;
  } catch (error) {
    console.error('Error generating spots:', error);
    return [];
  }
};