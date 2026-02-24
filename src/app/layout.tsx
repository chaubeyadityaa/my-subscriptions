import React from "react";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "MySubscriptions",
  description: "Connected Services Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800 relative overflow-x-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_50%)]" />

        <Providers>
          <div className="flex min-h-screen flex-col">

            {/* Header */}
            <header className="border-b bg-white/70 backdrop-blur-md">
              <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    M
                  </div>
                  <h1 className="text-lg font-semibold tracking-tight">
                    MySubscriptions
                  </h1>
                </div>

                <span className="text-sm text-slate-500">
                  GitHub + AI Insights
                </span>
              </div>
            </header>

            {/* Main */}
            <main className="flex-1">
              <div className="mx-auto max-w-5xl px-6 py-10">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-white/70 backdrop-blur-md">
              <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-slate-500 flex justify-between">
                <span>© {new Date().getFullYear()} MySubscriptions</span>
                <span>Next.js · GitHub OAuth · Hugging Face</span>
              </div>
            </footer>

          </div>
        </Providers>
      </body>
    </html>
  );
}