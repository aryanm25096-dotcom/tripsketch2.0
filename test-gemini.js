import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAyPXs-CTpbH3KDwPUxL8Pycn2IehTwtj8';
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  console.log('=== Full error diagnosis ===\n');
  
  // First check what models are available
  console.log('1) Listing available models...');
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    if (data.error) {
      console.log('LIST ERROR:', JSON.stringify(data.error, null, 2));
    } else {
      const names = data.models.map(m => m.name);
      console.log('Available models:', names.join(', '));
    }
  } catch(e) {
    console.log('Fetch error:', e.message);
  }

  console.log('\n2) Testing gemini-2.0-flash with full error...');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent("Say hello");
    console.log('SUCCESS:', result.response.text());
  } catch(e) {
    console.log('FULL ERROR:', e.message);
  }
}
run();
