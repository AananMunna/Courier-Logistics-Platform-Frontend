import type { ReactNode } from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import AssistantLauncher from "@/components/modules/assistant/assistant-launcher";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <AssistantLauncher />
    </div>
  );
}
