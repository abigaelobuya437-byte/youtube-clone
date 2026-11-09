import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { VideoProvider } from "@/context/VideoContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import UploadModal from "@/components/studio/UploadModal";

export const metadata: Metadata = {
  title: "YouTube",
  description: "YouTube Clone built with Next.js, React, and Tailwind CSS",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-zinc-950 text-zinc-100 min-h-screen flex flex-col selection:bg-red-500 selection:text-white">
        <VideoProvider>
          <Suspense fallback={<div className="h-14 bg-zinc-950 border-b border-zinc-800" />}>
            <Header />
          </Suspense>
          <div className="flex flex-1 overflow-hidden">
            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>
            <main className="flex-1 overflow-y-auto min-h-[calc(100vh-3.5rem)] bg-zinc-950">
              <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading...</div>}>
                {children}
              </Suspense>
            </main>
          </div>
          <UploadModal />
        </VideoProvider>
      </body>
    </html>
  );
}
