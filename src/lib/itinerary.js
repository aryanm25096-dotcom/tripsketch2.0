import { callGroq } from './groq';
export const generateTripItinerary = async (prompt) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content:
          'You are an expert, local-vibe travel planner. Return a detailed, day-by-day itinerary with offbeat spots, food, and stay suggestions. Keep the tone warm, adventurous, and visually descriptive. Format the response beautifully using Markdown.',
      },
      {
        role: 'user',
        content: `Plan a trip: ${prompt}`,
      },
    ]);
    return content;
  } catch (error) {
    console.error('[itinerary] Error generating itinerary:', error);
    return "Oops! We couldn't generate the itinerary right now. Please check your Groq API key.";
  }
};
