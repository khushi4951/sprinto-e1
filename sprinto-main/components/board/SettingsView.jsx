"use client";
import { useStore } from "@/hooks/useStore";
import Avatar from "@/components/ui/Avatar";
import { format } from "date-fns";

export default function SettingsView({ projectId }) {
  const { projects, members } = useStore();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Project details */}
        <div className="bg-[#080b12] border border-[#1e2433] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-5 pb-3 border-b border-[#1e2433]">Project Details</h3>
          <div className="grid grid-cols-2 gap-5">
            {[
              ["Name", project.name],
              ["Key", project.key],
              ["Created", project.createdAt ? format(new Date(project.createdAt), "MMM d, yyyy") : "—"],
              ["Owner", "Alex Rivera"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">{k}</div>
                <div className="text-sm text-surface-100">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Color</div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md" style={{ background: project.color }} />
              <span className="text-sm text-surface-200">{project.color}</span>
            </div>
          </div>
          {project.description && (
            <div className="mt-5">
              <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Description</div>
              <p className="text-sm text-surface-200 leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        {/* Members */}
        <div className="bg-[#080b12] border border-[#1e2433] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2433]">
            <h3 className="text-sm font-bold text-white">Team Members ({members.length})</h3>
          </div>
          <div className="divide-y divide-[#111827]">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4">
                <Avatar initials={m.initials} size="md" color={m.color} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{m.name}</div>
                  <div className="text-xs text-surface-400">{m.email}</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-500 text-surface-200">{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
