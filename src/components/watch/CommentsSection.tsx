"use client";

import React, { useState } from "react";
import { Comment } from "@/types";
import { ThumbsUpIcon, ThumbsDownIcon } from "@/components/ui/Icons";
import { useVideoContext } from "@/context/VideoContext";

interface CommentsSectionProps {
  videoId: string;
  comments?: Comment[];
  totalCount: number;
}

export default function CommentsSection({
  videoId,
  comments = [],
  totalCount,
}: CommentsSectionProps) {
  const { addComment, currentChannel } = useVideoContext();

  const [newCommentText, setNewCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(videoId, newCommentText);
    setNewCommentText("");
    setIsFocused(false);
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyText.trim()) return;
    addComment(videoId, replyText, parentId);
    setReplyText("");
    setReplyingToId(null);
    setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "top") return (b.likes || 0) - (a.likes || 0);
    return 0; // default order
  });

  return (
    <div className="flex flex-col gap-6 mt-6 text-zinc-100">
      {/* Header: Count & Sort */}
      <div className="flex items-center gap-6">
        <h3 className="text-xl font-bold">{totalCount.toLocaleString()} Comments</h3>
        <div className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-300 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h6" />
          </svg>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "top" | "newest")}
            className="bg-transparent text-zinc-200 cursor-pointer focus:outline-none"
          >
            <option value="top" className="bg-zinc-900">Top comments</option>
            <option value="newest" className="bg-zinc-900">Newest first</option>
          </select>
        </div>
      </div>

      {/* Main Comment Input Form */}
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentChannel.avatarUrl}
            alt={currentChannel.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Input box */}
        <form onSubmit={handleCommentSubmit} className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newCommentText}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full bg-transparent border-b border-zinc-700 focus:border-zinc-100 text-sm py-1.5 focus:outline-none transition-colors"
          />

          {isFocused && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsFocused(false);
                  setNewCommentText("");
                }}
                className="px-4 py-2 rounded-full hover:bg-zinc-800 text-sm font-medium transition text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  newCommentText.trim()
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                Comment
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-6 pt-2">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            {/* Author Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={comment.author.avatarUrl}
                alt={comment.author.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Comment Body */}
            <div className="flex flex-col gap-1 flex-1">
              {/* Author name & time */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-zinc-200">
                  {comment.author.handle || comment.author.name}
                </span>
                <span className="text-zinc-400">{comment.timestamp}</span>
              </div>

              {/* Text */}
              <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                {comment.content}
              </p>

              {/* Engagement Buttons */}
              <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                <button className="flex items-center gap-1.5 hover:text-white transition">
                  <ThumbsUpIcon className="w-4 h-4" />
                  <span>{comment.likes > 0 ? comment.likes : ""}</span>
                </button>
                <button className="hover:text-white transition">
                  <ThumbsDownIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setReplyingToId(replyingToId === comment.id ? null : comment.id)
                  }
                  className="font-medium hover:text-white transition"
                >
                  Reply
                </button>
              </div>

              {/* Inline Reply Input */}
              {replyingToId === comment.id && (
                <div className="flex gap-3 mt-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentChannel.avatarUrl}
                      alt={currentChannel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Add a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-700 focus:border-zinc-100 text-xs py-1 focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyingToId(null);
                          setReplyText("");
                        }}
                        className="px-3 py-1 rounded-full hover:bg-zinc-800 text-xs text-zinc-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:bg-zinc-800 disabled:text-zinc-600"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Threaded Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 px-2 py-1 rounded-full transition w-max"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedReplies[comment.id] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span>{comment.replies.length} replies</span>
                  </button>

                  {expandedReplies[comment.id] && (
                    <div className="flex flex-col gap-4 mt-3 pl-4 border-l-2 border-zinc-800">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-zinc-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={reply.author.avatarUrl}
                              alt={reply.author.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-zinc-200">
                                {reply.author.handle || reply.author.name}
                              </span>
                              <span className="text-zinc-500">{reply.timestamp}</span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
