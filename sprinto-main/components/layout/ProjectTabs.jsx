"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import { LayoutGrid, List, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Board",   icon: LayoutGrid, suffix: "board" },
  { label: "Backlog", icon: List,        suffix: "backlog" },
  { label: "Settings",icon: Settings,    suffix: "settings" },
];

export default function ProjectTabs({ projectId }) {
  const pathname = usePathname();
  const { projects } = useStore();
  const project = projects.find((p) => p.id === projectId);

  return (
    <div className="bg-[#080b12] border-b border-[#111827] px-6 flex items-center gap-6">
      {/* Project name */}
      {project && (
        <div className="flex items-center gap-2 py-3 mr-4 border-r border-[#1e2433] pr-6">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: project.color }} />
          <span className="text-sm font-bold text-white">{project.name}</span>
          <span className="text-xs text-surface-400 font-bold">{project.key}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1">
        {TABS.map(({ label, icon: Icon, suffix }) => {
          const href   = `/project/${projectId}/${suffix}`;
          const active = pathname.endsWith(suffix);
          return (
            <Link
              key={suffix}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-all duration-150",
                active
                  ? "border-brand-400 text-white"
                  : "border-transparent text-surface-300 hover:text-white hover:border-surface-500"
              )}
            >
              <Icon size={13} />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
