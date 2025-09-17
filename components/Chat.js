"use client";

import React from "react";
import Messages from "./Messages";
import LoadingIcon from "./LoadingIcon";
import ChatInput from "./ChatInput";

const Chat = ({
  input,
  handleInputChange,
  handleMessageSubmit,
  messages,
  status,
}) => {
  return (
    <div id="chat" className="flex flex-col w-full mx-2">
      <Messages messages={messages} />
      {status === "submitted" && <LoadingIcon />}
      <form
        onSubmit={handleMessageSubmit}
        className="ml-1 mt-5 mb-5 relative rounded-lg"
      >
        <ChatInput input={input} handleInputChange={handleInputChange} />
      </form>
    </div>
  );
};

export default Chat;
