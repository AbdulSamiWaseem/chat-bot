import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { postApi } from "./apiCalls";

export interface ChatMessage {
  role: string;
  content: string;
}


export const useChatMutation = () => {
  return useMutation({
    mutationFn: async (payload: ChatMessage[]) => {
      const stream = await postApi("chat",
        { messages: payload },
        {
          adapter: 'fetch',
          responseType: 'stream'
        }
      );
      console.log("Received stream:", stream);

      const reader = stream.getReader();
      console.log("reader", reader)
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        console.log("done", done)
        console.log("value", value)
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        console.log("chunk", chunk)
        const lines = chunk.split("\n");
        console.log("lines", lines)
        let buffer = "";
        lines.forEach((line) => {
          console.log("line", line)
          if (line.trim() === "") return;
          try {
            const parsed = JSON.parse(line);
            console.log("parsed", parsed);
            if (parsed.text) {
              buffer += parsed.text;
            }
          } catch (e) {
            console.error("Error parsing line:", line);
          }
        });

        console.log("buffer", buffer);
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "An error occurred.");
    },
  });
};
