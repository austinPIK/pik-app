import { cn } from "@/lib/utils";
import type { Tier } from "@/data/mock";

interface CTAButtonProps {
  children: React.ReactNode;
  variant: "primary" | "ghost" | "tier";
  tier?: Tier;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function CTAButton({
  children,
  variant,
  tier,
  onClick,
  className,
  disabled,
  type = "button",
}: CTAButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-4 py-2.5 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary: "bg-gradient-to-r from-[#4DA3FF] to-[#8B5CFF] text-white shadow-lg shadow-[#4DA3FF]/20 hover:shadow-[#4DA3FF]/30 hover:brightness-110",
    ghost: "bg-white/5 border border-white/10 text-[#F5F7FF] hover:bg-white/10",
    tier: tier === "elite"
      ? "bg-gradient-to-r from-[#8B5CFF] to-[#D946EF] text-white shadow-lg shadow-[#D946EF]/20 hover:brightness-110"
      : tier === "explorer"
      ? "bg-[#4DA3FF]/20 border border-[#4DA3FF]/40 text-[#4DA3FF] hover:bg-[#4DA3FF]/30"
      : "bg-[#9BA3B7]/20 border border-[#9BA3B7]/30 text-[#9BA3B7]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
}
