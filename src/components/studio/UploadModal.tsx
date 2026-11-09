"use client";

import React, { useState, useRef } from "react";
import { useVideoContext } from "@/context/VideoContext";
import { CloseIcon, VideoPlusIcon } from "@/components/ui/Icons";
import { CATEGORIES } from "@/lib/mockData";

export default function UploadModal() {
  const { uploadModalOpen, setUploadModalOpen, addVideo } = useVideoContext();

  const [step, setStep] = useState<"select" | "details">("select");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Coding");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  if (!uploadModalOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      setStep("details");
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl) return;

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        addVideo({
          title,
          description,
          videoUrl,
          thumbnailUrl:
            thumbnailUrl ||
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
          category,
          duration: "2:45",
        });
        setIsUploading(false);
        setUploadProgress(0);
        setUploadModalOpen(false);
        setStep("select");
        setVideoFile(null);
      }
    }, 200);
  };

  const resetAndClose = () => {
    setUploadModalOpen(false);
    setStep("select");
    setVideoFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <VideoPlusIcon className="w-5 h-5 text-red-500" />
            <span>Upload video</span>
          </h2>
          <button
            onClick={resetAndClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === "select" ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-6 my-auto">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full bg-zinc-800/80 border-2 border-dashed border-zinc-600 hover:border-red-500 flex flex-col items-center justify-center cursor-pointer transition group"
            >
              <svg
                className="w-12 h-12 text-zinc-400 group-hover:text-red-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                Drag and drop video files to upload
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Your videos will be private until you publish them.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow"
            >
              Select files
            </button>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="p-6 flex flex-col gap-5 overflow-y-auto">
            {isUploading && (
              <div className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Uploading video & generating previews...</span>
                  <span className="font-semibold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="bg-blue-500 h-full transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Video preview & Title */}
            <div className="flex gap-4">
              <div className="w-40 aspect-video rounded-xl bg-black overflow-hidden border border-zinc-700 shrink-0 relative">
                <video src={videoUrl} className="w-full h-full object-cover" controls={false} />
                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 py-0.5 rounded text-white font-medium">
                  Preview
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-xs text-zinc-400">Selected file:</span>
                <span className="text-sm font-medium text-white truncate">
                  {videoFile?.name}
                </span>
                <span className="text-xs text-zinc-500">
                  {(videoFile?.size ? videoFile.size / (1024 * 1024) : 0).toFixed(2)} MB
                </span>
              </div>
            </div>

            {/* Title field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Title (required)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title that describes your video"
                className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video"
                className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c} className="bg-zinc-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Thumbnail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Thumbnail
              </label>
              <div className="flex items-center gap-4">
                {thumbnailUrl ? (
                  <div className="w-24 aspect-video rounded-lg overflow-hidden border border-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 transition"
                >
                  Upload thumbnail
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 mt-2">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="px-5 py-2 rounded-full hover:bg-zinc-800 text-sm font-medium text-zinc-400 hover:text-white transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow disabled:bg-zinc-800"
              >
                {isUploading ? "Publishing..." : "Publish"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
