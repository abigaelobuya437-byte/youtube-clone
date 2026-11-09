"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Video } from "@/types";
import { CheckCircleIcon } from "@/components/ui/Icons";

interface VideoCardProps {
  video: Video;
  layout?: "grid" | "horizontal";
}

export default function VideoCard({ video, layout = "grid" }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format views: e.g. 1420000 -> 1.4M views
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return views.toString();
  };

  if (layout === "horizontal") {
    return (
      <Link
        href={`/watch/${video.id}`}
        className="flex gap-3 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Horizontal Thumbnail */}
        <div className="relative w-40 sm:w-44 aspect-video rounded-xl overflow-hidden bg-zinc-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white font-medium text-[11px] px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 pr-2">
          <h3 className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
            <span>{video.channel.name}</span>
            {video.channel.verified && <CheckCircleIcon className="w-3 h-3 text-zinc-400 inline" />}
          </p>
          <p className="text-xs text-zinc-400">
            {formatViews(video.views)} views • {video.uploadedAt}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <Link href={`/watch/${video.id}`} className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? "scale-105 brightness-105" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Video Duration Badge */}
        <span className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm text-white font-medium text-xs px-2 py-0.5 rounded-md shadow">
          {video.duration}
        </span>
      </Link>

      {/* Video Details */}
      <div className="flex gap-3 px-0.5">
        {/* Channel Avatar */}
        <Link href={`/channel/${video.channel.id}`} className="shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-zinc-700/50 hover:ring-zinc-400 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.channel.avatarUrl}
              alt={video.channel.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Text Details */}
        <div className="flex flex-col min-w-0 flex-1">
          <Link href={`/watch/${video.id}`}>
            <h2 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
              {video.title}
            </h2>
          </Link>

          <Link
            href={`/channel/${video.channel.id}`}
            className="text-xs text-zinc-400 hover:text-zinc-200 mt-1 flex items-center gap-1 transition"
          >
            <span className="truncate">{video.channel.name}</span>
            {video.channel.verified && <CheckCircleIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
          </Link>

          <div className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
