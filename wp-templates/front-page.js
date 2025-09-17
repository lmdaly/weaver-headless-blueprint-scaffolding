import Head from "next/head";
import Link from "next/link";
import Header from "../components/header";
import EntryHeader from "../components/EntryHeader";
import Footer from "../components/footer";
import style from "../styles/front-page.module.css";
import { SITE_DATA_QUERY } from "../queries/SiteSettingsQuery";
import { HEADER_MENU_QUERY } from "../queries/MenuQueries";
import { useQuery, gql } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";
import { useState } from "react";

// GraphQL query to get a random post for the homepage
const GET_RANDOM_POST = gql`
  query GetRandomPost {
    posts(first: 1, where: { orderby: { field: RAND, order: DESC } }) {
      nodes {
        id
        title
        content
        excerpt
        date
        slug
        uri
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export default function FrontPage(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);

  const siteDataQuery = useQuery(SITE_DATA_QUERY) || {};
  const headerMenuDataQuery = useQuery(HEADER_MENU_QUERY) || {};
  const randomPostQuery = useQuery(GET_RANDOM_POST) || {};

  const siteData = siteDataQuery?.data?.generalSettings || {};
  const menuItems = headerMenuDataQuery?.data?.primaryMenuItems?.nodes || {
    nodes: [],
  };
  const randomPost = randomPostQuery?.data?.posts?.nodes?.[0] || null;
  
  const { title: siteTitle, description: siteDescription } = siteData;

  // Check if we have a random post to display
  const hasRandomPost = randomPost && randomPost.title && randomPost.content;

  return (
    <>
      <Head>
        <title>{hasRandomPost ? `${randomPost.title} - ${siteTitle}` : siteTitle}</title>
      </Head>

      <Header
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        menuItems={menuItems}
      />

      <main className="container">
        {hasRandomPost ? (
          // Display the random post
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <span style={{ 
                background: '#e3f2fd', 
                color: '#1976d2', 
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                🎲 Random Post
              </span>
            </div>
            
            <EntryHeader 
              title={randomPost.title} 
              date={randomPost.date}
              author={randomPost.author?.node?.name}
            />
            
            {/* Display featured image if it exists */}
            {randomPost.featuredImage?.node?.sourceUrl && (
              <div className={style.featuredImage}>
                <img 
                  src={randomPost.featuredImage.node.sourceUrl} 
                  alt={randomPost.featuredImage.node.altText || randomPost.title}
                  style={{ width: '100%', height: 'auto', marginBottom: '2rem' }}
                />
              </div>
            )}

            {/* Display post metadata */}
            <div style={{ marginBottom: '2rem', fontSize: '14px', color: '#666' }}>
              {randomPost.categories?.nodes?.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Categories:</strong>{' '}
                  {randomPost.categories.nodes.map((category, index) => (
                    <span key={category.slug}>
                      {category.name}
                      {index < randomPost.categories.nodes.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {randomPost.tags?.nodes?.length > 0 && (
                <div>
                  <strong>Tags:</strong>{' '}
                  {randomPost.tags.nodes.map((tag, index) => (
                    <span key={tag.slug}>
                      {tag.name}
                      {index < randomPost.tags.nodes.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Display the post content */}
            <section 
              className={style.pageContent}
              dangerouslySetInnerHTML={{ __html: randomPost.content }}
            />

            {/* Link to view the full post */}
            <div style={{ 
              marginTop: '3rem', 
              padding: '2rem', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <Link 
                href={randomPost.uri}
                style={{
                  display: 'inline-block',
                  background: '#007cba',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                View Full Post →
              </Link>
              <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
                Refresh the page to see another random post!
              </p>
            </div>
          </>
        ) : (
          // Fallback content when no posts are available
          <>
            <EntryHeader title="Welcome to Your Headless WordPress Site" />

            <section className={style.cardGrid}>
              <Link
                href="https://faustjs.org/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className={style.card}
              >
                <h3>Documentation →</h3>
                <p>
                  Learn more about Faust.js through tutorials, guides and reference
                  in our documentation.
                </p>
              </Link>

              <Link
                href="https://my.wpengine.com/atlas#/create/blueprint"
                target="_blank"
                rel="noopener noreferrer"
                className={style.card}
              >
                <h3>Blueprints →</h3>
                <p>Explore production ready Faust.js starter kits.</p>
              </Link>

              <Link
                href="https://wpengine.com/headless-wordpress/"
                target="_blank"
                rel="noopener noreferrer"
                className={style.card}
              >
                <h3>Deploy →</h3>
                <p>
                  Deploy your Faust.js app to Headless Platform along with your
                  WordPress instance.
                </p>
              </Link>

              <Link
                href="https://github.com/wpengine/faustjs"
                target="_blank"
                rel="noopener noreferrer"
                className={style.card}
              >
                <h3>Contribute →</h3>
                <p>Visit us on GitHub to explore how you can contribute!</p>
              </Link>
            </section>

            <section className={style.information}>
              <h1>Getting Started 🚀</h1>
              <p>
                To get started on WP Engine's Platform please follow the docs here{" "}
                <Link
                  href="https://developers.wpengine.com/docs/atlas/getting-started/create-app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://developers.wpengine.com/docs/atlas/getting-started/create-app/
                </Link>
              </p>

              <div className={style.homepageNote}>
                <h3>💡 Dynamic Homepage</h3>
                <p>
                  To display a custom page as your homepage:
                </p>
                <ol>
                  <li>Go to your WordPress Admin → Settings → Reading</li>
                  <li>Select "A static page" for "Your homepage displays"</li>
                  <li>Choose the page you want as your homepage</li>
                  <li>Save changes</li>
                </ol>
                <p>Your headless frontend will automatically display that page content!</p>
              </div>

              <h2>Our Community 🩵</h2>
              <p>
                At WP Engine, we have a strong community built around headless
                WordPress to support you with your journey.
              </p>
              <ul>
                <li>
                  <Link
                    href="https://faustjs.org/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord Headless Community Channel
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.gg/headless-wordpress-836253505944813629?event=1371472220592930857"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fortnightly Headless Community Call
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://wpengine.com/builders/headless"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WP Engine's Headless Platform developer community
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.youtube.com/@WPEngineBuilders"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WP Engine`s Builders YouTube Channel
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://wpengine.com/headless-wordpress/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WP Engine's Headless Platform
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://developers.wpengine.com/docs/atlas/overview/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WP Engines Headless Platform Docs
                  </Link>
                </li>
              </ul>

              <h2>Plugin Ecosystem 🪄</h2>
              <ul>
                <li>
                  <Link
                    href="https://faustjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Faust.js
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.wpgraphql.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WPGraphQL
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/wpengine/wp-graphql-content-blocks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WPGraphQL Content Blocks
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/wp-graphql/wpgraphql-ide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WPGraphQL IDE
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/wpengine/hwptoolkit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    HWP Toolkit
                  </Link>
                </li>
              </ul>

              <h2>Documentation 🔎</h2>
              <ul>
                <li>
                  <Link
                    href="https://faustjs.org/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Faust.js Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://developers.wpengine.com/docs/atlas/overview/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Headless Platform Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.wpgraphql.com/docs/introduction"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WPGraphQL Documentation
                  </Link>
                </li>
              </ul>
            </section>
          </>
        )}
      </main>

      {/* Floating Chatbot Widget */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '400px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            backgroundColor: '#0f172a',
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>💬 Smart Search Chat</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ×
            </button>
          </div>
          
          {/* Chat Iframe */}
          <iframe
            src="/chatbot"
            style={{
              flex: 1,
              border: 'none',
              width: '100%'
            }}
            title="Smart Search Chatbot"
          />
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.backgroundColor = '#2563eb';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.backgroundColor = '#3b82f6';
        }}
      >
        {isChatOpen ? '×' : '💬'}
      </button>

      <Footer />
    </>
  );
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: FrontPage,
    revalidate: 60,
  });
}

FrontPage.queries = [
  {
    query: SITE_DATA_QUERY,
  },
  {
    query: HEADER_MENU_QUERY,
  },
  {
    query: GET_RANDOM_POST,
  },
];
