import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-gradient-to-r from-brand-500 to-violet-500 text-white hover:opacity-90 glow-sm",
  secondary: "bg-transparent border border-surface-500 text-surface-100 hover:bg-white/5",
  ghost: "bg-brand-500/10 border border-brand-500/20 text-brand-300 hover:bg-brand-500/20",
  danger: "bg-red-900/40 border border-red-800/50 text-red-300 hover:bg-red-900/60",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2 rounded-lg",
  lg: "text-base px-6 py-3 rounded-xl",
};

export default function Button({
  children, onClick, variant = "primary", size = "md",
  disabled = false, className, type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {children}
    </button>
  );
}
