"use client";
import { useState } from "react";
import KanbanCard from "./KanbanCard";
import { STATUS_CONFIG } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function KanbanColumn({ status, issues, members, onOpen, onDrop, onDragStart, onAddIssue }) {
  const [over, setOver] = useState(false);
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { onDrop(e, status); setOver(false); }}
      className={`flex-shrink-0 w-72 flex flex-col rounded-2xl p-3 transition-all duration-200 ${
        over
          ? "bg-brand-500/5 border-2 border-brand-500/30"
          : "bg-[#080b12] border-2 border-[#111827]"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#111827]">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}88` }}
        />
        <span className="text-xs font-bold tracking-wide uppercase" style={{ color: cfg.color }}>
          {cfg.label}
        </span>
        <span className="ml-auto text-[10px] font-bold text-surface-400 bg-surface-500 px-2 py-0.5 rounded-full">
          {issues.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-[80px] hide-scrollbar">
        {issues.map((issue) => (
          <KanbanCard
            key={issue.id}
            issue={issue}
            members={members}
            onOpen={onOpen}
            onDragStart={onDragStart}
          />
        ))}
        {issues.length === 0 && !over && (
          <div className="flex items-center justify-center h-16 text-xs text-surface-500 border border-dashed border-surface-600 rounded-xl">
            Drop issues here
          </div>
        )}
      </div>

      {/* Add */}
      <button
        onClick={onAddIssue}
        className="mt-2 flex items-center gap-1.5 text-xs text-surface-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all w-full"
      >
        <Plus size={13} />
        Add issue
      </button>
    </div>
  );
}
