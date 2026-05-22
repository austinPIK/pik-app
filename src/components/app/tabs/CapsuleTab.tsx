import { motion } from "framer-motion";
import {
  Archive,
  Lock,
  Camera,
  Users,
  Heart,
  Sparkles,
  Image,
  Plus,
  Film,
  BookOpen,
} from "lucide-react";
import { LockedFeature } from "../shared/LockedFeature";
import type { TabId } from "@/pages/AppView";

interface Props {
  onTabChange?: (t: TabId) => void;
}

const CAPSULES = [
  {
    id: "c1",
    title: "Bali 2026",
    subtitle: "10 nights · Ubud & Seminyak",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80",
    status: "open",
    contributors: ["AR", "SC", "MW"],
    contributorColors: ["#4DA3FF", "#8B5CFF", "#D946EF"],
    photos: 48,
    messages: 12,
    gradientFrom: "#1a6b5a",
    gradientTo: "#0d3b4f",
  },
  {
    id: "c2",
    title: "Tokyo Cherry Blossom",
    subtitle: "7 nights · Shinjuku & Kyoto",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    status: "sealed",
    unlockDate: "Apr 1, 2027",
    contributors: ["AR", "SC"],
    contributorColors: ["#4DA3FF", "#8B5CFF"],
    photos: 183,
    messages: 31,
    gradientFrom: "#5b1a4a",
    gradientTo: "#2d0b3a",
  },
];

function StatusPill({ capsule }: { capsule: (typeof CAPSULES)[number] }) {
  if (capsule.status === "open") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={{
          background: "rgba(16,185,129,0.18)",
          color: "#10B981",
          border: "1px solid rgba(16,185,129,0.35)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#10B981", boxShadow: "0 0 6px #10B981" }}
        />
        Open
      </span>
    );
  }

  if (capsule.status === "sealed") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={{
          background: "rgba(139,92,255,0.18)",
          color: "#8B5CFF",
          border: "1px solid rgba(139,92,255,0.4)",
          boxShadow: "0 0 12px rgba(139,92,255,0.2)",
        }}
      >
        <Lock size={9} />
        Sealed · Unlocks {capsule.unlockDate}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: "rgba(217,70,239,0.15)",
        color: "#D946EF",
        border: "1px solid rgba(217,70,239,0.35)",
        boxShadow: "0 0 12px rgba(217,70,239,0.2)",
      }}
    >
      <Lock size={9} />
      Locked · Dec 2026 · Elite
    </span>
  );
}

