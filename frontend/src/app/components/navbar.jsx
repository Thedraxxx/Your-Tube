"use client";

import { Mic, Bell, UserCircle } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-black text-white shadow-md sticky top-0 z-50">
      
      {/* Left: YouTube Logo */}
      <div className="flex items-center gap-2">
        
        <span className="text-xl pl-2 font-bold text-white hidden sm:block">YouTube</span>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 mx-4 max-w-xl hidden sm:flex">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-l-full bg-zinc-800 focus:outline-none"
        />
        <button className="px-4 bg-zinc-700 rounded-r-full hover:bg-zinc-600">
          🔍
        </button>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <Mic className="hidden sm:block cursor-pointer hover:text-zinc-400" />
        <Bell className="cursor-pointer hover:text-zinc-400" />
        <Link href="/auth/login"><UserCircle className="w-8 h-8 cursor-pointer hover:text-zinc-400" />
        </Link>
       
      </div>
    </header>
  );
}
