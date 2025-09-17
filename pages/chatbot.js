"use client";
import Chat from "../components/Chat";
import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";

const ChatbotPage = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    status,
  } = useChat();

  useEffect(() => {
    if (messages.length < 1) {
      setMessages([
        {
          role: "assistant",
          content: "Welcome to the Smart Search chatbot! Ask me anything about the content on this website.",
          id: "welcome",
        },
      ]);
    }
  }, [messages, setMessages]);

  return (
    <div className="flex flex-col justify-between h-screen bg-white mx-auto max-w-full">
      <div className="flex w-full flex-grow overflow-hidden relative bg-slate-950">
        <Chat
          input={input}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleSubmit}
          messages={messages}
          status={status}
        />
      </div>
    </div>
  );
};

export default ChatbotPage;
