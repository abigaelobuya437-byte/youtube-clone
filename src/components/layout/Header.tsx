"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  YoutubeLogo,
  MenuIcon,
  SearchIcon,
  MicIcon,
  BellIcon,
  VideoPlusIcon,
  CloseIcon,
} from "@/components/ui/Icons";
import { useVideoContext } from "@/context/VideoContext";

export default function Header() {
  const router = useRouter();
  const {
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    setUploadModalOpen,
    currentChannel,
  } = useVideoContext();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    router.push(`/?search=${encodeURIComponent(localSearch)}`);
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-zinc-950 text-white border-b border-zinc-800 select-none">
      {/* Left section: Logo & Hamburger */}
      <div className={`flex items-center gap-4 ${showMobileSearch ? "hidden sm:flex" : "flex"}`}>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="p-2 rounded-full hover:bg-zinc-800 transition active:scale-95 text-zinc-300 hover:text-white"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center">
          <YoutubeLogo />
        </Link>
      </div>

      {/* Middle section: Search bar & Mic */}
      <div
        className={`flex-1 max-w-2xl mx-4 items-center justify-center ${
          showMobileSearch ? "flex" : "hidden sm:flex"
        }`}
      >
        {showMobileSearch && (
          <button
            onClick={() => setShowMobileSearch(false)}
            className="p-2 mr-2 rounded-full hover:bg-zinc-800 sm:hidden text-zinc-400"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        )}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full max-w-xl group"
        >
          <div className="flex items-center flex-1 bg-zinc-900 border border-zinc-700 rounded-l-full px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <SearchIcon className="w-4 h-4 text-zinc-500 mr-2 shrink-0 group-focus-within:text-zinc-200" />
            <input
              type="text"
              placeholder="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            {localSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-zinc-400 hover:text-white p-0.5"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            aria-label="Search"
            className="bg-zinc-800 hover:bg-zinc-700 border border-l-0 border-zinc-700 px-5 py-2 rounded-r-full flex items-center justify-center transition active:bg-zinc-600"
          >
            <SearchIcon className="w-5 h-5 text-zinc-300" />
          </button>
        </form>

        <button
          title="Search with your voice"
          className="ml-3 p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition active:scale-95 border border-zinc-800 hidden md:flex items-center justify-center"
        >
          <MicIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Right section: Create, Notifications, Profile */}
      <div className={`flex items-center gap-1 sm:gap-2 ${showMobileSearch ? "hidden" : "flex"}`}>
        <button
          onClick={() => setShowMobileSearch(true)}
          className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 sm:hidden"
          aria-label="Open search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>

        {/* Create / Upload button */}
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition font-medium text-sm text-zinc-200 active:scale-95"
        >
          <VideoPlusIcon className="w-5 h-5 text-red-500" />
          <span className="hidden md:inline">Create</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition active:scale-95"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-zinc-950">
              3
            </span>
          </button>
        </div>

        {/* User avatar */}
        <div
          title={currentChannel.name}
          className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 cursor-pointer ml-1 select-none hover:ring-2 hover:ring-zinc-500 transition"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentChannel.avatarUrl}
            alt={currentChannel.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
