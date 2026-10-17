"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useGetMe } from "@/hooks";
import { getRoutesForRole } from "@/routes";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import FloatingChatbot from "@/components/ai-chatbot/floating-chatbot";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data } = useGetMe();

  const user = data?.data;
  const routes = getRoutesForRole(user?.role);

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardSidebar
        routes={routes}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardHeader
          user={user}
          profileHref={routes[0]?.href ?? "/"}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <FloatingChatbot />
    </div>
  );
}
