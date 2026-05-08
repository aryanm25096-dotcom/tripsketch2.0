import { callGroq, cleanJson } from './groq.js';
export const analyzeSearchQuery = async (query) => {
  try {
    const content = await callGroq(
      [
        {
          role: 'system',
          content: `Analyze the user's travel search query and extract key JSON parameters. 
Return ONLY a valid JSON object with this structure:
{"vibe":"chill|adventure|food|nature|any","maxBudget":number|null,"tags":["solo","group","pet-friendly","couple"]}
If a field is not mentioned, use null or "any".`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      true 
    );

    return JSON.parse(cleanJson(content));
  } catch (error) {
    console.error('[search] Error analyzing query:', error);
    return null;
  }
};
