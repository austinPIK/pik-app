import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Star,
  Plus,
  ChevronRight,
  Calendar,
  Camera,
  MessageSquare,
  Map,
  Crown,
  Info,
  Globe,
} from "lucide-react";

type TabId = "explore" | "adventures" | "social" | "host" | "profile";

interface Props {
  onTabChange?: (t: TabId) => void;
  onVarixOpen?: () => void;
}

type SubTab = "hosting" | "traveling" | "memories";

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

const subTabs: { id: SubTab; label: string }[] = [
  { id: "hosting", label: "Hosting" },
  { id: "traveling", label: "Traveling" },
  { id: "memories", label: "Memories" },
];

const subTabOrder: SubTab[] = ["hosting", "traveling", "memories"];

// ─── Hosting sub-tab ────────────────────────────────────────────────────────

function HostingTab({ onTabChange }: { onTabChange?: (t: TabId) => void }) {
  return (
    <div className="flex flex-col gap-0 pb-28">
      {/* Small caps label */}
      <div className="px-4 pt-2 pb-3">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#E8B84B" }}
        >
          Host Dashboard
        </span>
      </div>

      {/* Hero section — full bleed */}
      <div className="relative w-full" style={{ height: 260 }}>
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
          alt="Luxury villa pool at sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,11,20,0.30) 0%, rgba(8,11,20,0.72) 100%)",
          }}
        />
        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-5">
          <h2
            className="text-3xl font-bold leading-tight"
            style={{ color: "#F5F7FF" }}
          >
            Bring your people{" "}
            <span style={{ color: "#E8B84B" }}>somewhere</span>
            <br />
            <span style={{ color: "#F5F7FF" }}>unforgettable.</span>
          </h2>
          <p
            className="mt-2 text-sm leading-snug"
            style={{ color: "rgba(245,247,255,0.75)" }}
          >
            Plan epic experiences, keep everything organized, and earn while you
            host.
          </p>
        </div>
      </div>

      {/* Design a new trip card */}
      <div className="px-4 mt-4">
        <button
          onClick={() => onTabChange?.("host")}
          className="w-full flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-opacity active:opacity-80"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(232,184,75,0.15)" }}
          >
            <Plus size={20} style={{ color: "#E8B84B" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-base font-semibold"
              style={{ color: "#F5F7FF" }}
            >
              Design a new trip
            </p>
            <p
              className="text-xs mt-0.5 leading-snug"
              style={{ color: "#9BA3B7" }}
            >
              Pick a destination, invite your people, and let PIK handle the
              rest.
            </p>
          </div>
          <ChevronRight size={18} style={{ color: "#9BA3B7" }} />
        </button>
      </div>

      {/* Stats grid */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {/* Active Trips */}
        <div
          className="rounded-2xl p-3 flex flex-col gap-1"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Briefcase size={16} style={{ color: "#E8B84B" }} />
          <span
            className="text-2xl font-bold"
            style={{ color: "#F5F7FF" }}
          >
            2
          </span>
          <span
            className="text-[10px] font-semibold tracking-wide uppercase"
            style={{ color: "#9BA3B7" }}
          >
            Active Trips
          </span>
          <span
            className="text-[11px] font-medium"
            style={{ color: "#00D4FF" }}
          >
            View all &gt;
          </span>
        </div>

        {/* Total Travelers */}
        <div
          className="rounded-2xl p-3 flex flex-col gap-1"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Users size={16} style={{ color: "#E8B84B" }} />
          <span
            className="text-2xl font-bold"
            style={{ color: "#F5F7FF" }}
          >
            47
          </span>
          <span
            className="text-[10px] font-semibold tracking-wide uppercase"
            style={{ color: "#9BA3B7" }}
          >
            Total Travelers
          </span>
          <span
            className="text-[11px] font-medium"
            style={{ color: "#00D4FF" }}
          >
            View all &gt;
          </span>
        </div>

        {/* Trips Hosted */}
        <div
          className="rounded-2xl p-3 flex flex-col gap-1"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Star size={16} style={{ color: "#E8B84B" }} />
          <span
            className="text-2xl font-bold"
            style={{ color: "#F5F7FF" }}
          >
            8
          </span>
          <span
            className="text-[10px] font-semibold tracking-wide uppercase"
            style={{ color: "#9BA3B7" }}
          >
            Trips Hosted
          </span>
          <span
            className="text-[11px] font-medium"
            style={{ color: "#00D4FF" }}
          >
            View impact &gt;
          </span>
        </div>
      </div>

      {/* Host Credit card */}
      <div className="px-4 mt-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(232,184,75,0.35)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase"
                  style={{ color: "#9BA3B7" }}
                >
                  Host Credit Earned
                </span>
                <Info size={11} style={{ color: "#9BA3B7" }} />
              </div>
              <p
                className="text-3xl font-bold"
                style={{ color: "#E8B84B" }}
              >
                $340
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "#9BA3B7" }}
              >
                Apply to your next trip · Updated today
              </p>
              <button
                className="mt-3 text-xs font-semibold"
                style={{ color: "#E8B84B" }}
              >
                Manage credit &gt;
              </button>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {/* Elite Host badge */}
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{
                  background: "rgba(232,184,75,0.15)",
                  border: "1px solid rgba(232,184,75,0.4)",
                }}
              >
                <Crown size={11} style={{ color: "#E8B84B" }} />
                <span
                  className="text-[10px] font-bold tracking-wide uppercase"
                  style={{ color: "#E8B84B" }}
                >
                  Elite Host
                </span>
              </div>

              {/* Globe + airplane graphic */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center relative"
                style={{
                  background:
                    "radial-gradient(circle, rgba(123,92,255,0.2) 0%, rgba(0,212,255,0.06) 100%)",
                  border: "1px solid rgba(123,92,255,0.3)",
                }}
              >
                <Globe size={28} style={{ color: "#00D4FF", opacity: 0.8 }} />
                {/* airplane emoji overlay */}
                <span
                  className="absolute text-base"
                  style={{ top: 6, right: 4 }}
                >
                  ✈️
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trip card (Traveling) ────────────────────────────────────────────────────

interface TripCardData {
  name: string;
  dates: string;
  hostedBy: string;
  daysOut: number;
  photo: string;
  avatars: { initials: string; color: string }[];
  extraCount: number;
}

function TripCard({ trip }: { trip: TripCardData }) {
  return (
    <div className="w-full flex flex-col">
      {/* Photo area */}
      <div className="relative w-full" style={{ height: 260 }}>
        <img
          src={trip.photo}
          alt={trip.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* bottom gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,11,20,0.0) 30%, rgba(8,11,20,0.90) 100%)",
          }}
        />

        {/* Top-left: Upcoming pill */}
        <div className="absolute top-3 left-3">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{
              background: "rgba(8,11,20,0.55)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #7B5CFF, #00D4FF)" }}
            />
            <span
              className="text-[11px] font-semibold"
              style={{ color: "#F5F7FF" }}
            >
              Upcoming
            </span>
          </div>
        </div>

        {/* Top-right: days out pill */}
        <div className="absolute top-3 right-3">
          <div
            className="rounded-full px-3 py-1"
            style={{
              background: "rgba(8,11,20,0.55)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="text-[11px] font-semibold"
              style={{ color: "#F5F7FF" }}
            >
              {trip.daysOut} days out
            </span>
          </div>
        </div>

        {/* Bottom-left: trip info */}
        <div className="absolute bottom-4 left-4 right-28">
          <p
            className="text-xl font-bold leading-tight"
            style={{ color: "#F5F7FF" }}
          >
            {trip.name}
          </p>
          <div
            className="flex items-center gap-1 mt-1"
          >
            <Calendar size={11} style={{ color: "rgba(245,247,255,0.6)" }} />
            <span
              className="text-[11px]"
              style={{ color: "rgba(245,247,255,0.7)" }}
            >
              {trip.dates}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Users size={11} style={{ color: "rgba(245,247,255,0.6)" }} />
            <span
              className="text-[11px]"
              style={{ color: "rgba(245,247,255,0.6)" }}
            >
              Hosted by{" "}
              <span style={{ color: "#00D4FF" }}>{trip.hostedBy}</span>
            </span>
          </div>
        </div>

        {/* Bottom-right: avatar stack */}
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
          <div className="flex items-center">
            {trip.avatars.map((av, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
                style={{
                  background: av.color,
                  color: "#F5F7FF",
                  borderColor: "rgba(8,11,20,0.9)",
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: trip.avatars.length - i,
                  position: "relative",
                }}
              >
                {av.initials}
              </div>
            ))}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-2"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#F5F7FF",
                borderColor: "rgba(8,11,20,0.9)",
                marginLeft: -10,
                position: "relative",
              }}
            >
              +{trip.extraCount}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 px-4 pt-3 pb-1">
        <button
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#F5F7FF",
          }}
        >
          <MessageSquare size={15} />
          Group Chat
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #7B5CFF 0%, #00D4FF 100%)",
            color: "#F5F7FF",
          }}
        >
          <Map size={15} />
          View Itinerary
        </button>
      </div>
    </div>
  );
}

