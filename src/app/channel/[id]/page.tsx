"use client";

import React, { useState, use } from "react";
import { useVideoContext } from "@/context/VideoContext";
import { CHANNELS } from "@/lib/mockData";
import VideoCard from "@/components/video/VideoCard";
import { CheckCircleIcon } from "@/components/ui/Icons";


export default function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const channelId = resolvedParams.id;

  const { videos, subscribedChannelIds, toggleSubscribe, currentChannel } = useVideoContext();
  const [activeTab, setActiveTab] = useState<"videos" | "about">("videos");

  // Find channel from CHANNELS or currentChannel
  let channel = Object.values(CHANNELS).find((c) => c.id === channelId);
  if (!channel && channelId === currentChannel.id) {
    channel = currentChannel;
  }
  if (!channel) {
    channel = CHANNELS.fireship;
  }

  const isSubscribed = subscribedChannelIds.includes(channel.id);
  const channelVideos = videos.filter((v) => v.channel.id === channel?.id);

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(2) + "M subscribers";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K subscribers";
    return count + " subscribers";
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Channel Banner */}
      <div className="w-full h-36 sm:h-48 md:h-60 bg-gradient-to-r from-zinc-900 to-zinc-800 overflow-hidden relative">
        {channel.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={channel.bannerUrl}
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Header Info */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-zinc-800 bg-zinc-800 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={channel.avatarUrl}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-2">
              <span>{channel.name}</span>
              {channel.verified && <CheckCircleIcon className="w-5 h-5 text-zinc-400" />}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-zinc-400">
              <span className="font-semibold text-zinc-300">{channel.handle}</span>
              <span>•</span>
              <span>{formatSubscribers(channel.subscribersCount)}</span>
              <span>•</span>
              <span>{channelVideos.length} videos</span>
            </div>

            {channel.bio && (
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl line-clamp-2 mt-1">
                {channel.bio}
              </p>
            )}

            {/* Subscribe button */}
            <div className="pt-3">
              <button
                onClick={() => toggleSubscribe(channel!.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition active:scale-95 shadow ${
                  isSubscribed
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    : "bg-white hover:bg-zinc-200 text-zinc-950"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-zinc-800 mt-8 font-medium text-sm">
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 transition relative ${
              activeTab === "videos"
                ? "text-white font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Videos
            {activeTab === "videos" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 transition relative ${
              activeTab === "about"
                ? "text-white font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            About
            {activeTab === "about" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {activeTab === "videos" ? (
          channelVideos.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              This channel has not uploaded any videos yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {channelVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )
        ) : (
          <div className="max-w-xl flex flex-col gap-4 text-sm text-zinc-300">
            <h3 className="font-bold text-base text-white">Description</h3>
            <p className="whitespace-pre-line leading-relaxed">{channel.bio}</p>
            <div className="border-t border-zinc-800 pt-4 flex flex-col gap-2 text-xs text-zinc-400">
              <p>Joined {channel.joinedDate || "Jan 1, 2024"}</p>
              <p>Location: United States</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
