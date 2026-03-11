"use client";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { PriorityBadge, StatusBadge, TypeIcon, LabelTag } from "@/components/ui/Badge";
import { PRIORITY_CONFIG, STATUS_CONFIG, TYPE_CONFIG } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { format } from "date-fns";
import { X, Pencil, Trash2 } from "lucide-react";

export default function IssueModal({ issue: initialIssue, onClose }) {
  const { updateIssue, deleteIssue, members } = useStore();
  const [issue, setIssue] = useState(initialIssue);
  const [editing, setEditing]     = useState(false);
  const [title, setTitle]         = useState(issue.title);
  const [desc, setDesc]           = useState(issue.description || "");
  const [priority, setPriority]   = useState(issue.priority);
  const [status, setStatus]       = useState(issue.status);
  const [assigneeId, setAssigneeId] = useState(issue.assigneeId || "");

  const assignee = members.find((m) => m.id === issue.assigneeId);

  const save = () => {
    const updated = { ...issue, title, description: desc, priority, status, assigneeId: assigneeId || null };
    updateIssue(issue.id, updated);
    setIssue(updated);
    setEditing(false);
  };

  const handleDelete = () => {
    deleteIssue(issue.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0f1117] border border-[#1e2433] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1e2433]">
          <TypeIcon type={issue.type} size={16} />
          <span className="text-xs text-surface-400 font-mono font-bold">{issue.id.toUpperCase()}</span>
          <StatusBadge status={issue.status} />
          <div className="flex gap-2 ml-auto">
            {!editing ? (
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                <Pencil size={12} /> Edit
              </Button>
            ) : (
              <Button size="sm" onClick={save}>Save</Button>
            )}
            <Button size="sm" variant="danger" onClick={handleDelete}>
              <Trash2 size={12} />
            </Button>
            <button onClick={onClose} className="text-surface-400 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-6 p-6">
          {/* Left */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wide mb-1.5">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-[#1e2433] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-500/50 mb-4"
                />
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={5}
                  className="w-full bg-[#0a0d14] border border-[#1e2433] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-500/50 resize-none font-sans"
                />
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white mb-3 leading-snug">{issue.title}</h2>
                <p className="text-sm text-surface-200 leading-relaxed">
                  {issue.description || <span className="text-surface-500 italic">No description provided.</span>}
                </p>
              </>
            )}

            {issue.labels?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {issue.labels.map((l) => <LabelTag key={l} label={l} />)}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="w-44 flex-shrink-0 space-y-5">
            {[
              {
                label: "Priority",
                content: editing ? (
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-[#1e2433] rounded-lg px-2 py-1.5 text-xs text-white outline-none">
                    {Object.keys(PRIORITY_CONFIG).map((k) => <option key={k} value={k}>{PRIORITY_CONFIG[k].label}</option>)}
                  </select>
                ) : <PriorityBadge priority={issue.priority} />,
              },
              {
                label: "Status",
                content: editing ? (
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-[#1e2433] rounded-lg px-2 py-1.5 text-xs text-white outline-none">
                    {Object.keys(STATUS_CONFIG).map((k) => <option key={k} value={k}>{STATUS_CONFIG[k].label}</option>)}
                  </select>
                ) : <StatusBadge status={issue.status} />,
              },
              {
                label: "Assignee",
                content: editing ? (
                  <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-[#1e2433] rounded-lg px-2 py-1.5 text-xs text-white outline-none">
                    <option value="">Unassigned</option>
                    {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    {assignee ? (
                      <>
                        <Avatar initials={assignee.initials} size="xs" color={assignee.color} />
                        <span className="text-xs text-surface-100">{assignee.name}</span>
                      </>
                    ) : <span className="text-xs text-surface-400">Unassigned</span>}
                  </div>
                ),
              },
            ].map(({ label, content }) => (
              <div key={label}>
                <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1.5">{label}</div>
                {content}
              </div>
            ))}

            {issue.createdAt && (
              <div>
                <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Created</div>
                <div className="text-xs text-surface-300">{format(new Date(issue.createdAt), "MMM d, yyyy")}</div>
              </div>
            )}

            {editing && (
              <Button size="sm" variant="secondary" onClick={() => setEditing(false)} className="w-full justify-center">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
