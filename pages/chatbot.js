import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to the Smart Search chatbot!' }
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
        content: 'Sorry, I encountered an error. Please check the console for details.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-white mx-auto max-w-full">
      <div className="flex w-full flex-grow overflow-hidden relative bg-slate-950">
        <div id="chat" className="flex flex-col w-full mx-2">
          <div className="border-1 border-gray-100 overflow-y-scroll flex-grow flex-col justify-end p-1" style={{ scrollbarWidth: "none" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.role === "assistant" ? "bg-green-500" : "bg-blue-500"
                } my-2 p-3 shadow-md hover:shadow-lg transition-shadow duration-200 flex slide-in-bottom bg-blue-500 border border-gray-900 message-glow`}
              >
                <div className="ml- rounded-tl-lg  p-2 border-r flex items-center">
                  {msg.role === "assistant" ? "🤖" : "🧒🏻"}
                </div>
                <div className="ml-2 text-white">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Thinking...</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="ml-1 mt-5 mb-5 relative rounded-lg">
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Smart Search about your content..."
                className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none text-md mb-3"
                disabled={loading}
              />
              <div className="flex">
                <button
                  type="submit"
                  className="p-1 hover:bg-gray-700 rounded-md transition-colors ml-auto"
                  aria-label="Send message"
                  disabled={!input.trim() || loading}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <path
                      d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
