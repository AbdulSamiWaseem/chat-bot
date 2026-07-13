import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { postApi } from "./apiCalls";

export interface ChatMessage {
  role: string;
  content: string;
}


export const useChatMutation = () => {
  return useMutation({
    mutationFn: async ({ payload, chatId, userId, onChunk, onComplete }: { payload: ChatMessage[]; chatId?: any; userId?: any; onChunk: any; onComplete?: any }) => {
      const body: any = { messages: payload };
      if (chatId) {
        body.chatId = chatId;
      }
      if (userId) {
        body.userId = userId;
      }
      const stream = await postApi("chat", body,
        {
          adapter: 'fetch',
          responseType: 'stream'
        }
      );
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let lineBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop() || "";

        let buffer = "";
        let chatId = null;
        lines.forEach((line) => {
          if (line.trim() === "") return;
          try {
            const parsed = JSON.parse(line);
            if (parsed.text) {
              buffer += parsed.text;
            }
            if (parsed.done && parsed.chatId) {
              chatId = parsed.chatId;
            }
          } catch (e) {
            console.error("Error parsing line:", line);
          }
        });

        if (buffer) {
          onChunk(buffer);
        }
        if (chatId) {
          onComplete(chatId);
        }
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error?.message || "An error occurred.");
    },
  });
};
