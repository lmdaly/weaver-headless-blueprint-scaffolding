import { useState, useCallback } from "react";
import Link from "next/link";
import style from "../styles/search-bar.module.css";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const searchContent = useCallback(async (query) => {
    if (!query || query.length < 3) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Search failed');
      }
      
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      setIsOpen(true);
      searchContent(value);
    } else {
      setIsOpen(false);
      setData(null);
      setError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const allResults = data?.results || [];

  return (
    <div className={style.searchContainer}>
      <form onSubmit={handleSubmit} className={style.searchForm}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className={style.searchInput}
          aria-label="Search"
        />
        <button type="submit" className={style.searchButton} aria-label="Submit search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      {isOpen && (
        <div className={style.searchResults}>
          <div className={style.searchResultsHeader}>
            <span>Search Results</span>
            <button onClick={closeSearch} className={style.closeButton} aria-label="Close search">
              ×
            </button>
          </div>
          
          {loading && (
            <div className={style.searchLoading}>
              <div className={style.spinner}></div>
              <span>Searching...</span>
            </div>
          )}
          
          {error && (
            <div className={style.searchError}>
              Error searching content. Please try again.
            </div>
          )}
          
          {data && !loading && (
            <div className={style.searchResultsList}>
              {allResults.length > 0 ? (
                <>
                  {allResults.map((item) => (
                    <Link key={item.id} href={item.url} className={style.searchResultItem} onClick={closeSearch}>
                      <div className={style.searchResultTitle}>{item.title}</div>
                      {item.excerpt && (
                        <div 
                          className={style.searchResultExcerpt}
                          dangerouslySetInnerHTML={{ __html: item.excerpt }}
                        />
                      )}
                      <div className={style.searchResultMeta}>
                        {item.type && (
                          <span className={style.searchResultType}>{item.type}</span>
                        )}
                        {item.date && (
                          <span className={style.searchResultDate}>
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        )}
                        {item.author && (
                          <span className={style.searchResultAuthor}>by {item.author}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                  {searchTerm && (
                    <Link 
                      href={`/search?q=${encodeURIComponent(searchTerm)}`} 
                      className={style.viewAllResults}
                      onClick={closeSearch}
                    >
                      View all results for "{searchTerm}"
                    </Link>
                  )}
                </>
              ) : (
                <div className={style.noResults}>
                  No results found for "{searchTerm}"
                  {data?.totalResults !== undefined && (
                    <div className={style.totalResults}>
                      Total results: {data.totalResults}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {isOpen && <div className={style.searchOverlay} onClick={closeSearch}></div>}
    </div>
  );
}
