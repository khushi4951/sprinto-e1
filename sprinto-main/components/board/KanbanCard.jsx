"use client";
import { PriorityBadge, TypeIcon, LabelTag } from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

export default function KanbanCard({ issue, members, onOpen, onDragStart }) {
  const assignee = members.find((m) => m.id === issue.assigneeId);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, issue.id)}
      onClick={() => onOpen(issue)}
      className="group bg-[#0a0d14] border border-[#1a2035] rounded-xl p-3 cursor-grab
        hover:border-brand-500/30 hover:-translate-y-0.5 transition-all duration-150
        active:cursor-grabbing active:opacity-60 select-none"
    >
      {/* Header row */}
      <div className="flex items-center gap-1.5 mb-2">
        <TypeIcon type={issue.type} size={13} />
        <span className="text-[10px] text-surface-400 font-semibold">{issue.id.toUpperCase()}</span>
        <div className="flex gap-1 ml-auto">
          {issue.labels?.slice(0, 2).map((l) => <LabelTag key={l} label={l} />)}
        </div>
      </div>

      {/* Title */}
      <p className="text-[13px] font-medium text-surface-50 leading-snug mb-3 line-clamp-2">
        {issue.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <PriorityBadge priority={issue.priority} />
        {assignee ? (
          <Avatar initials={assignee.initials} size="xs" color={assignee.color} />
        ) : (
          <div className="w-6 h-6 rounded-full border border-dashed border-surface-400" />
        )}
      </div>
    </div>
  );
}
