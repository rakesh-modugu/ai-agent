# Engineering Approach: Chat-Based Layout Agent

## 1. System Prompt & LLM Strategy
I structured the `systemPrompt.js` to explicitly define the difference between normalized coordinates (`nx`, `ny`, `nw`, `nh`) and absolute dimensions (`x`, `y`, `width`, `height`). To prevent JSON syntax errors and trailing commas, I enforced strict `application/json` mode using the Gemini 1.5 Flash API `responseMimeType` parameter. This guarantees the frontend never crashes due to a stringified Markdown code block.

## 2. Deterministic Layout Math
While LLMs are great at reasoning, they often hallucinate floating-point math. I introduced `layoutTransforms.js` as a backend math toolkit. 
When the LLM receives an instruction like "Convert to 9:16", the system prompt explicitly trains the model on how to compute offsets. In a large scale production environment, these math helpers would be converted into native LLM Tool Calls (Function Calling), completely abstracting the math away from the text model to achieve 100% stable outputs.

## 3. History Buffer & Multi-Turn Context
To support contextual follow-up queries (e.g. "make it smaller" -> where "it" refers to the previously modified headline), the React client retains an array of messages. It slices the last 6 messages (`messages.slice(-6)`) and sends them in the POST request. The Express server dynamically formats this array into the required `history` object, giving the LLM short-term memory over the current active session.

## 4. Scalable Frontend Architecture (Fidelity-First)
Rather than a basic HTML page, I implemented a robust 3-pane React dashboard:
- **Left Panel (Chat)**: Includes typing indicators, automatic auto-scroll to bottom, and click-to-run prompt suggestions.
- **Center Panel (Wireframe Canvas)**: Uses CSS `aspect-ratio` bounds and absolute percentage-offsets (`left: nx * 100%`) instead of hardcoded pixels. This allows the canvas to naturally reflow and resize gracefully inside any browser viewport size. CSS transitions ensure the layout animations look magical.
- **Right Panel (Debugger)**: A real-time JSON inspector with copy-to-clipboard controls to verify the LLM mutations instantly.