function CapsuleCard({
  capsule,
  index,
}: {
  capsule: (typeof CAPSULES)[number];
  index: number;
}) {
  const isSealed = capsule.status === "sealed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{
        height: 180,
        boxShadow: isSealed
          ? "0 0 20px rgba(139,92,255,0.25), 0 4px 32px rgba(0,0,0,0.5)"
          : "0 4px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Destination photo */}
      <img
        src={capsule.image}
        alt={capsule.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient colour tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${capsule.gradientFrom}66, ${capsule.gradientTo}88)`,
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />

      {/* Sealed shimmer overlay */}
      {isSealed && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.18, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(139,92,255,0.35) 50%, transparent 70%)",
          }}
        />
      )}

      {/* Sealed border glow */}
      {isSealed && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ border: "1px solid rgba(139,92,255,0.4)" }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Top row: status + lock icon */}
        <div className="flex items-start justify-between">
          <StatusPill capsule={capsule} />
          {isSealed && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(139,92,255,0.25)",
                border: "1px solid rgba(139,92,255,0.45)",
                boxShadow: "0 0 14px rgba(139,92,255,0.4)",
              }}
            >
              <Lock size={13} style={{ color: "#8B5CFF" }} />
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div>
          {/* Title + subtitle */}
          <p className="text-xl font-bold text-white leading-tight mb-0.5">
            {capsule.title}
          </p>
          <p className="text-xs text-white/55 mb-3">{capsule.subtitle}</p>

          {/* Action row */}
          <div className="flex items-center justify-between">
            {/* Contributors + stats */}
            <div className="flex items-center gap-3">
              {/* Avatar stack */}
              <div className="flex -space-x-1.5">
                {capsule.contributors.map((initials, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-black/60 flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: capsule.contributorColors[i] }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              {/* Stats */}
              <div className="flex items-center gap-2 text-white/55 text-[10px]">
                <span className="flex items-center gap-1">
                  <Image size={10} />
                  {capsule.photos}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={10} />
                  {capsule.messages}
                </span>
              </div>
            </div>

            {/* View button */}
            <button
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-200 active:scale-95"
              style={{
                background: isSealed
                  ? "rgba(139,92,255,0.30)"
                  : "rgba(77,163,255,0.25)",
                border: isSealed
                  ? "1px solid rgba(139,92,255,0.5)"
                  : "1px solid rgba(77,163,255,0.4)",
                backdropFilter: "blur(8px)",
              }}
            >
              {isSealed ? "Preview" : "View"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Explorer-locked preview content ── */
function ExplorerPreviewContent() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="p-4 space-y-3">
        {/* Shared Group Capsule */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(77,163,255,0.15)" }}
          >
            <Users size={16} style={{ color: "#4DA3FF" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5F7FF]">
              Shared Group Capsule
            </p>
            <p className="text-xs text-[#9BA3B7] leading-snug mt-0.5">
              Invite your whole crew to contribute photos, voice notes, and
              messages to a single sealed capsule.
            </p>
          </div>
        </div>

        <div
          className="h-px"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />

        {/* Anniversary Unlock */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(139,92,255,0.15)" }}
          >
            <Archive size={16} style={{ color: "#8B5CFF" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5F7FF]">
              Anniversary Unlock
            </p>
            <p className="text-xs text-[#9BA3B7] leading-snug mt-0.5">
              Set a future date — your capsule seals completely and reveals
              itself on your anniversary.
            </p>
            <span
              className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
              style={{
                background: "rgba(139,92,255,0.18)",
                color: "#8B5CFF",
                border: "1px solid rgba(139,92,255,0.3)",
              }}
            >
              Most loved feature
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Elite-locked preview content ── */
function ElitePreviewContent() {
  return (
    <div className="space-y-3">
      {/* Cinematic Export */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,255,0.08), rgba(217,70,239,0.06))",
          border: "1px solid rgba(217,70,239,0.18)",
        }}
      >
        {/* Film strip visual */}
        <div
          className="flex items-center gap-0 overflow-hidden"
          style={{ height: 52, background: "rgba(0,0,0,0.35)" }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex-1 h-full relative flex-shrink-0">
              <div
                className="absolute inset-y-2 inset-x-0.5 rounded-sm overflow-hidden"
                style={{
                  background: `hsl(${260 + i * 12}, 60%, ${10 + i * 3}%)`,
                  opacity: 0.8,
                }}
              />
              {/* Sprocket holes */}
              <div
                className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-sm"
                style={{ background: "rgba(0,0,0,0.8)" }}
              />
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-sm"
                style={{ background: "rgba(0,0,0,0.8)" }}
              />
            </div>
          ))}
        </div>

        <div className="p-4 flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg,rgba(139,92,255,0.25),rgba(217,70,239,0.25))",
            }}
          >
            <Film size={16} style={{ color: "#D946EF" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5F7FF]">
              Cinematic Export
            </p>
            <p className="text-xs text-[#9BA3B7] leading-snug mt-0.5">
              Render your capsule into a cinematic short film with AI-scored
              music, colour grading, and 4K export.
            </p>
          </div>
        </div>
      </div>

      {/* Legacy Storytelling */}
      <div
        className="p-4 rounded-2xl flex items-start gap-3"
        style={{
          background: "rgba(217,70,239,0.07)",
          border: "1px solid rgba(217,70,239,0.18)",
        }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(217,70,239,0.2),rgba(139,92,255,0.2))",
          }}
        >
          <BookOpen size={16} style={{ color: "#D946EF" }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F5F7FF]">
            Legacy Storytelling
          </p>
          <p className="text-xs text-[#9BA3B7] leading-snug mt-0.5">
            Varix weaves your memories into an heirloom-quality narrative —
            printed, bound, and shipped to your door.
          </p>
          <span
            className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
            style={{
              background:
                "linear-gradient(135deg,rgba(139,92,255,0.2),rgba(217,70,239,0.2))",
              color: "#D946EF",
              border: "1px solid rgba(217,70,239,0.3)",
              boxShadow: "0 0 8px rgba(217,70,239,0.15)",
            }}
          >
            <Sparkles size={8} />
            Elite exclusive
          </span>
        </div>
      </div>
    </div>
  );
}

export function CapsuleTab({ onTabChange }: Props) {
  return (
    <div
      className="min-h-full pb-28 lg:pb-8 px-5 lg:px-8 pt-6 lg:pt-8"
      style={{ background: "#03040A" }}
    >
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── 1. Hero Header ── */}
        <div className="relative flex items-start justify-between gap-4">
          {/* Pulsing orb glow */}
          <motion.div
            className="absolute pointer-events-none"
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              top: -20,
              left: -20,
              width: 220,
              height: 120,
              background:
                "radial-gradient(circle, rgba(139,92,255,0.2), transparent 60%)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />

          {/* Title block */}
          <div className="relative z-10">
            {/* Icon + title */}
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,255,0.25), rgba(217,70,239,0.20))",
                  border: "1px solid rgba(139,92,255,0.35)",
                  boxShadow: "0 0 16px rgba(139,92,255,0.3)",
                }}
              >
                <Archive
                  size={17}
                  style={{
                    color: "#8B5CFF",
                    filter: "drop-shadow(0 0 6px rgba(139,92,255,0.8))",
                  }}
                />
              </div>
              <h1 className="text-2xl font-bold text-[#F5F7FF] leading-tight">
                PIK{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CFF, #D946EF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Capsule
                </span>
              </h1>
            </div>
            <p className="text-sm text-[#9BA3B7] pl-[46px]">
              Seal your adventures. Unlock them forever.
            </p>
          </div>

          {/* Create Capsule CTA */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white flex-shrink-0 transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #8B5CFF, #D946EF)",
              boxShadow: "0 0 20px rgba(139,92,255,0.4), 0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Create Capsule</span>
            <span className="sm:hidden">Create</span>
          </motion.button>
        </div>

        {/* ── 2. Active Capsules ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4A5575]">
              Your Capsules
            </h2>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(77,163,255,0.12)",
                color: "#4DA3FF",
                border: "1px solid rgba(77,163,255,0.25)",
              }}
            >
              {CAPSULES.length} active
            </span>
          </div>

          <div className="space-y-4">
            {CAPSULES.map((capsule, i) => (
              <CapsuleCard key={capsule.id} capsule={capsule} index={i} />
            ))}
          </div>
        </section>

        {/* ── 3. Locked Features ── */}

        {/* Explorer tier */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4A5575]">
              Group &amp; Anniversary Features
            </h2>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background: "rgba(77,163,255,0.12)",
                color: "#4DA3FF",
                border: "1px solid rgba(77,163,255,0.25)",
              }}
            >
              Explorer
            </span>
          </div>

          <LockedFeature tier="explorer" onUpgrade={() => onTabChange?.("pricing")}>
            <ExplorerPreviewContent />
          </LockedFeature>
        </section>

        {/* Elite tier */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4A5575]">
              Cinematic &amp; Legacy
            </h2>
            <span
              className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background:
                  "linear-gradient(135deg,rgba(139,92,255,0.15),rgba(217,70,239,0.15))",
                color: "#D946EF",
                border: "1px solid rgba(217,70,239,0.3)",
                boxShadow: "0 0 8px rgba(217,70,239,0.15)",
              }}
            >
              <Sparkles size={8} />
              Elite
            </span>
          </div>

          <LockedFeature tier="elite" onUpgrade={() => onTabChange?.("pricing")}>
            <ElitePreviewContent />
          </LockedFeature>
        </section>

        {/* Bottom spacer for floating dock on mobile */}
        <div className="h-4" />
      </div>
    </div>
  );
}
