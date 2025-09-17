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

// GraphQL query to get the page set as homepage in WordPress Reading Settings
const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent($pageOnFront: Int) {
    generalSettings {
      title
      description
      pageOnFront
      showOnFront
    }
    pageBy(id: $pageOnFront, idType: DATABASE_ID) {
      id
      title
      content
      slug
      featuredImage {
        node {
          sourceUrl
          altText
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
  
  // First get the general settings to know which page is set as homepage
  const generalSettings = siteDataQuery?.data?.generalSettings || {};
  const { showOnFront, pageOnFront } = generalSettings;
  
  // Then query for the homepage content if a static page is set
  const homepageDataQuery = useQuery(GET_HOMEPAGE_CONTENT, {
    variables: { pageOnFront: pageOnFront },
    skip: showOnFront !== 'page' || !pageOnFront
  }) || {};

  const siteData = siteDataQuery?.data?.generalSettings || {};
  const menuItems = headerMenuDataQuery?.data?.primaryMenuItems?.nodes || {
    nodes: [],
  };
  const homepagePage = homepageDataQuery?.data?.pageBy || {};
  
  const { title: siteTitle, description: siteDescription } = siteData;
  const { title: pageTitle, content: pageContent, featuredImage } = homepagePage;

  // Check if WordPress is set to show a static page as homepage
  const isStaticHomepage = showOnFront === 'page' && pageOnFront && pageContent;

  return (
    <>
      <Head>
        <title>{isStaticHomepage && pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle}</title>
      </Head>

      <Header
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        menuItems={menuItems}
      />

      <main className="container">
        {isStaticHomepage ? (
          // Display the WordPress page set as homepage
          <>
            <EntryHeader title={pageTitle} />
            
            {/* Display featured image if it exists */}
            {featuredImage?.node?.sourceUrl && (
              <div className={style.featuredImage}>
                <img 
                  src={featuredImage.node.sourceUrl} 
                  alt={featuredImage.node.altText || pageTitle}
                  style={{ width: '100%', height: 'auto', marginBottom: '2rem' }}
                />
              </div>
            )}

            {/* Display the page content */}
            <section 
              className={style.pageContent}
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </>
        ) : (
          // Default content when no static homepage is set
          <>
            <EntryHeader title="Welcome to the Faust Scaffold Blueprint" />

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
];
