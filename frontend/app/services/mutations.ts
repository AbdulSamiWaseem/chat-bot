import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { postApi } from "./apiCalls";

export interface ChatMessage {
  role: string;
  content: string;
}

export const useChatMutation = () => {
  return useMutation({
    mutationFn: (payload: ChatMessage[]) =>
      postApi("chat", { messages: payload }),
    onError: (error: any) => {
      console.log(error)
      toast.error(error.response?.data?.message || "An error occurred.");
    },
  });
};
