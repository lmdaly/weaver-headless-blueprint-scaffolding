# WP Engine Smart Search Integration

This project includes a complete search implementation that integrates with WP Engine Smart Search API, with automatic fallback to WordPress GraphQL when Smart Search is not configured.

## Features

- **Real-time search suggestions** - Instant results as you type
- **Full search results page** - Comprehensive search with pagination
- **Smart Search integration** - Enhanced search with AI-powered features when configured
- **Automatic fallback** - Uses WordPress GraphQL when Smart Search is unavailable
- **Mobile responsive** - Works seamlessly on all devices
- **Accessibility** - Proper ARIA labels and keyboard navigation

## Setup Instructions

### 1. WP Engine Smart Search Configuration

#### Prerequisites
- WP Engine Smart Search license (available for Premium and Headless Platform plans)
- WordPress site with WPGraphQL plugin installed
- WP Engine AI Toolkit plugin (automatically installed with Smart Search license)

#### Enable Smart Search
1. Log into your [WP Engine User Portal](https://my.wpengine.com)
2. Go to **Products** → **Smart Search**
3. Click **Select environments** and choose your environment
4. Click **Add environment** and **Confirm**

#### WordPress Setup
1. In WordPress Admin, go to **WP Engine AI Toolkit** → **Smart Search**
2. Click **Index Now** to perform the initial content sync
3. Configure search settings in the **Configuration** tab:
   - Choose search type: Full Text, Semantic, or Hybrid (AI Powered)
   - Configure field weights and post types
   - Set up search preferences

#### Get API Credentials
1. In your WP Engine User Portal, navigate to your Smart Search settings
2. Copy your Smart Search API URL and Access Token
3. These will be used in your environment variables

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Your WordPress site URL
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.wpengine.com

# Plugin secret found in WordPress Settings->Headless
FAUST_SECRET_KEY=your_plugin_secret

# The URL of your site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WP Engine Smart Search API Configuration
SMART_SEARCH_URL=https://your-smart-search-endpoint.wpengine.com
SMART_SEARCH_ACCESS_TOKEN=your_access_token_here
```

### 3. Installation

The search functionality is already integrated into your project. The components include:

- `components/SearchBar.js` - Real-time search component
- `pages/search.js` - Full search results page
- `pages/api/search.js` - API endpoint for search requests
- `lib/smartSearch.js` - Smart Search API wrapper with fallback
- `styles/search-bar.module.css` - Search component styles

### 4. How It Works

#### With Smart Search Configured
When `SMART_SEARCH_URL` and `SMART_SEARCH_ACCESS_TOKEN` are set:
- Uses WP Engine Smart Search API for enhanced results
- Provides AI-powered semantic search
- Includes typo tolerance and fuzzy matching
- Returns relevance scores and advanced faceting

#### Fallback Mode
When Smart Search is not configured:
- Automatically falls back to WordPress GraphQL
- Uses standard WordPress search functionality
- Still provides good search results
- Shows a notice that enhanced search is available

#### Search Features
- **Instant search**: Results appear as you type (after 3 characters)
- **Full search page**: Comprehensive results with pagination
- **Result metadata**: Shows post type, author, date, categories
- **Relevance scoring**: When using Smart Search
- **Error handling**: Graceful fallback and error messages

## API Endpoints

### `/api/search`

Search for content using Smart Search or WordPress GraphQL fallback.

**Parameters:**
- `q` (required) - Search query
- `limit` (optional) - Number of results (default: 10)
- `offset` (optional) - Pagination offset (default: 0)
- `filter` (optional) - Additional filters
- `type` (optional) - Set to "suggestions" for autocomplete

**Example:**
```
GET /api/search?q=wordpress&limit=5
```

## Customization

### Search Configuration
Modify `lib/smartSearch.js` to:
- Adjust GraphQL queries
- Change result formatting
- Add custom post types
- Modify fallback behavior

### Styling
Update `styles/search-bar.module.css` to:
- Change search bar appearance
- Modify dropdown styling
- Adjust responsive breakpoints
- Customize result layout

### Components
Customize `components/SearchBar.js` to:
- Add search filters
- Modify search behavior
- Change result display
- Add additional features

## Troubleshooting

### Smart Search Not Working
1. Verify environment variables are set correctly
2. Check that Smart Search license is active
3. Ensure initial content sync is complete
4. Verify API credentials are valid

### Fallback Search Issues
1. Check WordPress GraphQL endpoint is accessible
2. Verify WPGraphQL plugin is installed and active
3. Ensure WordPress site URL is correct

### No Results
1. Check if content has been indexed
2. Verify search terms match content
3. Try different search configurations in WordPress
4. Check for plugin conflicts

## Advanced Configuration

### Custom Post Types
To search custom post types, update the GraphQL queries in `lib/smartSearch.js` and ensure they're enabled in your Smart Search configuration.

### Search Filters
Add faceted search by modifying the API to accept filter parameters and updating the frontend components.

### Analytics
Integrate with WP Engine Smart Search Insights to track search performance and user behavior.

## Support

For issues with:
- **WP Engine Smart Search**: Contact WP Engine support
- **WordPress GraphQL**: Check WPGraphQL documentation
- **This implementation**: Review the code and documentation

## Resources

- [WP Engine Smart Search Documentation](https://wpengine.com/support/wp-engine-smart-search/)
- [WP Engine Headless Platform](https://wpengine.com/headless-wordpress/)
- [WPGraphQL Documentation](https://www.wpgraphql.com/)
- [Setup Video Tutorial](https://www.youtube.com/watch?v=Gc1WFvp9ezk)
