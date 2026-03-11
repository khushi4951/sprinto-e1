import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateKey(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysLeft(endDate) {
  const diff = new Date(endDate) - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const PRIORITY_CONFIG = {
  URGENT: { label: "Urgent", color: "#f87171", bg: "#f871711a", dot: "bg-red-400" },
  HIGH:   { label: "High",   color: "#fb923c", bg: "#fb923c1a", dot: "bg-orange-400" },
  MEDIUM: { label: "Medium", color: "#facc15", bg: "#facc151a", dot: "bg-yellow-400" },
  LOW:    { label: "Low",    color: "#4ade80", bg: "#4ade801a", dot: "bg-green-400" },
};

export const STATUS_CONFIG = {
  TODO:        { label: "To Do",       color: "#64748b", bg: "#1e293b", col: "todo" },
  IN_PROGRESS: { label: "In Progress", color: "#818cf8", bg: "#1e1b4b", col: "inprogress" },
  IN_REVIEW:   { label: "In Review",   color: "#f59e0b", bg: "#1c1107", col: "review" },
  DONE:        { label: "Done",        color: "#34d399", bg: "#022c22", col: "done" },
};

export const TYPE_CONFIG = {
  TASK:  { label: "Task",  icon: "✅", color: "#818cf8" },
  STORY: { label: "Story", icon: "📖", color: "#34d399" },
  BUG:   { label: "Bug",   icon: "🐛", color: "#f87171" },
  EPIC:  { label: "Epic",  icon: "⚡", color: "#f59e0b" },
};

export const PROJECT_COLORS = [
  "#818cf8", "#34d399", "#f59e0b", "#f87171",
  "#a78bfa", "#38bdf8", "#fb923c", "#4ade80",
];
