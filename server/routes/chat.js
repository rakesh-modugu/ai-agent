import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import { resizeArtboard, moveNode, scaleNode } from '../services/layoutTransforms.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { message, layout, history } = req.body;

    if (!message || !layout) {
      return res.status(400).json({ error: "Message and layout missing" });
    }

    try {
      let apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey && apiKey.length > 10 && !apiKey.includes('your_anthropic')) {
        let anthropic = new Anthropic({ apiKey });
        
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

        return res.json({
          explanation: data.explanation,
          updatedLayout: data.updatedLayout
        });
      }
    } catch (err) {
      console.log("api failed, using mock mode");
    }

    // mock mode
    let updatedLayout = JSON.parse(JSON.stringify(layout));
    let explanation = "Layout modified";
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

    res.json({ explanation, updatedLayout });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
