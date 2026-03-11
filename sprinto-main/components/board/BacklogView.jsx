"use client";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { PriorityBadge, StatusBadge, TypeIcon } from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import CreateIssueModal from "@/components/modals/CreateIssueModal";
import IssueModal from "@/components/modals/IssueModal";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

export default function BacklogView({ projectId }) {
  const { issues, sprints, members } = useStore();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCreate, setShowCreate]       = useState(false);
  const [collapsed, setCollapsed]         = useState({});

  const projectSprints  = sprints.filter((s) => s.projectId === projectId);
  const backlogIssues   = issues.filter((i) => i.projectId === projectId && !i.sprintId);

  const groups = [
    ...projectSprints.map((sprint) => ({
      key: sprint.id, label: sprint.name, status: sprint.status,
      startDate: sprint.startDate, endDate: sprint.endDate,
      items: issues.filter((i) => i.sprintId === sprint.id),
    })),
    { key: "backlog", label: "Backlog", status: null, items: backlogIssues },
  ];

  const toggleCollapse = (key) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const statusColor = { ACTIVE: "#34d399", PLANNED: "#818cf8", COMPLETED: "#475569" };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex justify-end">
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            Create Issue
          </Button>
        </div>

        {groups.map(({ key, label, status, startDate, endDate, items }) => (
          <div key={key} className="bg-[#080b12] border border-[#1e2433] rounded-2xl overflow-hidden">
            {/* Group header */}
            <div
              className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-white/3 transition-colors border-b border-[#111827]"
              onClick={() => toggleCollapse(key)}
            >
              {collapsed[key] ? <ChevronRight size={14} className="text-surface-400" /> : <ChevronDown size={14} className="text-surface-400" />}
              {status && (
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor[status] || "#475569" }} />
              )}
              <span className="text-sm font-bold text-white">{label}</span>
              {status && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-500 text-surface-200">{status}</span>
              )}
              {startDate && endDate && (
                <span className="text-xs text-surface-400 ml-auto">
                  {format(new Date(startDate), "MMM d")} – {format(new Date(endDate), "MMM d")}
                </span>
              )}
              <span className="text-xs text-surface-400 bg-surface-500 px-2 py-0.5 rounded-full ml-auto">
                {items.length} issues
              </span>
            </div>

            {/* Issues */}
            {!collapsed[key] && (
              <div className="divide-y divide-[#0d1117]">
                {items.length === 0 ? (
                  <div className="px-5 py-5 text-sm text-surface-500 text-center">No issues in this sprint.</div>
                ) : items.map((issue) => {
                  const assignee = members.find((m) => m.id === issue.assigneeId);
                  return (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 cursor-pointer transition-colors"
                    >
                      <TypeIcon type={issue.type} size={14} />
                      <span className="text-[11px] text-surface-400 font-mono w-10 flex-shrink-0">{issue.id.toUpperCase()}</span>
                      <span className="flex-1 text-sm text-surface-100 truncate">{issue.title}</span>
                      <PriorityBadge priority={issue.priority} />
                      <StatusBadge status={issue.status} />
                      {assignee ? (
                        <Avatar initials={assignee.initials} size="xs" color={assignee.color} />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-dashed border-surface-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedIssue && <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
      {showCreate && <CreateIssueModal projectId={projectId} onClose={() => setShowCreate(false)} />}
    </div>
  );
}
