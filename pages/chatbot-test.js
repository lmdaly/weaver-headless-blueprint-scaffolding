export default function ChatbotTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chatbot Test Page</h1>
      <p>This is a simple test page to verify the chatbot route is working.</p>
      <p>If you can see this page, the basic routing is working.</p>
      
      <h2>Environment Check</h2>
      <p>Google API Key configured: {process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'Yes' : 'No'}</p>
      <p>Smart Search URL configured: {process.env.SMART_SEARCH_URL ? 'Yes' : 'No'}</p>
      <p>Smart Search Token configured: {process.env.SMART_SEARCH_ACCESS_TOKEN ? 'Yes' : 'No'}</p>
      
      <h2>Next Steps</h2>
      <ol>
        <li>Copy .env.local.sample to .env.local</li>
        <li>Add your Google Gemini API key</li>
        <li>Add your Smart Search credentials</li>
        <li>Restart the development server</li>
      </ol>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
