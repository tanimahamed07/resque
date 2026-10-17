export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContext {
  userRole?: "CALLER" | "DRIVER" | "DISPATCHER" | "ADMIN";
  emergencyType?: string;
  emergencyStatus?: string;
  hasActiveEmergency?: boolean;
}
