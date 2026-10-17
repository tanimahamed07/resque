import { ReactNode } from "react";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/layout/Navbar";
import FloatingChatbot from "@/components/ai-chatbot/floating-chatbot";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar></Navbar>
        <main className="flex-1">{children}</main>
        <Footer></Footer>
      </div>
      <FloatingChatbot />
    </div>
  );
}
