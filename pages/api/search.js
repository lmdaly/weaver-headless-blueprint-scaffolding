import { performSearch, getSearchSuggestions } from '../../lib/smartSearch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q: query, limit = 10, offset = 0, type = 'search', filter = '' } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    let results;

    if (type === 'suggestions') {
      // Handle autocomplete/suggestions
      results = await getSearchSuggestions(query, parseInt(limit));
      return res.status(200).json({ suggestions: results });
    } else {
      // Handle full search
      results = await performSearch(query, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        filter: filter || undefined
      });

      return res.status(200).json(results);
    }
  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({ 
      error: 'Search failed', 
      message: error.message,
      fallback: true 
    });
  }
}