// ─── Traveling sub-tab ────────────────────────────────────────────────────────

const trips: TripCardData[] = [
  {
    name: "Bali Surf Week",
    dates: "Jun 7 – Jun 14, 2026",
    hostedBy: "Sofia Chen",
    daysOut: 21,
    photo:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    avatars: [
      { initials: "SC", color: "#7B5CFF" },
      { initials: "MR", color: "#E8B84B" },
      { initials: "JP", color: "#7C6FCD" },
    ],
    extraCount: 12,
  },
  {
    name: "Patagonia Adventure",
    dates: "Jun 28 – Jul 8, 2026",
    hostedBy: "Jordan Kim",
    daysOut: 34,
    photo:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    avatars: [
      { initials: "JK", color: "#E8B84B" },
      { initials: "AL", color: "#00D4FF" },
      { initials: "TW", color: "#4CAF50" },
    ],
    extraCount: 8,
  },
];

function TravelingTab() {
  return (
    <div className="flex flex-col pb-28">
      {/* Section header */}
      <div className="px-4 pt-2 pb-3">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#00D4FF" }}
        >
          As a Traveler
        </span>
        <h2
          className="text-xl font-bold mt-1 leading-snug"
          style={{ color: "#F5F7FF" }}
        >
          Trips organized by others that you've joined.
        </h2>
      </div>

      {/* Upcoming trips header row */}
      <div className="px-4 flex items-center justify-between mb-3">
        <span
          className="text-sm font-semibold"
          style={{ color: "#F5F7FF" }}
        >
          Upcoming trips
        </span>
        <button
          className="text-xs font-semibold"
          style={{ color: "#00D4FF" }}
        >
          See all →
        </button>
      </div>

      {/* Trip cards — full bleed */}
      <div className="flex flex-col gap-5">
        {trips.map((trip, i) => (
          <TripCard key={i} trip={trip} />
        ))}
      </div>
    </div>
  );
}

