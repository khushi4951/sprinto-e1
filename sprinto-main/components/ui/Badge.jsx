import { PRIORITY_CONFIG, STATUS_CONFIG, TYPE_CONFIG } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriorityBadge({ priority, size = "sm" }) {
  const cfg = PRIORITY_CONFIG[priority];
  if (!cfg) return null;
  return (
    <span
      className={cn("inline-flex items-center gap-1 font-semibold rounded-full leading-none",
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold rounded-full px-2.5 py-0.5 leading-none"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}35` }}
    >
      {cfg.label}
    </span>
  );
}

export function TypeIcon({ type, size = 14 }) {
  const cfg = TYPE_CONFIG[type];
  if (!cfg) return null;
  return <span title={cfg.label} style={{ fontSize: size }}>{cfg.icon}</span>;
}

export function LabelTag({ label }) {
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-500 text-surface-100 border border-surface-400">
      {label}
    </span>
  );
}
