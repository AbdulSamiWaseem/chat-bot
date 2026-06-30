"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";

export default function ChatBotUI() {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: "Hello", role: "assistant" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    setMessages([...messages, { id: messages.length + 1, text: inputValue, role: "user" }]);
    setInputValue("");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", justifyContent: "space-between" }}>
        <Chat messages={messages} />
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleSend}
        />
      </Box>
    </Box>
  );
}
