"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import { useChatMutation, ChatMessage } from "./services/mutations";

export default function ChatBotUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatMutation = useChatMutation();

  const handleSend = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const newMessages = [...messages, { content: inputValue, role: "user" }];
    setMessages(newMessages);

    setInputValue("")
    setMessages((prev) => [...prev, { content: "", role: "assistant" }]);
    chatMutation.mutate({
      payload: newMessages,
      onChunk: (text: any) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = { ...updated[lastIndex], content: updated[lastIndex].content + text };
          return updated;
        });
      }
    });
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
