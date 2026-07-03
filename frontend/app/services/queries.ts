import { useQuery } from "@tanstack/react-query";
import { getApi } from "./apiCalls";

export const useChatHistory = (userId?: string) => {
  return useQuery({
    queryKey: ["chatHistory", userId],
    queryFn: () => getApi(`chat/history?userId=${userId}`),
  });
};

export const useChatData = (chatId?: any) => {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getApi(`chat/${chatId}`),
    enabled: !!chatId,
  });
};
