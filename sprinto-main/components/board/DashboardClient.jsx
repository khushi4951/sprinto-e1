"use client";
import { useStore } from "@/hooks/useStore";
import { STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from "@/lib/utils";
import { PriorityBadge, TypeIcon } from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { BarChart3, TrendingUp, CheckCircle2, Clock, Zap } from "lucide-react";

function StatCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="bg-[#080b12] border border-[#1e2433] rounded-2xl p-5 hover:border-[#334155] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + "15", border: `1px solid ${color}25` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {sub && <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-surface-300 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function DashboardClient() {
  const { projects, issues, sprints, members, currentUser } = useStore();

  const myIssues    = issues.filter((i) => i.assigneeId === currentUser.id).slice(0, 5);
  const activeSpr   = sprints.filter((s) => s.status === "ACTIVE");
  const openIssues  = issues.filter((i) => i.status !== "DONE");
  const doneIssues  = issues.filter((i) => i.status === "DONE");

  const byStatus = Object.keys(STATUS_CONFIG).reduce((acc, k) => {
    acc[k] = issues.filter((i) => i.status === k).length;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Good morning, {currentUser.name.split(" ")[0]} 👋
        </h1>
        <p className="text-surface-300 text-sm">Here's your project overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={projects.length}      color="#818cf8" icon={BarChart3} sub="+1 this week" />
        <StatCard label="Active Sprints"  value={activeSpr.length}     color="#34d399" icon={Zap}       sub="on track" />
        <StatCard label="Open Issues"     value={openIssues.length}    color="#f59e0b" icon={Clock} />
        <StatCard label="Completed"       value={doneIssues.length}    color="#4ade80" icon={CheckCircle2} sub="this sprint" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Issues */}
        <div className="lg:col-span-2 bg-[#080b12] border border-[#1e2433] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#111827] flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Assigned to me</h2>
            <span className="text-xs text-surface-400">{myIssues.length} issues</span>
          </div>
          <div className="divide-y divide-[#111827]">
            {myIssues.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                <TypeIcon type={issue.type} size={14} />
                <span className="text-xs text-surface-400 font-mono w-10 flex-shrink-0">{issue.id.toUpperCase()}</span>
                <span className="flex-1 text-sm text-surface-100 truncate">{issue.title}</span>
                <PriorityBadge priority={issue.priority} />
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline"
                  style={{ color: STATUS_CONFIG[issue.status]?.color, background: STATUS_CONFIG[issue.status]?.bg }}
                >
                  {STATUS_CONFIG[issue.status]?.label}
                </span>
              </div>
            ))}
            {myIssues.length === 0 && (
              <div className="px-5 py-8 text-center text-surface-400 text-sm">No issues assigned to you 🎉</div>
            )}
          </div>
        </div>

        {/* Projects progress */}
        <div className="bg-[#080b12] border border-[#1e2433] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#111827]">
            <h2 className="text-sm font-bold text-white">Project Progress</h2>
          </div>
          <div className="p-5 space-y-5">
            {projects.map((p) => {
              const pIssues = issues.filter((i) => i.projectId === p.id);
              const done    = pIssues.filter((i) => i.status === "DONE").length;
              const pct     = pIssues.length ? Math.round((done / pIssues.length) * 100) : 0;
              return (
                <div key={p.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: p.color }} />
                    <span className="text-xs font-semibold text-surface-100 truncate flex-1">{p.name}</span>
                    <span className="text-xs font-bold" style={{ color: p.color }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1e2433] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: p.color }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-surface-400">{done}/{pIssues.length} done</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-[#080b12] border border-[#1e2433] rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(byStatus).map(([status, count]) => {
            const cfg  = STATUS_CONFIG[status];
            const pct  = issues.length ? Math.round((count / issues.length) * 100) : 0;
            return (
              <div key={status} className="text-center">
                <div className="text-2xl font-display font-bold mb-0.5" style={{ color: cfg.color }}>{count}</div>
                <div className="text-xs text-surface-300 mb-2">{cfg.label}</div>
                <div className="h-1 bg-[#1e2433] rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
