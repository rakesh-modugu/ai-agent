import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import { resizeArtboard, moveNode, scaleNode } from '../services/layoutTransforms.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { message, layout, history } = req.body;

    if (!message || !layout) {
      return res.status(400).json({ error: "Message and layout missing" });
    }

    let explanation = "";
    let updatedLayout = null;
    let success = false;

    // 1. Try OpenAI
    if (!success && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10) {
      try {
        console.log("Trying OpenAI...");
        let openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        let openaiHistory = [];
        if (history) {
          openaiHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          }));
        }

        let response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: buildSystemPrompt(layout) },
            ...openaiHistory,
            { role: "user", content: message }
          ],
          response_format: { type: "json_object" }
        });

        let data = JSON.parse(response.choices[0].message.content);
        updatedLayout = data.updatedLayout;
        explanation = data.explanation;
        success = true;
      } catch (err) {
        console.log("OpenAI failed: " + err.message);
      }
    }

    // 2. Try Gemini
    if (!success && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10) {
      try {
        console.log("Trying Gemini...");
        let genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        let model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: buildSystemPrompt(layout),
          generationConfig: { responseMimeType: "application/json" }
        });

        let geminiHistory = [];
        if (history) {
          geminiHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }));
        }

        let chat = model.startChat({ history: geminiHistory });
        let result = await chat.sendMessage([{ text: message }]);
        let data = JSON.parse(result.response.text());
        
        updatedLayout = data.updatedLayout;
        explanation = data.explanation;
        success = true;
      } catch (err) {
        console.log("Gemini failed: " + err.message);
      }
    }

    // 3. Try Anthropic
    if (!success && process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 10) {
      try {
        console.log("Trying Anthropic...");
        let anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        let claudeHistory = [];
        if (history) {
          claudeHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          }));
        }

        let response = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 4000,
          system: buildSystemPrompt(layout),
          messages: [...claudeHistory, { role: "user", content: message }]
        });

        let text = response.content[0].text;
        let start = text.indexOf('{');
        let end = text.lastIndexOf('}') + 1;
        let json = text.slice(start, end);
        let data = JSON.parse(json);

        updatedLayout = data.updatedLayout;
        explanation = data.explanation;
        success = true;
      } catch (err) {
        console.log("Anthropic failed: " + err.message);
      }
    }

    // 4. If all APIs fail, use Mock Mode
    if (!success) {
      console.log("All APIs failed. Using Mock AI Mode.");
      updatedLayout = JSON.parse(JSON.stringify(layout));
      explanation = "Layout modified (Mock Mode)";
      let msg = message.toLowerCase();
      
      if (msg.includes('9:16')) {
        updatedLayout = resizeArtboard(updatedLayout, 1080, 1920);
        explanation = "Converted design to 9:16";
      } 
      else if (msg.includes('large') || msg.includes('big')) {
        updatedLayout = scaleNode(updatedLayout, 'img_1778489515746_17', 1.2);
        explanation = "Made product large";
      } 
      else if (msg.includes('top')) {
        updatedLayout = moveNode(updatedLayout, 'text_1778486306230_8', 'top');
        explanation = "Moved headline to top";
      }
      else if (msg.includes('higher') || msg.includes('badge')) {
        updatedLayout = moveNode(updatedLayout, 'text_1778489078397_16', 'higher');
        updatedLayout = moveNode(updatedLayout, 'circle_1778488914968_15', 'higher');
        explanation = "Moved offer badge higher";
      }
      else if (msg.includes('smaller') || msg.includes('reduce')) {
        updatedLayout = scaleNode(updatedLayout, 'text_1778486306230_8', 0.8);
        explanation = "Made headline smaller";
      }
    }

    return res.json({ explanation, updatedLayout });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
