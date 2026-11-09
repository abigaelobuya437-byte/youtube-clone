"use client";

import React, { useMemo } from "react";
import CategoryPills from "@/components/video/CategoryPills";
import VideoCard from "@/components/video/VideoCard";
import { useVideoContext } from "@/context/VideoContext";

export default function HomePage() {
  const { videos, activeCategory, searchQuery } = useVideoContext();

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        activeCategory === "All" ||
        video.category?.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [videos, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Category Pills */}
      <CategoryPills />

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 flex-1">
        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-200">No results found</h2>
            <p className="text-sm text-zinc-400 max-w-sm">
              Try different keywords or remove search filters to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
