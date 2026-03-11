"use client";
import { useStore } from "@/hooks/useStore";
import Avatar from "@/components/ui/Avatar";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function MembersPage() {
  const { members, issues } = useStore();

  return (
    <div className="flex h-screen bg-[#060810] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-display font-bold text-white mb-1">Team Members</h1>
              <p className="text-surface-300 text-sm">{members.length} members in your workspace</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {members.map((m) => {
                const assigned = issues.filter((i) => i.assigneeId === m.id).length;
                const done     = issues.filter((i) => i.assigneeId === m.id && i.status === "DONE").length;
                return (
                  <div key={m.id} className="bg-[#080b12] border border-[#1e2433] rounded-2xl p-6 text-center hover:border-[#334155] transition-all hover:-translate-y-0.5">
                    <div className="flex justify-center mb-4">
                      <Avatar initials={m.initials} size="xl" color={m.color} />
                    </div>
                    <div className="text-base font-bold text-white mb-0.5">{m.name}</div>
                    <div className="text-xs text-surface-400 mb-3">{m.email}</div>
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: m.color + "15", color: m.color, border: `1px solid ${m.color}25` }}
                    >
                      {m.role}
                    </span>
                    <div className="mt-4 pt-4 border-t border-[#1e2433] grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-lg font-display font-bold text-white">{assigned}</div>
                        <div className="text-[10px] text-surface-400 uppercase tracking-wide">Assigned</div>
                      </div>
                      <div>
                        <div className="text-lg font-display font-bold text-green-400">{done}</div>
                        <div className="text-[10px] text-surface-400 uppercase tracking-wide">Done</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
