import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, Star } from "lucide-react";
import type { TabId } from "@/pages/AppView";

// ─── Feature data ────────────────────────────────────────────────────────────

const STARTER_CORE = [
  "Explore destination inspiration",
  "Save up to 2 trips",
  "Basic trip planning tools",
  "Limited Varix AI prompts (10/month)",
  "Basic profile and preferences",
] as const;

const STARTER_EXTRA = [
  "Access to public curated trips",
  "Basic group invite viewing",
  "Limited memory uploads (10 photos)",
  "Destination wish list",
] as const;

const EXPLORER_CORE = [
  "Unlimited saved trips",
  "Full Varix AI itinerary builder",
  "Booking access via supported travel partners",
  "Group trip coordination (up to 10)",
  "Wallet and travel document storage",
  "Gear and packing recommendations",
  "Full map-based itinerary view",
] as const;

const EXPLORER_EXTRA = [
  "PIK Capsule for trip memories",
  "AI travel journal generation",
  "Destination badge collection",
  "Payment splitting tools",
  "Priority AI processing",
] as const;

const ELITE_CORE = [
  "Everything in Explorer",
  "Host trip creation and earnings visibility",
  "Golf intelligence and tee-time planning",
  "Advanced group coordination tools",
  "Premium PIK Capsule modes",
  "Concierge escalation (where available)",
  "Cinematic memory exports",
] as const;

const ELITE_EXTRA = [
  "Host analytics dashboard",
  "Legacy capsule mode",
  "Anniversary memory capsules",
  "Concierge-curated memory books",
  "Early access to new features",
  "Higher AI usage limits",
  "Priority support",
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type TierKey = "starter" | "explorer" | "elite";

interface Props {
  onTabChange?: (t: "explore" | "trips" | "groups" | "memories" | "profile") => void;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface FeatureListProps {
  items: readonly string[];
  checkColor: string;
  dim?: boolean;
}

function FeatureList({ items, checkColor, dim = false }: FeatureListProps) {
  return (
    <ul className="space-y-2.5">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5">
          <Check
            size={13}
            className="mt-0.5 flex-shrink-0"
            style={{ color: dim ? "rgba(155,163,183,0.55)" : checkColor }}
          />
          <span
            className="text-[13px] leading-snug"
            style={{ color: dim ? "#4A5575" : undefined }}
          >
            {f}
          </span>
        </li>
      ))}
    </ul>
  );
}

interface ExpandToggleProps {
  open: boolean;
  onToggle: () => void;
  accentColor: string;
}

