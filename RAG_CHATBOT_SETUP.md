# RAG Chatbot Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) chatbot using WP Engine's AI Toolkit and Google Gemini API.

## Prerequisites

1. **WP Engine Account** with Smart Search license
2. **Google Gemini API Key** (free tier available)
3. **WordPress site** with WP Engine Smart Search configured

## Environment Setup

1. Copy `.env.local.sample` to `.env.local`:
   ```bash
   cp .env.local.sample .env.local
   ```

2. Update your `.env.local` file with the following values:
   ```env
   # Your WordPress site URL
   NEXT_PUBLIC_WORDPRESS_URL=https://your-site.wpengine.com
   
   # WP Engine Smart Search API Configuration
   SMART_SEARCH_URL=https://your-smart-search-endpoint.wpengine.com
   SMART_SEARCH_ACCESS_TOKEN=your_access_token_here
   
   # Google Gemini API Configuration
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key_here
   ```

## Getting Your Smart Search Credentials

1. Navigate to your WordPress Admin
2. Go to `WP Engine Smart Search > Settings`
3. Copy your Smart Search URL and Access Token
4. In `Configuration`, select `Hybrid` and add `post_content` field in `Semantic settings`
5. Save configuration and go to `Index data` page
6. Click `Index Now` to index your content

## Getting Your Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/gemini-api/docs)
2. Create a new project or select existing one
3. Go to API Keys section
4. Generate a new API key
5. Copy the key to your `.env.local` file

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install @ai-sdk/google @ai-sdk/react ai openai-edge react-icons react-markdown zod
```

## Usage

### Standalone Chatbot Page

Visit `/chatbot` to access the full-page chatbot interface.

### WordPress Integration

To embed the chatbot on your WordPress site:

1. Add this to your theme's `functions.php`:
   ```php
   add_action('wp_enqueue_scripts', function () {
       wp_enqueue_script(
           'embed-chatbot',
           'http://localhost:3000/embed.js', // Replace with your Next.js app URL
           array(), null, true
       );
   });
   ```

2. The chatbot will appear as a floating chat icon on your WordPress site

## File Structure

```
├── lib/
│   ├── context.js          # Smart Search API integration
│   └── tools.js            # RAG tools for AI model
├── pages/
│   ├── api/
│   │   └── chat.js         # Chat API endpoint
│   └── chatbot.js          # Chatbot page
├── components/
│   ├── Chat.js             # Main chat component
│   ├── Messages.js         # Message display component
│   ├── ChatInput.js        # Input component
│   ├── LoadingIcon.js      # Loading indicator
│   └── SendIcon.js         # Send button icon
├── public/
│   ├── embed.js            # WordPress embed script
│   └── embed.css           # WordPress embed styles
└── styles/
    └── chatbot.module.css  # Chatbot styles
```

## Features

- **RAG Integration**: Uses WP Engine Smart Search for content retrieval
- **AI-Powered Responses**: Google Gemini generates contextual responses
- **Real-time Chat**: Streaming responses for better UX
- **WordPress Embeddable**: Easy integration with WordPress sites
- **Responsive Design**: Works on desktop and mobile
- **Semantic Search**: Finds relevant content using AI similarity matching

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/chatbot`

3. Test queries like:
   - "What content do you have about [topic]?"
   - "Tell me about [specific post/page]"
   - "What's the weather in Dublin?" (example weather tool)

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your Google Gemini API key is valid and has quota
2. **Smart Search Errors**: Verify your Smart Search URL and access token
3. **No Search Results**: Make sure your content is indexed in Smart Search
4. **CORS Issues**: Ensure your Next.js app is properly configured for your domain

### Debug Mode

Check the browser console and server logs for detailed error messages. The chat API logs token usage and search results.

## Customization

### Modify Search Behavior

Edit `lib/tools.js` to customize how the Smart Search tool works:
- Change search fields
- Modify result formatting
- Add additional tools

### Styling

Update `styles/chatbot.module.css` and `public/embed.css` to match your brand:
- Colors and themes
- Layout and sizing
- Animations and effects

### AI Model

In `pages/api/chat.js`, you can:
- Switch to different Gemini models
- Adjust system prompts
- Modify response behavior

## Production Deployment

1. Deploy your Next.js app to WP Engine Headless Platform or Vercel
2. Update the embed script URL in your WordPress `functions.php`
3. Ensure environment variables are set in production
4. Test the integration on your live WordPress site

## Support

For issues related to:
- **WP Engine Smart Search**: Contact WP Engine support
- **Google Gemini API**: Check Google AI documentation
- **Next.js/React**: Refer to Next.js documentation
