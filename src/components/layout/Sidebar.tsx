"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShortsIcon,
  SubscriptionsIcon,
  HistoryIcon,
  PlaylistIcon,
  WatchLaterIcon,
  ThumbsUpIcon,
} from "@/components/ui/Icons";
import { useVideoContext } from "@/context/VideoContext";
import { CHANNELS } from "@/lib/mockData";

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, subscribedChannelIds } = useVideoContext();

  const isWatchPage = pathname?.startsWith("/watch");

  // On the watch page, YouTube completely hides or overlays the sidebar
  if (isWatchPage) {
    if (!sidebarOpen) return null;
    return (
      <aside className="fixed left-0 top-14 bottom-0 z-40 w-60 bg-zinc-950/95 backdrop-blur-md text-zinc-200 border-r border-zinc-800 p-3 overflow-y-auto shadow-2xl">
        <SidebarContent pathname={pathname} subscribedChannelIds={subscribedChannelIds} />
      </aside>
    );
  }

  // Collapsed slim sidebar for desktop when sidebarOpen is false
  if (!sidebarOpen) {
    return (
      <aside className="hidden md:flex flex-col items-center w-[72px] shrink-0 bg-zinc-950 border-r border-zinc-800 py-3 gap-6 select-none sticky top-14 h-[calc(100vh-3.5rem)]">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 text-[10px] w-full py-2 hover:bg-zinc-900 rounded-lg transition ${
            pathname === "/" ? "text-white font-medium" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <HomeIcon className="w-5 h-5" active={pathname === "/"} />
          <span>Home</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-[10px] w-full py-2 hover:bg-zinc-900 rounded-lg transition text-zinc-400 hover:text-zinc-200 cursor-pointer">
          <ShortsIcon className="w-5 h-5" />
          <span>Shorts</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[10px] w-full py-2 hover:bg-zinc-900 rounded-lg transition text-zinc-400 hover:text-zinc-200 cursor-pointer">
          <SubscriptionsIcon className="w-5 h-5" />
          <span>Subs</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[10px] w-full py-2 hover:bg-zinc-900 rounded-lg transition text-zinc-400 hover:text-zinc-200 cursor-pointer">
          <HistoryIcon className="w-5 h-5" />
          <span>You</span>
        </div>
      </aside>
    );
  }

  // Full Expanded Sidebar
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-zinc-950 border-r border-zinc-800 p-3 overflow-y-auto select-none sticky top-14 h-[calc(100vh-3.5rem)] text-sm text-zinc-200 scrollbar-thin">
      <SidebarContent pathname={pathname} subscribedChannelIds={subscribedChannelIds} />
    </aside>
  );
}

function SidebarContent({
  pathname,
  subscribedChannelIds,
}: {
  pathname: string;
  subscribedChannelIds: string[];
}) {
  const channelList = Object.values(CHANNELS);

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Navigation */}
      <div className="flex flex-col gap-1 pb-3 border-b border-zinc-800">
        <Link
          href="/"
          className={`flex items-center gap-5 px-3 py-2 rounded-xl transition ${
            pathname === "/"
              ? "bg-zinc-800/80 font-semibold text-white"
              : "hover:bg-zinc-900 text-zinc-300 hover:text-white"
          }`}
        >
          <HomeIcon className="w-5 h-5" active={pathname === "/"} />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-5 px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer transition">
          <ShortsIcon className="w-5 h-5" />
          <span>Shorts</span>
        </div>

        <div className="flex items-center gap-5 px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer transition">
          <SubscriptionsIcon className="w-5 h-5" />
          <span>Subscriptions</span>
        </div>
      </div>

      {/* You Section */}
      <div className="flex flex-col gap-1 pb-3 border-b border-zinc-800">
        <div className="px-3 py-1 font-semibold text-white flex items-center justify-between text-base">
          <span>You</span>
          <span className="text-xs text-zinc-400 hover:text-white cursor-pointer">&gt;</span>
        </div>

        <div className="flex items-center gap-5 px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer transition">
          <HistoryIcon className="w-5 h-5" />
          <span>History</span>
        </div>

        <div className="flex items-center gap-5 px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer transition">
          <PlaylistIcon className="w-5 h-5" />
          <span>Playlists</span>
        </div>

        <div className="flex items-center gap-5 px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer transition">
          <WatchLaterIcon className="w-5 h-5" />
          <span>Watch Later</span>
        </div>

        <div className="flex items-center gap-5 px-3 py-2 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer transition">
          <ThumbsUpIcon className="w-5 h-5" />
          <span>Liked videos</span>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="flex flex-col gap-1 pb-3 border-b border-zinc-800">
        <div className="px-3 py-1 font-semibold text-zinc-400 text-xs uppercase tracking-wider">
          Subscriptions
        </div>
        {channelList.map((ch) => {
          const isSubscribed = subscribedChannelIds.includes(ch.id);
          return (
            <div
              key={ch.id}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer transition group"
            >
              <div className="flex items-center gap-4 truncate">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ch.avatarUrl}
                  alt={ch.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="truncate text-sm">{ch.name}</span>
              </div>
              {isSubscribed && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* Explore */}
      <div className="flex flex-col gap-1 pb-3 border-b border-zinc-800 text-xs text-zinc-400">
        <div className="px-3 py-1 font-semibold uppercase tracking-wider">Explore</div>
        <div className="px-3 py-1.5 hover:bg-zinc-900 rounded-xl cursor-pointer text-zinc-300 hover:text-white">
          🔥 Trending
        </div>
        <div className="px-3 py-1.5 hover:bg-zinc-900 rounded-xl cursor-pointer text-zinc-300 hover:text-white">
          🎵 Music
        </div>
        <div className="px-3 py-1.5 hover:bg-zinc-900 rounded-xl cursor-pointer text-zinc-300 hover:text-white">
          🎮 Gaming
        </div>
        <div className="px-3 py-1.5 hover:bg-zinc-900 rounded-xl cursor-pointer text-zinc-300 hover:text-white">
          📰 News
        </div>
        <div className="px-3 py-1.5 hover:bg-zinc-900 rounded-xl cursor-pointer text-zinc-300 hover:text-white">
          🎙️ Podcasts
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 text-[11px] text-zinc-500 flex flex-col gap-2">
        <p>About Press Copyright Contact us Creators Advertise Developers</p>
        <p>Terms Privacy Policy & Safety How YouTube works Test new features</p>
        <p className="pt-2 text-zinc-600">© 2026 YouTube Clone LLC</p>
      </div>
    </div>
  );
}
