import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: "blue" | "violet" | "magenta";
}

const glowMap = {
  blue: "shadow-[0_0_40px_rgba(77,163,255,0.15)]",
  violet: "shadow-[0_0_40px_rgba(139,92,255,0.15)]",
  magenta: "shadow-[0_0_40px_rgba(217,70,239,0.15)]",
};

export function GlassPanel({ children, className, glow }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-3xl backdrop-blur-xl",
        "bg-white/5 border border-white/10",
        glow && glowMap[glow],
        className
      )}
    >
      {children}
    </div>
  );
}
