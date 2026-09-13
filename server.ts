import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// Lazy Google GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'EventPulse',
    tagline: 'Know where to go. Know what’s next. Stay safe.',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Gemini AI Assistant proxy endpoint
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { prompt, currentLocationId, userInterests, avoidStairs, savedSessionIds, zones, sessions } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful signal for client to use deterministic fallback
      res.status(503).json({
        fallback: true,
        message: 'Gemini API key not configured on server. Switching to deterministic event intelligence.',
      });
      return;
    }

    const systemInstruction = `You are "EventPulse AI", the dedicated smart assistant for FutureTech 2026.
Your purpose is to help attendees make fast, safe, accessible, and crowd-conscious decisions.
You are strictly grounded in the real event dataset provided below.
DO NOT invent fictional rooms, stages, or sessions.
Always highlight accessibility (step-free ramps, elevators, hearing loops) when relevant.
Always highlight crowd conditions (Low, Moderate, High, Capacity) to help attendees avoid overcrowding.

ATTENDEE CONTEXT:
- Current Location: ${currentLocationId || 'Main Entrance'}
- Interests: ${(userInterests || []).join(', ') || 'AI, Cloud'}
- Avoid Stairs preference: ${avoidStairs ? 'YES (STRICTLY STEP-FREE REQUIRED)' : 'NO'}
- Saved Sessions count: ${(savedSessionIds || []).length}

VENUE ZONES:
${JSON.stringify(zones || [])}

EVENT SESSIONS:
${JSON.stringify(sessions || [])}

Provide a concise, helpful answer (2-4 sentences) with direct guidance.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const answer = response.text || 'Here is the recommended event guidance.';
    res.json({ answer, source: 'gemini' });
  } catch (error: any) {
    console.error('Gemini proxy error:', error?.message || error);
    res.status(500).json({
      fallback: true,
      error: 'Gemini processing temporarily unavailable.',
      details: error?.message || String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventPulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
