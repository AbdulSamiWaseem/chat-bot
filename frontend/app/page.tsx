"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import { useChatMutation, ChatMessage } from "./services/mutations";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useChatData } from "./services/queries";
import { authClient } from "./services/auth-client";

export default function ChatBotUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatMutation = useChatMutation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const chatId = searchParams.get("chatId");
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const { data: chatData } = useChatData(chatId);

  useEffect(() => {
    if (chatData?.chats) {
      setMessages(chatData.chats);
    } else if (!chatId) {
      setMessages([]);
    }
  }, [chatData, chatId]);

  const handleSend = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const newMessages = [...messages, { content: inputValue, role: "user" }];
    setMessages(newMessages);

    setInputValue("")
    setMessages((prev) => [...prev, { content: "", role: "assistant" }]);
    chatMutation.mutate({
      payload: newMessages,
      chatId,
      userId,
      onChunk: (text: any) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = { ...updated[lastIndex], content: updated[lastIndex].content + text };
          return updated;
        });
      },
      onComplete: (chat_id: string) => {
        if (!chatId) {
          router.push(`/?chatId=${chat_id}`);
          queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
        }
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
          isPending={chatMutation.isPending}
        />
      </Box>
    </Box>
  );
}
