"use client";
import { useRef, useState } from "react";
import { useStore } from "@/hooks/useStore";
import KanbanColumn from "./KanbanColumn";
import IssueModal from "@/components/modals/IssueModal";
import CreateIssueModal from "@/components/modals/CreateIssueModal";
import { PRIORITY_CONFIG } from "@/lib/utils";
import { format } from "date-fns";
import { Timer } from "lucide-react";

const STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export default function BoardView({ projectId }) {
  const { issues, sprints, members, moveIssue } = useStore();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCreate, setShowCreate]       = useState(false);
  const [createStatus, setCreateStatus]   = useState("TODO");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [activeSprint, setActiveSprint]   = useState(
    () => sprints.find((s) => s.projectId === projectId && s.status === "ACTIVE")?.id
      || sprints.find((s) => s.projectId === projectId)?.id
  );
  const dragRef = useRef(null);

  const projectSprints = sprints.filter((s) => s.projectId === projectId);
  const sprint = sprints.find((s) => s.id === activeSprint);

  const sprintIssues = issues.filter(
    (i) =>
      i.sprintId === activeSprint &&
      (filterPriority === "ALL" || i.priority === filterPriority)
  );

  const daysLeft = sprint
    ? Math.ceil((new Date(sprint.endDate) - Date.now()) / 86400000)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Sprint tabs */}
        <div className="flex gap-1 bg-[#080b12] border border-[#1e2433] rounded-xl p-1">
          {projectSprints.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSprint(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeSprint === s.id
                  ? "bg-[#1e2433] text-white"
                  : "text-surface-300 hover:text-white"
              }`}
            >
              {s.status === "ACTIVE" && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              )}
              {s.name}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex gap-1 ml-auto flex-wrap">
          {["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all border ${
                filterPriority === p
                  ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                  : "border-[#1e2433] text-surface-400 hover:text-white"
              }`}
            >
              {p === "ALL" ? "All" : PRIORITY_CONFIG[p]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sprint banner */}
      {sprint && (
        <div className="flex flex-wrap items-center gap-4 bg-[#080b12] border border-[#1e2433] rounded-xl px-4 py-3 mb-5 text-sm">
          <div>
            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mr-2">Goal</span>
            <span className="text-surface-100">{sprint.goal}</span>
          </div>
          {sprint.startDate && sprint.endDate && (
            <div className="flex items-center gap-1.5 ml-auto text-surface-300 text-xs">
              <Timer size={13} className="text-brand-400" />
              {format(new Date(sprint.startDate), "MMM d")} – {format(new Date(sprint.endDate), "MMM d")}
              {daysLeft !== null && daysLeft > 0 && (
                <span className="text-amber-400 font-semibold ml-1">{daysLeft}d left</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            issues={sprintIssues.filter((i) => i.status === status)}
            members={members}
            onOpen={setSelectedIssue}
            onDrop={(e, st) => {
              if (dragRef.current) { moveIssue(dragRef.current, st); dragRef.current = null; }
            }}
            onDragStart={(e, id) => { dragRef.current = id; }}
            onAddIssue={() => { setCreateStatus(status); setShowCreate(true); }}
          />
        ))}
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
      {showCreate && (
        <CreateIssueModal
          projectId={projectId}
          defaultSprintId={activeSprint}
          defaultStatus={createStatus}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
