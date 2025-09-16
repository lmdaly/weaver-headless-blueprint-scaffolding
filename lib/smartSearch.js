/**
 * WP Engine Smart Search API wrapper
 * Based on the WP Engine Smart Search API documentation
 */

const SMART_SEARCH_URL = process.env.SMART_SEARCH_URL;
const SMART_SEARCH_ACCESS_TOKEN = process.env.SMART_SEARCH_ACCESS_TOKEN;

if (!SMART_SEARCH_URL || !SMART_SEARCH_ACCESS_TOKEN) {
  console.warn('WP Engine Smart Search not configured. Please set SMART_SEARCH_URL and SMART_SEARCH_ACCESS_TOKEN environment variables.');
}

/**
 * Search content using WP Engine Smart Search API
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @param {number} options.limit - Number of results to return (default: 10)
 * @param {number} options.offset - Offset for pagination (default: 0)
 * @param {string} options.filter - Optional filter for results
 * @param {Array} options.postTypes - Post types to search (default: ['post', 'page'])
 * @returns {Promise<Object>} Search results
 */
export async function searchContent(query, options = {}) {
  if (!SMART_SEARCH_URL || !SMART_SEARCH_ACCESS_TOKEN) {
    throw new Error('WP Engine Smart Search not configured');
  }

  const {
    limit = 10,
    offset = 0,
    filter = '',
    postTypes = ['post', 'page']
  } = options;

  try {
    // Build the filter for post types
    let finalFilter = postTypes.map(type => `post_type:${type}`).join(' OR ');
    if (filter) {
      finalFilter = `(${finalFilter}) AND ${filter}`;
    }

    const response = await fetch(SMART_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMART_SEARCH_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query SearchContent($query: String!, $limit: Int, $filter: String!) {
            find(
              query: $query
              limit: $limit
              filter: $filter
              semanticSearch: { searchBias: 10, fields: ["post_title", "post_content"] }
            ) {
              total
              documents {
                id
                score
                data
              }
            }
          }
        `,
        variables: {
          query,
          limit,
          filter: finalFilter
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Smart Search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${data.errors.map(e => e.message).join(', ')}`);
    }

    // Transform the response to match our expected format
    const documents = data.data?.find?.documents || [];
    const total = data.data?.find?.total || 0;

    const results = documents.map(doc => {
      // For headless WordPress with Faust.js, use the slug-based URLs
      // The [...wordpressNode].js should handle these routes
      let url;
      
      if (doc.data.post_name) {
        // Use the post slug for both posts and pages
        // This should be handled by [...wordpressNode].js
        url = `/${doc.data.post_name}/`;
      } else {
        // Fallback: if no slug, try using the post title as a slug
        const slugFromTitle = doc.data.post_title
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        url = slugFromTitle ? `/${slugFromTitle}/` : `/?p=${doc.data.ID}`;
      }

      return {
        id: doc.data.ID,
        title: doc.data.post_title,
        content: doc.data.post_content,
        excerpt: doc.data.post_excerpt || (doc.data.post_content ? doc.data.post_content.substring(0, 200) + '...' : ''),
        url: url,
        type: doc.data.post_type,
        date: doc.data.post_date,
        author: doc.data.post_author || '',
        categories: [],
        tags: [],
        featured_image: '',
        score: doc.score
      };
    });

    return {
      totalResults: total,
      results,
      facets: {
        type: [],
        categories: [],
        tags: []
      },
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit),
        hasNextPage: (offset + limit) < total,
        hasPreviousPage: offset > 0
      }
    };
  } catch (error) {
    console.error('Smart Search API error:', error);
    throw error;
  }
}

/**
 * Get search suggestions/autocomplete
 * @param {string} query - The partial search query
 * @param {number} limit - Number of suggestions to return
 * @returns {Promise<Array>} Array of suggestions
 */
export async function getSearchSuggestions(query, limit = 5) {
  if (!SMART_SEARCH_URL || !SMART_SEARCH_ACCESS_TOKEN) {
    throw new Error('WP Engine Smart Search not configured');
  }

  try {
    const response = await fetch(`${SMART_SEARCH_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMART_SEARCH_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query GetSuggestions($query: String!, $limit: Int) {
            suggestions(query: $query, limit: $limit) {
              text
              score
            }
          }
        `,
        variables: {
          query,
          limit
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Smart Search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${data.errors.map(e => e.message).join(', ')}`);
    }

    return data.data.suggestions || [];
  } catch (error) {
    console.error('Smart Search suggestions error:', error);
    throw error;
  }
}

/**
 * Fallback search using WordPress GraphQL when Smart Search is not available
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results in Smart Search format
 */
export async function fallbackSearch(query, options = {}) {
  const { limit = 10, offset = 0 } = options;
  
  // This would use your existing WordPress GraphQL endpoint
  const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  
  try {
    const response = await fetch(`${WORDPRESS_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query FallbackSearch($searchTerm: String!, $first: Int, $offset: Int) {
            posts(where: { search: $searchTerm, offsetPagination: { offset: $offset, size: $first } }) {
              pageInfo {
                offsetPagination {
                  total
                  hasMore
                }
              }
              nodes {
                id
                title
                uri
                excerpt
                date
                author {
                  node {
                    name
                  }
                }
                categories {
                  nodes {
                    name
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
              }
            }
            pages(where: { search: $searchTerm, offsetPagination: { offset: $offset, size: $first } }) {
              nodes {
                id
                title
                uri
                excerpt
                date
                author {
                  node {
                    name
                  }
                }
              }
            }
          }
        `,
        variables: {
          searchTerm: query,
          first: limit,
          offset
        }
      })
    });

    const data = await response.json();
    
    // Transform WordPress GraphQL response to Smart Search format
    const posts = data.data?.posts?.nodes || [];
    const pages = data.data?.pages?.nodes || [];
    const allResults = [...posts, ...pages];
    
    return {
      totalResults: data.data?.posts?.pageInfo?.offsetPagination?.total || allResults.length,
      results: allResults.map(item => ({
        id: item.id,
        title: item.title,
        content: item.excerpt,
        excerpt: item.excerpt,
        url: item.uri,
        type: posts.includes(item) ? 'post' : 'page',
        date: item.date,
        author: item.author?.node?.name || '',
        categories: item.categories?.nodes?.map(cat => cat.name) || [],
        tags: [],
        featured_image: item.featuredImage?.node?.sourceUrl || '',
        score: 1.0
      })),
      facets: {
        type: [],
        categories: [],
        tags: []
      },
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil((data.data?.posts?.pageInfo?.offsetPagination?.total || allResults.length) / limit),
        hasNextPage: data.data?.posts?.pageInfo?.offsetPagination?.hasMore || false,
        hasPreviousPage: offset > 0
      }
    };
  } catch (error) {
    console.error('Fallback search error:', error);
    throw error;
  }
}

/**
 * Main search function that tries Smart Search first, falls back to WordPress GraphQL
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
export async function performSearch(query, options = {}) {
  try {
    // Try Smart Search first
    if (SMART_SEARCH_URL && SMART_SEARCH_ACCESS_TOKEN) {
      return await searchContent(query, options);
    } else {
      // Fall back to WordPress GraphQL
      console.log('Using fallback WordPress GraphQL search');
      return await fallbackSearch(query, options);
    }
  } catch (error) {
    console.error('Smart Search failed, falling back to WordPress GraphQL:', error);
    // If Smart Search fails, try fallback
    return await fallbackSearch(query, options);
  }
}
