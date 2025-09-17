import { streamText, convertToCoreMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { smartSearchTool, weatherTool } from "../../lib/tools.js";

const google = createGoogleGenerativeAI();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const result = await streamText({
      model: google("models/gemini-2.0-flash"),
      system: `You are a friendly and helpful AI assistant. You can use the smartSearchTool to find information about content on this website. When users ask questions, search for relevant information and provide helpful responses based on what you find.`,
      messages: convertToCoreMessages(messages),
      tools: {
        smartSearchTool,
        weatherTool,
      },
      maxSteps: 5,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
