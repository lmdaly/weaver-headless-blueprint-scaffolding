import SendIcon from "./SendIcon";

function ChatInput({ input, handleInputChange }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder={"Ask Smart Search about your content..."}
        className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none text-md mb-3"
      />
      <div className="flex">
        <button
          type="submit"
          className="p-1 hover:bg-gray-700 rounded-md transition-colors ml-auto"
          aria-label="Send message"
          disabled={!input.trim()}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
