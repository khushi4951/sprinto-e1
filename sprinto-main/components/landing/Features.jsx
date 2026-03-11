"use client";
import { Kanban, Timer, Users, BarChart3, GitBranch, Zap, Shield, Bell } from "lucide-react";

const FEATURES = [
  {
    icon: Kanban,
    title: "Drag & Drop Kanban",
    desc: "Visualize your workflow with beautiful kanban boards. Move issues between columns with smooth animations.",
    color: "#818cf8",
  },
  {
    icon: Timer,
    title: "Sprint Management",
    desc: "Plan, start, and complete sprints with ease. Track velocity and celebrate wins with your team.",
    color: "#34d399",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Assign issues, mention teammates, and keep everyone aligned with real-time updates.",
    color: "#f59e0b",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Burndown charts, velocity tracking, and custom reports to make data-driven decisions.",
    color: "#f87171",
  },
  {
    icon: GitBranch,
    title: "GitHub Integration",
    desc: "Link commits, PRs, and branches directly to issues. Code and tasks, finally in sync.",
    color: "#a78bfa",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Get notified about what matters. Slack, email, and in-app alerts — fully configurable.",
    color: "#38bdf8",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-brand-900/10 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-400/20 text-brand-300 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Zap size={12} />
            Features
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything your team{" "}
            <span className="text-gradient">needs to ship</span>
          </h2>
          <p className="text-surface-200 text-lg max-w-2xl mx-auto">
            From solo developers to large engineering orgs — Sprinto scales with you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className="group relative bg-[#080b12] border border-[#1e2433] rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 50% 0%, ${color}08, transparent 70%)` }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: color + "15", border: `1px solid ${color}30` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-surface-200 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
