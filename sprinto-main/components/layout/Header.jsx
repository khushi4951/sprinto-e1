"use client";
import { useState } from "react";
import { Search, Bell, Plus } from "lucide-react";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="bg-[#080b12] border-b border-[#111827] px-6 py-3 flex items-center gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search issues..."
          className="w-full bg-[#0a0d14] border border-[#1e2433] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-surface-400 outline-none focus:border-brand-500/50 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-500 bg-[#1e2433] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-brand-500 to-violet-500 text-white px-3 py-2 rounded-lg hover:opacity-90 transition-all">
          <Plus size={13} />
          New Issue
        </button>
        <button className="relative w-8 h-8 flex items-center justify-center text-surface-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-400 rounded-full" />
        </button>
      </div>
    </header>
  );
}
