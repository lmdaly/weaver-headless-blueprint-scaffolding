import { performSearch, getSearchSuggestions } from '../../lib/smartSearch';

export default async function handler(req, res) {
  console.log('🔍 Search API called with:', req.query);
  console.log('🔧 Environment check:', {
    smartSearchUrl: !!process.env.SMART_SEARCH_URL,
    smartSearchToken: !!process.env.SMART_SEARCH_ACCESS_TOKEN,
    wordpressUrl: !!process.env.NEXT_PUBLIC_WORDPRESS_URL
  });
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q: query, limit = 10, offset = 0, type = 'search', filter = '' } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  console.log('🔍 Processing search for query:', query);

  try {
    let results;

    if (type === 'suggestions') {
      // Handle autocomplete/suggestions
      console.log('📝 Getting suggestions for:', query);
      results = await getSearchSuggestions(query, parseInt(limit));
      return res.status(200).json({ suggestions: results });
    } else {
      // Handle full search
      console.log('🔍 Performing full search for:', query);
      results = await performSearch(query, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        filter: filter || undefined
      });

      console.log('✅ Search results:', {
        totalResults: results.totalResults,
        resultsCount: results.results?.length,
        hasResults: results.results?.length > 0
      });
      
      return res.status(200).json(results);
    }
  } catch (error) {
    console.error('❌ Search API error:', error);
    return res.status(500).json({ 
      error: 'Search failed', 
      message: error.message,
      fallback: true,
      debug: {
        query,
        smartSearchConfigured: !!(process.env.SMART_SEARCH_URL && process.env.SMART_SEARCH_ACCESS_TOKEN),
        wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL
      }
    });
  }
}
