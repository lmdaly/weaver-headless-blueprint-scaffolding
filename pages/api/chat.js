import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { performSearch } from "../../lib/smartSearch.js";

/**
 * Initialize the Google Generative AI API
 */
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log('User query:', userQuery);

    // Get context from Smart Search (using semantic similarity search)
    let searchContext = '';
    try {
      const searchResults = await performSearch(userQuery, {
        limit: 5,
        offset: 0
      });
      
      if (searchResults.results?.length > 0) {
        searchContext = searchResults.results.map(result => 
          `Title: ${result.title}\nContent: ${result.content?.substring(0, 500)}...\nScore: ${result.score}`
        ).join('\n\n');
        console.log('Found search context:', searchResults.results.length, 'documents');
      } else {
        console.log('No search results found');
      }
    } catch (searchError) {
      console.error('Search error:', searchError);
    }

    // Create conversation history
    const conversationHistory = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Generate response with Gemini
    const prompt = `You are a helpful AI assistant for a website. You can search for information about the website's content.

${searchContext ? `Here is relevant information from the website about "${userQuery}":\n\n${searchContext}\n\n` : ''}

Conversation history:
${conversationHistory}

Please provide a helpful response based on the available information. If you found relevant content above, use it to answer the user's question. If no relevant content was found, let the user know and provide general assistance.`;

    const result = await generateText({
      model: google("models/gemini-2.0-flash"),
      prompt: prompt,
      maxTokens: 1000,
    });

    console.log('Generated response successfully');

    return res.status(200).json({
      response: result.text,
      usage: result.usage
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}
