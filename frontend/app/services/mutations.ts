import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { postApi } from "./apiCalls";

export interface ChatMessage {
  role: string;
  content: string;
}


export const useChatMutation = () => {
  return useMutation({
    mutationFn: async ({ payload, onChunk }: { payload: ChatMessage[]; onChunk: any }) => {
      const stream = await postApi("chat",
        { messages: payload },
        {
          adapter: 'fetch',
          responseType: 'stream'
        }
      );
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        let buffer = "";
        lines.forEach((line) => {
          if (line.trim() === "") return;
          try {
            const parsed = JSON.parse(line);
            if (parsed.text) {
              buffer += parsed.text;
            }
          } catch (e) {
            console.error("Error parsing line:", line);
          }
        });

        if (buffer) {
          onChunk(buffer);
        }
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error?.message || "An error occurred.");
    },
  });
};