// ─── Memories sub-tab ─────────────────────────────────────────────────────────

const memoryPreviews = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=80",
];

function MemoriesSubTab({
  onTabChange,
}: {
  onTabChange?: (t: TabId) => void;
}) {
  return (
    <div className="flex flex-col pb-28">
      {/* CTA card */}
      <div className="px-4 pt-2 pb-4">
        <button
          onClick={() => onTabChange?.("social")}
          className="w-full flex items-center gap-4 rounded-2xl px-4 py-5 text-left transition-opacity active:opacity-80"
          style={{
            background:
              "linear-gradient(135deg, rgba(232,184,75,0.12) 0%, rgba(123,92,255,0.1) 100%)",
            border: "1px solid rgba(232,184,75,0.25)",
          }}
        >
          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(232,184,75,0.15)" }}
          >
            <Camera size={22} style={{ color: "#E8B84B" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-base font-semibold"
              style={{ color: "#F5F7FF" }}
            >
              View your trip memories
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "#9BA3B7" }}
            >
              Relive every destination, moment by moment.
            </p>
          </div>
          <ChevronRight size={18} style={{ color: "#9BA3B7" }} />
        </button>
      </div>

      {/* Photo grid preview */}
      <div className="px-4">
        <p
          className="text-xs font-semibold tracking-wide uppercase mb-3"
          style={{ color: "#9BA3B7" }}
        >
          Recent Highlights
        </p>
        <div className="grid grid-cols-2 gap-2">
          {memoryPreviews.map((src, i) => (
            <button
              key={i}
              onClick={() => onTabChange?.("social")}
              className="relative rounded-xl overflow-hidden aspect-square active:opacity-80 transition-opacity"
            >
              <img
                src={src}
                alt={`Memory ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 50%, rgba(8,11,20,0.5) 100%)",
                }}
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => onTabChange?.("social")}
          className="mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-opacity active:opacity-80"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F5F7FF",
          }}
        >
          Open Memories →
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdventuresTab({ onTabChange, onVarixOpen }: Props) {
  const [subTab, setSubTab] = useState<SubTab>("hosting");
  const [prevSubTab, setPrevSubTab] = useState<SubTab>("hosting");

  const direction =
    subTabOrder.indexOf(subTab) - subTabOrder.indexOf(prevSubTab);

  const handleSubTabChange = (next: SubTab) => {
    if (next === subTab) return;
    setPrevSubTab(subTab);
    setSubTab(next);
  };

  return (
    <div
      className="flex flex-col w-full min-h-full"
      style={{ background: "#080B14", color: "#F5F7FF" }}
    >
      {/* Sub-tab switcher pills */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: "rgba(8,11,20,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div
          className="flex items-center gap-2 rounded-2xl p-1"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {subTabs.map((tab) => {
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSubTabChange(tab.id)}
                className="flex-1 rounded-xl py-2 text-sm font-semibold transition-all duration-200"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.10)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid transparent",
                  color: isActive ? "#F5F7FF" : "#6B7280",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={subTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full"
          >
            {subTab === "hosting" && (
              <HostingTab onTabChange={onTabChange} />
            )}
            {subTab === "traveling" && <TravelingTab />}
            {subTab === "memories" && (
              <MemoriesSubTab onTabChange={onTabChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
