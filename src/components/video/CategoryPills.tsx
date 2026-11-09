"use client";

import React from "react";
import { CATEGORIES } from "@/lib/mockData";
import { useVideoContext } from "@/context/VideoContext";

export default function CategoryPills() {
  const { activeCategory, setActiveCategory } = useVideoContext();

  return (
    <div className="sticky top-14 z-30 bg-zinc-950/95 backdrop-blur-md px-4 py-3 border-b border-zinc-800/80 overflow-x-auto scrollbar-none select-none">
      <div className="flex items-center gap-3 w-max">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap active:scale-95 ${
                isActive
                  ? "bg-zinc-100 text-zinc-900 shadow-sm"
                  : "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
