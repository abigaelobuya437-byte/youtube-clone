"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useVideoContext } from "@/context/VideoContext";
import CustomVideoPlayer from "@/components/player/CustomVideoPlayer";
import VideoCard from "@/components/video/VideoCard";
import CommentsSection from "@/components/watch/CommentsSection";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  ShareIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  CheckCircleIcon,
} from "@/components/ui/Icons";


export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;

  const {
    videos,
    likedVideoIds,
    dislikedVideoIds,
    subscribedChannelIds,
    toggleLike,
    toggleDislike,
    toggleSubscribe,
  } = useVideoContext();

  const [isTheater, setIsTheater] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const video = videos.find((v) => v.id === videoId);

  // Fallback to first video if id is not found or mock
  const activeVideo = video || videos[0];
  const relatedVideos = videos.filter((v) => v.id !== activeVideo.id);

  const isLiked = likedVideoIds.includes(activeVideo.id);
  const isDisliked = dislikedVideoIds.includes(activeVideo.id);
  const isSubscribed = subscribedChannelIds.includes(activeVideo.channel.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(2) + "M subscribers";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K subscribers";
    return count + " subscribers";
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-zinc-800 text-white border border-zinc-700 px-5 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Theater Mode Top Player View */}
      {isTheater && (
        <div className="w-full bg-black flex justify-center py-2 px-0">
          <div className="w-full max-w-[1700px]">
            <CustomVideoPlayer
              src={activeVideo.videoUrl}
              poster={activeVideo.thumbnailUrl}
              title={activeVideo.title}
              autoPlay={true}
              isTheater={true}
              toggleTheater={() => setIsTheater(false)}
            />
          </div>
        </div>
      )}

      {/* Main Watch Layout Container */}
      <div className="max-w-[1750px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Video + Primary Info + Comments */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Default Player (when not in Theater mode) */}
          {!isTheater && (
            <CustomVideoPlayer
              src={activeVideo.videoUrl}
              poster={activeVideo.thumbnailUrl}
              title={activeVideo.title}
              autoPlay={true}
              isTheater={false}
              toggleTheater={() => setIsTheater(true)}
            />
          )}

          {/* Video Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 leading-snug">
            {activeVideo.title}
          </h1>

          {/* Action Row: Channel details + Like/Share/Download */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
            {/* Channel Details & Subscribe Button */}
            <div className="flex items-center gap-4">
              <Link href={`/channel/${activeVideo.channel.id}`}>
                <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-zinc-700 hover:ring-zinc-400 transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeVideo.channel.avatarUrl}
                    alt={activeVideo.channel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex flex-col">
                <Link
                  href={`/channel/${activeVideo.channel.id}`}
                  className="font-bold text-sm text-zinc-100 hover:text-white flex items-center gap-1 transition"
                >
                  <span>{activeVideo.channel.name}</span>
                  {activeVideo.channel.verified && (
                    <CheckCircleIcon className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </Link>
                <span className="text-xs text-zinc-400">
                  {formatSubscribers(activeVideo.channel.subscribersCount)}
                </span>
              </div>

              {/* Subscribe button */}
              <button
                onClick={() => toggleSubscribe(activeVideo.channel.id)}
                className={`ml-2 px-4 py-2 rounded-full font-medium text-sm transition active:scale-95 shadow ${
                  isSubscribed
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    : "bg-white hover:bg-zinc-200 text-zinc-950 font-semibold"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            {/* Interaction Pill Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {/* Like / Dislike segmented pill */}
              <div className="flex items-center bg-zinc-800/80 rounded-full border border-zinc-700/60 overflow-hidden text-sm">
                <button
                  onClick={() => toggleLike(activeVideo.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 hover:bg-zinc-700/80 transition active:scale-95 ${
                    isLiked ? "text-blue-400 font-semibold" : "text-zinc-200"
                  }`}
                >
                  <ThumbsUpIcon className="w-4 h-4" active={isLiked} />
                  <span>{activeVideo.likes.toLocaleString()}</span>
                </button>
                <div className="w-[1px] h-5 bg-zinc-700" />
                <button
                  onClick={() => toggleDislike(activeVideo.id)}
                  className={`px-3.5 py-2 hover:bg-zinc-700/80 transition active:scale-95 ${
                    isDisliked ? "text-blue-400" : "text-zinc-200"
                  }`}
                  aria-label="Dislike"
                >
                  <ThumbsDownIcon className="w-4 h-4" active={isDisliked} />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-sm font-medium transition active:scale-95 border border-zinc-700/60"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Download button */}
              <button
                onClick={() => showToast("Download started (local stream)")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-sm font-medium transition active:scale-95 border border-zinc-700/60"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Download</span>
              </button>

              {/* More options button */}
              <button
                onClick={() => showToast("Options menu")}
                className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-sm transition active:scale-95 border border-zinc-700/60"
                aria-label="More actions"
              >
                <MoreHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expandable Description Box */}
          <div
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            className="bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 cursor-pointer transition select-none flex flex-col gap-2"
          >
            <div className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
              <span>{formatNumber(activeVideo.views)} views</span>
              <span>•</span>
              <span>{activeVideo.uploadedAt}</span>
              {activeVideo.tags?.map((tag) => (
                <span key={tag} className="text-blue-400 font-normal">
                  #{tag}
                </span>
              ))}
            </div>

            <p
              className={`text-sm text-zinc-300 whitespace-pre-line leading-relaxed ${
                descriptionExpanded ? "" : "line-clamp-3"
              }`}
            >
              {activeVideo.description}
            </p>

            <span className="text-xs font-semibold text-zinc-400 mt-1 hover:text-white">
              {descriptionExpanded ? "Show less" : "...more"}
            </span>
          </div>

          {/* Comments Section */}
          <CommentsSection
            videoId={activeVideo.id}
            comments={activeVideo.comments}
            totalCount={activeVideo.commentsCount}
          />
        </div>

        {/* Right Column: Related Videos */}
        <div className="w-full lg:w-[400px] xl:w-[420px] shrink-0 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-zinc-200">Related videos</h2>
          <div className="flex flex-col gap-3">
            {relatedVideos.map((related) => (
              <VideoCard key={related.id} video={related} layout="horizontal" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
