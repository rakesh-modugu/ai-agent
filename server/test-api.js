import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from './prompts/systemPrompt.js';
import fs from 'fs';
import path from 'path';

async function testAPI() {
  console.log("⏳ Testing Anthropic API connection...");
  try {
    const layoutPath = path.resolve('../client/src/data/initialLayout.json');
    const layout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("❌ No ANTHROPIC_API_KEY found in .env");
      return;
    }
    
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4000,
      system: buildSystemPrompt(layout),
      messages: [
        { role: "user", content: "Convert this design to 9:16" }
      ]
    });
    
    const responseText = response.content[0].text;
    
    // Extract JSON safely
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const cleanJson = responseText.slice(jsonStart, jsonEnd);
    
    const parsed = JSON.parse(cleanJson);
    
    console.log("✅ Connection Successful! Claude AI is working perfectly.");
    console.log("-------------------------------------------------");
    console.log("AI Explanation:", parsed.explanation);
    console.log("Updated Artboard Width:", parsed.updatedLayout.nodes[parsed.updatedLayout.rootNodes[0]].width);
    console.log("Updated Artboard Height:", parsed.updatedLayout.nodes[parsed.updatedLayout.rootNodes[0]].height);
    console.log("-------------------------------------------------");
  } catch (error) {
    console.error("❌ Test Failed. Error details:\n", error.message);
  }
}

testAPI();
