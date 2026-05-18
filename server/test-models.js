import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  console.log("Testing models...");
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro'
  ];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Simple test
      await model.generateContent("hello");
      console.log(`✅ ${modelName} SUCCEEDED`);
    } catch (e) {
      console.log(`❌ ${modelName} FAILED: ${e.message.substring(0, 100)}...`);
    }
  }
}

testModels();
