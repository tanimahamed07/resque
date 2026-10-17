"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatContext } from "@/lib/ai-chat";
import { useGetMe, useChatbot } from "@/hooks";

interface Message extends ChatMessage {
  id: string;
  timestamp: Date;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm your emergency assistant. I can help you with:\n\n• Choosing the right ambulance type\n• First aid guidance\n• Emergency procedures\n• Status updates\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useGetMe();
  const user = userData?.data;

  const { mutate: sendChat, isPending: isLoading } = useChatbot();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Build context from user data
  const buildContext = (): ChatContext => {
    return {
      userRole: user?.role,
      // We could fetch active emergency status here if needed
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const context = buildContext();

    // Convert to ChatMessage format (without id and timestamp)
    const chatMessages: ChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    chatMessages.push({ role: "user", content: userMessage.content });

    // Call backend API using React Query hook
    sendChat(
      {
        messages: chatMessages,
        context,
      },
      {
        onSuccess: (response) => {
          // Backend returns: { success: true, message: "...", data: { response: "...", provider: "..." } }
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.data.response,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
        },
        onError: (error: any) => {
          console.error("Chat error:", error);

          // More specific error message
          let errorContent =
            "I apologize, but I'm having trouble connecting right now. For immediate emergencies, please call 999 or request an ambulance directly through the platform.";

          if (error?.message?.includes("fetch")) {
            errorContent =
              "⚠️ Cannot connect to server. Please make sure the backend is running on http://localhost:5001\n\nFor immediate emergencies, call 999.";
          }

          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: errorContent,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, errorMessage]);
        },
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: "Ambulance Types", query: "What ambulance type should I choose?" },
    { label: "First Aid", query: "How to perform CPR?" },
    { label: "Fare Info", query: "How much will the ambulance cost?" },
  ];

  const handleQuickAction = (query: string) => {
    setInput(query);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-destructive to-red-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold">
            <Sparkles className="h-3 w-3" />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-150 w-95 flex-col rounded-2xl border border-border bg-background shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-linear-to-r from-destructive to-red-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Emergency Assistant</h3>
                <p className="flex items-center gap-1 text-xs opacity-90">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  Online
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 transition-colors hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-destructive text-white"
                      : "bg-muted text-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap wrap-break-word">
                    {message.content}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs opacity-70",
                      message.role === "user" ? "text-right" : "text-left",
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="border-t border-border p-3">
              <p className="mb-2 text-xs text-muted-foreground">
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleQuickAction(action.query)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:border-destructive hover:bg-destructive/5"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              AI-powered • For emergencies, call 999
            </p>
          </div>
        </div>
      )}
    </>
  );
}
