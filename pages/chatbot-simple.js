import { useState } from 'react';

export default function SimpleChatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Smart Search chatbot. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: data }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please make sure your environment variables are configured correctly.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        flex: 1, 
        padding: '20px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: message.role === 'assistant' ? '#10b981' : '#3b82f6',
              alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
              maxWidth: '80%'
            }}
          >
            <strong>{message.role === 'assistant' ? '🤖 Assistant' : '👤 You'}:</strong>
            <div style={{ marginTop: '5px' }}>{message.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ 
            padding: '10px',
            backgroundColor: '#10b981',
            borderRadius: '8px',
            alignSelf: 'flex-start'
          }}>
            🤖 Thinking...
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} style={{ 
        padding: '20px',
        backgroundColor: '#374151',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about the content on this website..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#1f2937',
            color: 'white',
            fontSize: '16px'
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
