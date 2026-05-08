import { callGroq } from './groq.js';
export const askAboutPlace = async (placeName, question) => {
  try {
    const content = await callGroq([
      {
        role: 'system',
        content: `You are a friendly local guide for ${placeName}. Give a helpful, concise answer in under 3 sentences.`,
      },
      {
        role: 'user',
        content: question,
      },
    ]);
    return content;
  } catch (error) {
    console.error('[askPlace] Error asking about place:', error);
    return "I'm having trouble retrieving that information right now!";
  }
};
