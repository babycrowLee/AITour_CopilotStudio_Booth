import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { ChatPanel } from "@/components/ChatPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "천재 탐정 K - 비밀 수첩 방탈출",
  description: "탐정 K의 사무소에서 단서를 찾아 탈출하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased custom-cursor overflow-hidden bg-[#111]`}
      >
        <Providers>
          <div className="flex w-screen h-screen overflow-hidden">
            {/* Left Game Area */}
            <div className="flex-1 relative border-r border-slate-700/50">
              {children}
            </div>
            {/* Right Chat Panel */}
            <ChatPanel />
          </div>
        </Providers>
      </body>
    </html>
  );
}
