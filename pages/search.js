import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { getNextStaticProps } from "@faustwp/core";

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [siteData, setSiteData] = useState(null);

  useEffect(() => {
    if (q) {
      setSearchTerm(q);
      performSearch(q);
    }
  }, [q]);

  const performSearch = async (query, offset = 0) => {
    if (!query) return;
    
    console.log('performSearch called with:', query, 'offset:', offset);
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/search?q=${encodeURIComponent(query)}&limit=10&offset=${offset}`;
      console.log('Fetching:', url);
      
      const response = await fetch(url);
      const result = await response.json();
      
      console.log('Search response:', response.status, result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Search failed');
      }
      
      if (offset === 0) {
        setData(result);
      } else {
        // Append results for pagination
        setData(prev => ({
          ...result,
          results: [...(prev?.results || []), ...result.results]
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (data?.results && searchTerm) {
      performSearch(searchTerm, data.results.length);
    }
  };

  if (!searchTerm) {
    return (
      <div>
        <Header 
          siteTitle="Search" 
          siteDescription="Search results" 
          menuItems={[]} 
        />
        <main className="container">
          <h1>Search</h1>
          <p>Please enter a search term.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div>
        <Header 
          siteTitle="Search" 
          siteDescription="Search results" 
          menuItems={[]} 
        />
        <main className="container">
          <h1>Searching...</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e9ecef',
              borderTop: '2px solid #007cba',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Searching for "{searchTerm}"...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header 
          siteTitle="Search" 
          siteDescription="Search results" 
          menuItems={[]} 
        />
        <main className="container">
          <h1>Search Error</h1>
          <p>There was an error performing your search. Please try again.</p>
          <p>Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const allResults = data?.results || [];
  const totalResults = data?.totalResults || 0;
  const hasNextPage = data?.pagination?.hasNextPage || false;

  return (
    <div>
      <Header 
        siteTitle="Search Results" 
        siteDescription="Search results" 
        menuItems={[]} 
      />
      <main className="container">
        <h1>Search Results</h1>
        <p>
          {totalResults > 0 
            ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${searchTerm}"`
            : `No results found for "${searchTerm}"`
          }
        </p>

        {data?.fallback && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            color: '#856404'
          }}>
            <strong>Note:</strong> Using fallback search. For enhanced results, configure WP Engine Smart Search.
          </div>
        )}

        {totalResults > 0 && (
          <div style={{ marginTop: '2rem' }}>
            {allResults.map((item) => (
              <article key={item.id} style={{ 
                marginBottom: '2rem', 
                paddingBottom: '2rem', 
                borderBottom: '1px solid #e9ecef' 
              }}>
                <h2 style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    href={item.url} 
                    style={{ 
                      color: '#007cba', 
                      textDecoration: 'none',
                      fontSize: '1.5rem'
                    }}
                  >
                    {item.title}
                  </Link>
                </h2>
                
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#6c757d', 
                  marginBottom: '0.5rem' 
                }}>
                  {item.type && (
                    <span style={{ 
                      background: '#e9ecef', 
                      padding: '2px 6px', 
                      borderRadius: '3px', 
                      fontSize: '0.8rem',
                      marginRight: '8px'
                    }}>
                      {item.type}
                    </span>
                  )}
                  {item.author && (
                    <span>By {item.author} • </span>
                  )}
                  {item.date && (
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  )}
                  {item.categories?.length > 0 && (
                    <span> • Categories: {item.categories.join(', ')}</span>
                  )}
                  {item.score && (
                    <span style={{ marginLeft: '8px', color: '#28a745' }}>
                      Score: {(item.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                {item.excerpt && (
                  <div 
                    style={{ 
                      color: '#495057', 
                      lineHeight: '1.6' 
                    }}
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                )}
              </article>
            ))}

            {hasNextPage && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  style={{
                    background: loading ? '#6c757d' : '#007cba',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {loading ? 'Loading...' : 'Load More Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {totalResults === 0 && data && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Search Tips:</h3>
            <ul>
              <li>Check your spelling</li>
              <li>Try different keywords</li>
              <li>Use more general terms</li>
              <li>Try using fewer words</li>
            </ul>
          </div>
        )}
      </main>
      <Footer />
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Remove getStaticProps to make this a dynamic page
// Search pages should not be statically generated
