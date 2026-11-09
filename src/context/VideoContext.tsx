"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Video, Channel, Comment } from "@/types";
import { INITIAL_VIDEOS, CHANNELS } from "@/lib/mockData";

interface VideoContextType {
  videos: Video[];
  activeCategory: string;
  searchQuery: string;
  sidebarOpen: boolean;
  likedVideoIds: string[];
  dislikedVideoIds: string[];
  subscribedChannelIds: string[];
  uploadModalOpen: boolean;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleLike: (videoId: string) => void;
  toggleDislike: (videoId: string) => void;
  toggleSubscribe: (channelId: string) => void;
  addComment: (videoId: string, content: string, parentId?: string) => void;
  addVideo: (videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    category: string;
    duration?: string;
  }) => Video;
  setUploadModalOpen: (open: boolean) => void;
  currentChannel: Channel;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>([]);
  const [dislikedVideoIds, setDislikedVideoIds] = useState<string[]>([]);
  const [subscribedChannelIds, setSubscribedChannelIds] = useState<string[]>(["c1", "c4"]);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  // Current logged in user / channel
  const currentChannel: Channel = {
    id: "user-me",
    name: "Alex Dev",
    handle: "@alexdev",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    subscribersCount: 240,
    verified: false,
    bio: "Full stack developer crafting next-generation apps.",
  };

  // Load persisted likes/subs if available
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem("yt_liked_videos");
      if (savedLikes) setLikedVideoIds(JSON.parse(savedLikes));

      const savedSubs = localStorage.getItem("yt_subscribed_channels");
      if (savedSubs) setSubscribedChannelIds(JSON.parse(savedSubs));

      const customVideos = localStorage.getItem("yt_custom_videos");
      if (customVideos) {
        const parsed = JSON.parse(customVideos);
        setVideos([...parsed, ...INITIAL_VIDEOS]);
      }
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleLike = (videoId: string) => {
    setLikedVideoIds((prev) => {
      let updated: string[];
      if (prev.includes(videoId)) {
        updated = prev.filter((id) => id !== videoId);
      } else {
        updated = [...prev, videoId];
        setDislikedVideoIds((dis) => dis.filter((id) => id !== videoId));
      }
      try {
        localStorage.setItem("yt_liked_videos", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setVideos((prevVideos) =>
      prevVideos.map((v) => {
        if (v.id === videoId) {
          const isCurrentlyLiked = likedVideoIds.includes(videoId);
          return {
            ...v,
            likes: isCurrentlyLiked ? Math.max(0, v.likes - 1) : v.likes + 1,
          };
        }
        return v;
      })
    );
  };

  const toggleDislike = (videoId: string) => {
    setDislikedVideoIds((prev) => {
      let updated: string[];
      if (prev.includes(videoId)) {
        updated = prev.filter((id) => id !== videoId);
      } else {
        updated = [...prev, videoId];
        setLikedVideoIds((likes) => likes.filter((id) => id !== videoId));
      }
      return updated;
    });
  };

  const toggleSubscribe = (channelId: string) => {
    setSubscribedChannelIds((prev) => {
      const isSubbed = prev.includes(channelId);
      const updated = isSubbed ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      try {
        localStorage.setItem("yt_subscribed_channels", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setVideos((prev) =>
      prev.map((v) => {
        if (v.channel.id === channelId) {
          const isSubbed = subscribedChannelIds.includes(channelId);
          return {
            ...v,
            channel: {
              ...v.channel,
              subscribersCount: isSubbed
                ? Math.max(0, v.channel.subscribersCount - 1)
                : v.channel.subscribersCount + 1,
            },
          };
        }
        return v;
      })
    );
  };

  const addComment = (videoId: string, content: string, parentId?: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: "cm-" + Date.now(),
      videoId,
      author: {
        name: currentChannel.name,
        handle: currentChannel.handle,
        avatarUrl: currentChannel.avatarUrl,
      },
      content: content.trim(),
      timestamp: "Just now",
      likes: 0,
      replies: [],
    };

    setVideos((prevVideos) =>
      prevVideos.map((video) => {
        if (video.id !== videoId) return video;

        let updatedComments = video.comments ? [...video.comments] : [];

        if (parentId) {
          updatedComments = updatedComments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          });
        } else {
          updatedComments = [newComment, ...updatedComments];
        }

        return {
          ...video,
          commentsCount: video.commentsCount + 1,
          comments: updatedComments,
        };
      })
    );
  };

  const addVideo = (videoData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    category: string;
    duration?: string;
  }): Video => {
    const newVideo: Video = {
      id: "v-custom-" + Date.now(),
      title: videoData.title,
      description: videoData.description,
      videoUrl: videoData.videoUrl,
      thumbnailUrl: videoData.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      duration: videoData.duration || "3:24",
      durationSeconds: 204,
      views: 1,
      uploadedAt: "Just now",
      category: videoData.category || "General",
      channel: currentChannel,
      likes: 1,
      dislikes: 0,
      commentsCount: 0,
      comments: [],
      tags: ["creator", "original"],
    };

    setVideos((prev) => {
      const updated = [newVideo, ...prev];
      try {
        const customVideos = updated.filter((v) => v.id.startsWith("v-custom-"));
        localStorage.setItem("yt_custom_videos", JSON.stringify(customVideos));
      } catch {}
      return updated;
    });

    return newVideo;
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        activeCategory,
        searchQuery,
        sidebarOpen,
        likedVideoIds,
        dislikedVideoIds,
        subscribedChannelIds,
        uploadModalOpen,
        setSearchQuery,
        setActiveCategory,
        toggleSidebar,
        setSidebarOpen,
        toggleLike,
        toggleDislike,
        toggleSubscribe,
        addComment,
        addVideo,
        setUploadModalOpen,
        currentChannel,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
}
