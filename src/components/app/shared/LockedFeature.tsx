import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { TierBadge } from "./TierBadge";
import { CTAButton } from "./CTAButton";
import type { Tier } from "@/data/mock";

interface LockedFeatureProps {
  tier: "explorer" | "elite";
  children: React.ReactNode;
  locked?: boolean;
  onUpgrade?: () => void;
}

export function LockedFeature({ tier, children, locked = true, onUpgrade }: LockedFeatureProps) {
  if (!locked) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* blurred children */}
      <div className="pointer-events-none select-none blur-sm opacity-60">
        {children}
      </div>

      {/* overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm"
        style={{ background: "rgba(3,4,10,0.75)" }}
      >
        <div
          className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 text-center"
          style={{ background: "rgba(11,16,32,0.9)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: tier === "elite"
                ? "linear-gradient(135deg, #8B5CFF22, #D946EF22)"
                : "rgba(77,163,255,0.15)",
            }}
          >
            <Lock
              className="w-5 h-5"
              style={{ color: tier === "elite" ? "#D946EF" : "#4DA3FF" }}
            />
          </div>

          <TierBadge tier={tier} size="md" />

          <p className="text-sm text-[#9BA3B7] max-w-[180px] leading-snug">
            {tier === "elite"
              ? "Upgrade to Elite to unlock this premium feature"
              : "Upgrade to Explorer to unlock this feature"}
          </p>

          <CTAButton variant="tier" tier={tier} onClick={onUpgrade}>
            Unlock with {tier === "elite" ? "Elite" : "Explorer"}
          </CTAButton>
        </div>
      </motion.div>
    </div>
  );
}
