"use client";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { PRIORITY_CONFIG, STATUS_CONFIG, TYPE_CONFIG } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";

export default function CreateIssueModal({ projectId, defaultSprintId, defaultStatus = "TODO", onClose }) {
  const { addIssue, sprints, members, currentUser } = useStore();
  const [title, setTitle]         = useState("");
  const [desc, setDesc]           = useState("");
  const [type, setType]           = useState("TASK");
  const [priority, setPriority]   = useState("MEDIUM");
  const [status, setStatus]       = useState(defaultStatus);
  const [assigneeId, setAssigneeId] = useState("");
  const [sprintId, setSprintId]   = useState(defaultSprintId || "");

  const projectSprints = sprints.filter((s) => s.projectId === projectId);

  const handleCreate = () => {
    if (!title.trim()) return;
    addIssue({
      projectId,
      sprintId: sprintId || null,
      title,
      description: desc,
      type,
      priority,
      status,
      assigneeId: assigneeId || null,
      reporterId: currentUser.id,
    });
    onClose();
  };

  const selectClass = "w-full bg-[#0a0d14] border border-[#1e2433] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500/50 transition-colors";
  const labelClass  = "block text-[11px] font-bold text-surface-400 uppercase tracking-widest mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0f1117] border border-[#1e2433] rounded-2xl w-full max-w-lg shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2433]">
          <h2 className="text-base font-bold text-white">Create Issue</h2>
          <button onClick={onClose} className="text-surface-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={selectClass}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Add some details..."
              rows={3}
              className={`${selectClass} resize-none font-sans`}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}>
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Assignee</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={selectClass}>
                <option value="">Unassigned</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Sprint</label>
              <select value={sprintId} onChange={(e) => setSprintId(e.target.value)} className={selectClass}>
                <option value="">Backlog</option>
                {projectSprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>Create Issue</Button>
        </div>
      </div>
    </div>
  );
}