function ExpandToggle({ open, onToggle, accentColor }: ExpandToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-80 mt-1"
      style={{ color: accentColor }}
    >
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.22 }}
        className="flex items-center"
      >
        <ChevronDown size={14} />
      </motion.span>
      {open ? "Hide features" : "View all features"}
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function PricingTab({ onTabChange: _onTabChange }: Props) {
  const [annual, setAnnual] = useState(true);
  const [expanded, setExpanded] = useState<Record<TierKey, boolean>>({
    starter: false,
    explorer: false,
    elite: false,
  });

  const explorerPrice = annual ? 19 : 24;
  const elitePrice = annual ? 79 : 99;

  function toggle(tier: TierKey) {
    setExpanded((prev) => ({ ...prev, [tier]: !prev[tier] }));
  }

  return (
    <div
      className="min-h-full pb-28 lg:pb-8 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10"
      style={{ background: "#03040A" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Page header ── */}
        <div className="text-center mb-10">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(139,92,255,0.10)",
              border: "1px solid rgba(139,92,255,0.28)",
            }}
          >
            <Sparkles size={11} style={{ color: "#8B5CFF" }} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B5CFF]">
              PIK Pass
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F7FF] mb-3 tracking-tight">
            Choose Your PIK Pass
          </h1>
          <p className="text-sm text-[#9BA3B7] max-w-md mx-auto leading-relaxed">
            Unlock smarter planning, group travel tools, booking access, and memory capture.
          </p>
        </div>

        {/* ── Billing toggle ── */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span
            className="text-sm transition-colors"
            style={{ color: annual ? "#4A5575" : "#F5F7FF" }}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual((a) => !a)}
            className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
            style={{ background: annual ? "#4DA3FF" : "rgba(255,255,255,0.14)" }}
            aria-label="Toggle billing period"
          >
            <motion.div
              animate={{ x: annual ? 26 : 3 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
            />
          </button>
          <span
            className="text-sm transition-colors"
            style={{ color: annual ? "#F5F7FF" : "#4A5575" }}
          >
            Annual
          </span>
          <AnimatePresence>
            {annual && (
              <motion.span
                key="save-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(16,185,129,0.14)", color: "#10B981" }}
              >
                Save ~20%
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

          {/* ── Starter (Free) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.42, ease: "easeOut" }}
            className="rounded-2xl p-6 flex flex-col"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {/* Tier label */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#9BA3B7] mb-1">
              PIK Starter
            </p>
            <p className="text-[12px] italic text-[#4A5575] mb-4 leading-snug">
              Best for casual explorers testing the waters
            </p>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold text-[#F5F7FF] tracking-tight">$0</span>
                <span className="text-sm text-[#4A5575] pb-2">/mo</span>
              </div>
              <p className="text-[12px] text-[#4A5575] mt-0.5">Free forever. No card required.</p>
            </div>

            {/* Briefing */}
            <p className="text-[13px] text-[#9BA3B7] leading-relaxed mb-5 pt-3 border-t border-white/5">
              Start discovering destinations and building trip ideas before you commit.
            </p>

            {/* Core features */}
            <div className="flex-1 mb-5">
              <FeatureList items={STARTER_CORE} checkColor="#9BA3B7" />
            </div>

            {/* Expandable extra features */}
            <ExpandToggle
              open={expanded.starter}
              onToggle={() => toggle("starter")}
              accentColor="#9BA3B7"
            />
            <AnimatePresence initial={false}>
              {expanded.starter && (
                <motion.div
                  key="starter-extra"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <FeatureList items={STARTER_EXTRA} checkColor="#4A5575" dim />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold mt-6 transition-all hover:opacity-80"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#9BA3B7",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              Get Started Free
            </button>
          </motion.div>

          {/* ── Explorer (Most Popular) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.42, ease: "easeOut" }}
            className="rounded-2xl p-6 flex flex-col relative"
            style={{
              background: "linear-gradient(160deg, rgba(12,20,44,0.98) 0%, rgba(8,14,32,0.98) 100%)",
              border: "1px solid rgba(77,163,255,0.55)",
              boxShadow: "0 0 32px rgba(77,163,255,0.14), 0 0 80px rgba(77,163,255,0.06)",
            }}
          >
            {/* Most Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full text-white whitespace-nowrap shadow-lg"
                style={{ background: "linear-gradient(135deg, #4DA3FF 0%, #8B5CFF 100%)" }}
              >
                Most Popular
              </span>
            </div>

            {/* Tier label */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#4DA3FF] mb-1 mt-2">
              PIK Explorer
            </p>
            <p className="text-[12px] italic text-[#9BA3B7] mb-4 leading-snug">
              Best for frequent travelers who want the full planning experience
            </p>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold text-[#F5F7FF] tracking-tight">
                  ${explorerPrice}
                </span>
                <span className="text-sm text-[#9BA3B7] pb-2">/mo</span>
              </div>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(77,163,255,0.75)" }}>
                {annual
                  ? `Billed $${explorerPrice * 12}/year — save $${(24 - explorerPrice) * 12}`
                  : "Billed monthly — switch to annual to save"}
              </p>
            </div>

            {/* Briefing */}
            <p className="text-[13px] text-[#9BA3B7] leading-relaxed mb-5 pt-3 border-t border-[#4DA3FF]/10">
              Plan, organize, and manage complete trips with AI assistance and group tools.
            </p>

            {/* Core features */}
            <div className="flex-1 mb-5">
              <FeatureList items={EXPLORER_CORE} checkColor="#4DA3FF" />
            </div>

            {/* Expandable extra features */}
            <ExpandToggle
              open={expanded.explorer}
              onToggle={() => toggle("explorer")}
              accentColor="#4DA3FF"
            />
            <AnimatePresence initial={false}>
              {expanded.explorer && (
                <motion.div
                  key="explorer-extra"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <FeatureList items={EXPLORER_EXTRA} checkColor="rgba(77,163,255,0.45)" dim />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-6 transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #4DA3FF 0%, #8B5CFF 100%)" }}
            >
              Upgrade to Explorer
            </button>

            {/* Partner note */}
            <p className="text-[11px] text-[#4A5575] text-center mt-3 leading-snug">
              Booking availability depends on supported partners and destination coverage.
            </p>
          </motion.div>

          {/* ── Elite ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.42, ease: "easeOut" }}
            className="rounded-2xl p-6 flex flex-col"
            style={{
              background: "linear-gradient(160deg, rgba(18,8,28,0.98) 0%, rgba(10,6,20,0.98) 100%)",
              border: "1px solid rgba(217,70,239,0.32)",
              boxShadow: "0 0 40px rgba(217,70,239,0.10), 0 0 100px rgba(139,92,255,0.05)",
            }}
          >
            {/* Tier label */}
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#D946EF]">
                PIK Elite
              </p>
              <Star size={11} style={{ color: "#D946EF" }} fill="#D946EF" />
            </div>
            <p className="text-[12px] italic text-[#9BA3B7] mb-4 leading-snug">
              Best for high-intent travelers, hosts, golf travelers, and premium experiences
            </p>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold text-[#F5F7FF] tracking-tight">
                  ${elitePrice}
                </span>
                <span className="text-sm text-[#9BA3B7] pb-2">/mo</span>
              </div>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(217,70,239,0.70)" }}>
                {annual
                  ? `Billed $${elitePrice * 12}/year — save $${(99 - elitePrice) * 12}`
                  : "Billed monthly — switch to annual to save"}
              </p>
            </div>

            {/* Briefing */}
            <p className="text-[13px] text-[#9BA3B7] leading-relaxed mb-5 pt-3 border-t border-[#D946EF]/10">
              A premium travel command center for serious travelers and hosts.
            </p>

            {/* Core features */}
            <div className="flex-1 mb-5">
              <FeatureList items={ELITE_CORE} checkColor="#D946EF" />
            </div>

            {/* Expandable extra features */}
            <ExpandToggle
              open={expanded.elite}
              onToggle={() => toggle("elite")}
              accentColor="#D946EF"
            />
            <AnimatePresence initial={false}>
              {expanded.elite && (
                <motion.div
                  key="elite-extra"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <FeatureList items={ELITE_EXTRA} checkColor="rgba(217,70,239,0.40)" dim />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-6 transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #D946EF 0%, #8B5CFF 100%)" }}
            >
              Upgrade to Elite
            </button>

            {/* Concierge note */}
            <p className="text-[11px] text-[#4A5575] text-center mt-3 leading-snug">
              Concierge availability is partner-dependent. Not a guaranteed 24/7 service.
            </p>
          </motion.div>
        </div>

        {/* ── Legal footer note ── */}
        <p className="text-center text-[11px] text-[#4A5575] mt-10 max-w-lg mx-auto leading-relaxed">
          Booking availability depends on supported partners, destination coverage, and supplier
          inventory. Concierge features are partner-dependent and not guaranteed. Prices in USD.
        </p>
      </div>
    </div>
  );
}
