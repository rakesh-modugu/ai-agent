# Chat-Based Layout Agent

Hi! This is my assignment project for the AI Engineer role. It's a web app where you can type commands in a chat to change a design canvas layout automatically.

I built this using React (Vite) for the frontend and Node.js (Express) for the backend. I also added support for Anthropic, OpenAI, and Gemini APIs.

## Features I Implemented
As requested in the assignment, here are the main things you can do in the chat:
1. **Change aspect ratio**: Try typing "Convert this design to 9:16".
2. **Make elements bigger**: Try typing "Keep the product large".
3. **Move elements**: Try typing "Move the headline to the top" or "Move the offer badge higher".
4. **Make elements smaller**: Try typing "Make the headline smaller".

The app will update the layout on the screen and also show the updated JSON data in real-time.

## How it works
I separated the logic into two parts:
- **LLM Reasoning**: I used AI to understand what the user wants to do (like which element they want to move).
- **Code Math**: The actual resizing and moving math is done by standard JavaScript functions (`layoutTransforms.js`). I didn't rely on the AI to do the math because it can hallucinate numbers. 

**Note on API Keys:** If the API keys run out of balance or fail during testing, don't worry! I added a "Mock AI Mode" as a fallback. So the test commands listed above will still work perfectly even without an active API key.

## Setup Instructions

If you want to run it on your own computer:

1. **Clone the repo**
   ```bash
   git clone https://github.com/rakesh-modugu/ai-agent.git
   cd ai-agent
   ```

2. **Start the Backend**
   ```bash
   cd server
   npm install
   npm start
   ```
   (The server will run on port 3001)

3. **Start the Frontend**
   Open a new terminal and run:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   (This will open the React app on localhost)

4. **Environment Variables (Optional)**
   If you want to use real AI instead of the Mock mode, create a `.env` file in the `server` folder and add any of these keys:
   `OPENAI_API_KEY=your_key_here`
   `GEMINI_API_KEY=your_key_here`
   `ANTHROPIC_API_KEY=your_key_here`

Hope you like my project! Let me know if you have any questions.
