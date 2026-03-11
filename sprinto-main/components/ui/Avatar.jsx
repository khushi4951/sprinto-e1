import { cn } from "@/lib/utils";

const SIZES = { xs: 24, sm: 28, md: 34, lg: 44, xl: 56 };

export default function Avatar({ initials = "?", size = "sm", color = "#818cf8", className }) {
  const px = SIZES[size] || SIZES.sm;
  return (
    <div
      className={cn("flex items-center justify-center font-bold text-white rounded-full flex-shrink-0 border-2 border-white/10", className)}
      style={{
        width: px, height: px,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        fontSize: px * 0.33,
      }}
    >
      {initials}
    </div>
  );
}
