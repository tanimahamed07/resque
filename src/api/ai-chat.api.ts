import apiClient from "@/lib/apiClient";
import type { ChatMessage, ChatContext } from "@/lib/ai-chat";

export interface ChatRequest {
  messages: ChatMessage[];
  context?: ChatContext;
}

export interface ChatResponse {
  response: string;
  provider: "gemini" | "groq" | "static";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const aiChatApi = {
  chat: async (payload: ChatRequest): Promise<ApiResponse<ChatResponse>> => {
    const response = await apiClient<ApiResponse<ChatResponse>>(
      "/ai-chat/chat",
      {
        method: "POST",
        body: payload,
      },
    );
    return response;
  },
};
