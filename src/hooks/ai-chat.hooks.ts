import { useMutation } from "@tanstack/react-query";
import { aiChatApi } from "@/api/ai-chat.api";

export function useChatbot() {
  return useMutation({
    mutationFn: aiChatApi.chat,
  });
}
