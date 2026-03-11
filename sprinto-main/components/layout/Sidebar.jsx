"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ChevronLeft, ChevronRight,
  Plus, Zap, Settings, FolderKanban,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/members",   icon: Users,            label: "Members" },
];

const PROJECTS = [
  { id: "p1", name: "Platform Redesign", key: "PDR", color: "#818cf8" },
  { id: "p2", name: "Mobile App v2",     key: "MAV", color: "#34d399" },
  { id: "p3", name: "API Gateway",       key: "APG", color: "#f59e0b" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#080b12] border-r border-[#111827] transition-all duration-300 relative flex-shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4 border-b border-[#111827]", collapsed && "justify-center px-2")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center flex-shrink-0 glow-sm">
          <Zap size={15} className="text-white fill-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-display font-bold text-gradient">Sprinto</span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 w-6 h-6 bg-[#1e2433] border border-[#334155] rounded-full flex items-center justify-center text-surface-300 hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className="flex-1 overflow-y-auto py-3">
        {/* Main nav */}
        <div className="px-2 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                pathname === href
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
                  : "text-surface-200 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && label}
            </Link>
          ))}
        </div>

        {/* Projects */}
        {!collapsed && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-4 mb-2">
              <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Projects</span>
              <button className="text-surface-400 hover:text-white transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="px-2 space-y-0.5">
              {PROJECTS.map((p) => (
                <Link
                  key={p.id}
                  href={`/project/${p.id}/board`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    pathname.includes(p.id)
                      ? "bg-white/8 text-white"
                      : "text-surface-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div
                    className="w-2 h-2 rounded-sm flex-shrink-0"
                    style={{ background: p.color }}
                  />
                  <span className="truncate text-sm">{p.name}</span>
                  <span className="ml-auto text-[10px] font-bold text-surface-400">{p.key}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Project icons when collapsed */}
        {collapsed && (
          <div className="mt-4 px-2 space-y-1">
            {PROJECTS.map((p) => (
              <Link
                key={p.id}
                href={`/project/${p.id}/board`}
                title={p.name}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 transition-all mx-auto"
              >
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: p.color + "33", border: `1px solid ${p.color}44` }}>
                  <span style={{ color: p.color }}>{p.key[0]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <div className={cn("border-t border-[#111827] p-3 flex items-center gap-3", collapsed && "justify-center")}>
        <UserButton afterSignOutUrl="/" />
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">My Account</div>
            <div className="text-[10px] text-surface-400">Admin</div>
          </div>
        )}
      </div>
    </aside>
  );
}
