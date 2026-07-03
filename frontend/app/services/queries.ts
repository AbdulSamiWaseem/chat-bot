import { useQuery } from "@tanstack/react-query";
import { getApi } from "./apiCalls";

export const useChatHistory = (userId?: string) => {
  return useQuery({
    queryKey: ["chatHistory", userId],
    queryFn: () => getApi(`chat/history?userId=${userId}`),
  });
};
