import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tier } from "@/data/mock";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md";
}

const tierConfig = {
  free: {
    label: "Free",
    classes: "bg-[#9BA3B7]/20 text-[#9BA3B7] border-[#9BA3B7]/30",
    showLock: false,
  },
  explorer: {
    label: "Explorer",
    classes: "bg-[#4DA3FF]/20 text-[#4DA3FF] border-[#4DA3FF]/30",
    showLock: true,
  },
  elite: {
    label: "Elite",
    classes: "bg-gradient-to-r from-[#8B5CFF]/20 to-[#D946EF]/20 text-[#D946EF] border-[#D946EF]/30",
    showLock: true,
  },
};

export function TierBadge({ tier, size = "sm" }: TierBadgeProps) {
  const config = tierConfig[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        config.classes,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
    >
      {config.showLock && <Lock className={cn(size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3")} />}
      {config.label}
    </span>
  );
}
