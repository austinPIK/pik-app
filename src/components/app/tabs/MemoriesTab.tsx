import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  Globe,
  Plane,
  Heart,
  ShieldCheck,
  Share2,
  Plus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "explore" | "adventures" | "memories" | "host" | "profile";
type SubTab = "mycards" | "badges" | "community";

interface Props {
  onTabChange?: (t: TabId) => void;
  onVarixOpen?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Memories Data ────────────────────────────────────────────────────────────

interface Memory {
  id: string;
  destination: string;
  country: string;
  flag: string;
  date: string;
  photos: number;
  isPrivate: boolean;
  likes?: number;
  gradient: string;
}

const MEMORIES: Memory[] = [
  {
    id: "m1",
    destination: "Santorini",
    country: "Greece",
    flag: "🇬🇷",
    date: "Jun 2025",
    photos: 183,
    isPrivate: false,
    likes: 97,
    gradient: "linear-gradient(135deg, #4a2a1a, #8B4513)",
  },
  {
    id: "m2",
    destination: "Marrakech",
    country: "Morocco",
    flag: "🇲🇦",
    date: "Feb 2025",
    photos: 312,
    isPrivate: true,
    gradient: "linear-gradient(135deg, #5a2a0a, #3a1a05)",
  },
  {
    id: "m3",
    destination: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    date: "Nov 2024",
    photos: 421,
    isPrivate: false,
    likes: 218,
    gradient: "linear-gradient(135deg, #2a1a5a, #8B5CFF33)",
  },
  {
    id: "m4",
    destination: "Iceland",
    country: "Iceland",
    flag: "🇮🇸",
    date: "Mar 2025",
    photos: 198,
    isPrivate: true,
    gradient: "linear-gradient(135deg, #0a2a4a, #052030)",
  },
  {
    id: "m5",
    destination: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    date: "Jan 2025",
    photos: 289,
    isPrivate: false,
    likes: 175,
    gradient: "linear-gradient(135deg, #3a2a0a, #E8B84B22)",
  },
  {
    id: "m6",
    destination: "Cape Town",
    country: "South Africa",
    flag: "🇿🇦",
    date: "Apr 2025",
    photos: 267,
    isPrivate: false,
    likes: 89,
    gradient: "linear-gradient(135deg, #4a1a2a, #D946EF22)",
  },
];

// ─── Community memories ───────────────────────────────────────────────────────

interface CommunityMemory {
  id: string;
  user: string;
  avatar: string;
  avatarColor: string;
  destination: string;
  country: string;
  flag: string;
  date: string;
  photos: number;
  likes: number;
  gradient: string;
}

const COMMUNITY_MEMORIES: CommunityMemory[] = [
  {
    id: "cm1",
    user: "Maya R.",
    avatar: "MR",
    avatarColor: "#8B5CFF",
    destination: "Kyoto",
    country: "Japan",
    flag: "🇯🇵",
    date: "Apr 2025",
    photos: 312,
    likes: 204,
    gradient: "linear-gradient(135deg, #2a1a5a, #8B5CFF44)",
  },
  {
    id: "cm2",
    user: "Jake T.",
    avatar: "JT",
    avatarColor: "#D946EF",
    destination: "Petra",
    country: "Jordan",
    flag: "🇯🇴",
    date: "Mar 2025",
    photos: 187,
    likes: 143,
    gradient: "linear-gradient(135deg, #3a1a0a, #D946EF22)",
  },
  {
    id: "cm3",
    user: "Sofia L.",
    avatar: "SL",
    avatarColor: "#10B981",
    destination: "Amalfi Coast",
    country: "Italy",
    flag: "🇮🇹",
    date: "May 2025",
    photos: 256,
    likes: 318,
    gradient: "linear-gradient(135deg, #0a2a1a, #10B98122)",
  },
  {
    id: "cm4",
    user: "Carlos M.",
    avatar: "CM",
    avatarColor: "#E8B84B",
    destination: "Patagonia",
    country: "Argentina",
    flag: "🇦🇷",
    date: "Jan 2025",
    photos: 401,
    likes: 277,
    gradient: "linear-gradient(135deg, #1a2a3a, #4DA3FF22)",
  },
];

// ─── Badges data ──────────────────────────────────────────────────────────────

interface Badge {
  id: string;
  emoji: string;
  label: string;
  description: string;
  earned: boolean;
}

const BADGES: Badge[] = [
  {
    id: "b1",
    emoji: "🏔️",
    label: "First Adventure",
    description: "Completed your very first trip with PIK.",
    earned: true,
  },
  {
    id: "b2",
    emoji: "⭐",
    label: "Explorer Tier",
    description: "Reached Explorer status with 5+ completed trips.",
    earned: true,
  },
  {
    id: "b3",
    emoji: "👥",
    label: "Group Leader",
    description: "Led a group of 4+ travelers on a PIK trip.",
    earned: true,
  },
  {
    id: "b4",
    emoji: "🎴",
    label: "Trip Card Creator",
    description: "Published your first PIK Verified Trip Card.",
    earned: true,
  },
  {
    id: "b5",
    emoji: "🌍",
    label: "5-Country Club",
    description: "Visited 5 or more countries through PIK.",
    earned: true,
  },
  {
    id: "b6",
    emoji: "📸",
    label: "Memory Maker",
    description: "Uploaded over 1,000 photos across your trips.",
    earned: true,
  },
  {
    id: "b7",
    emoji: "✈️",
    label: "Jet Setter",
    description: "Logged over 40,000 miles of PIK travel.",
    earned: false,
  },
  {
    id: "b8",
    emoji: "🏆",
    label: "Top Contributor",
    description: "Your Trip Cards earned 500+ community likes.",
    earned: false,
  },
];

// ─── Sub-tab bar ──────────────────────────────────────────────────────────────

function SubTabBar({
  active,
  onChange,
}: {
  active: SubTab;
  onChange: (t: SubTab) => void;
}) {
  const tabs: { id: SubTab; label: string }[] = [
    { id: "mycards", label: "My Cards" },
    { id: "badges", label: "Badges" },
    { id: "community", label: "Community" },
  ];

  return (
    <div
      className="flex gap-1 p-1 rounded-2xl mb-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background:
              active === t.id
                ? "linear-gradient(135deg, rgba(77,163,255,0.22), rgba(77,163,255,0.12))"
                : "transparent",
            color: active === t.id ? "#4DA3FF" : "#9BA3B7",
            border:
              active === t.id
                ? "1px solid rgba(77,163,255,0.28)"
                : "1px solid transparent",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Adventure Stats Strip ────────────────────────────────────────────────────

function StatsStrip() {
  const stats = [
    { icon: MapPin, label: "Trips", value: "12" },
    { icon: Globe, label: "Countries", value: "8" },
    { icon: Camera, label: "Photos", value: "1,609" },
    { icon: Plane, label: "Miles", value: "48K" },
  ];

  return (
    <div className="flex gap-2.5 mb-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.38, ease: EASE }}
            className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Icon size={14} style={{ color: "#4DA3FF" }} />
            <div>
              <p className="text-sm font-bold text-[#F5F7FF] leading-none">
                {s.value}
              </p>
              <p className="text-[10px] text-[#9BA3B7] mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Featured Trip Card ───────────────────────────────────────────────────────

function FeaturedCard({ liked, onToggleLike }: { liked: Set<string>; onToggleLike: (id: string) => void }) {
  const id = "featured-bali";
  const isLiked = liked.has(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: EASE }}
      className="relative rounded-3xl overflow-hidden mb-5 cursor-pointer group"
      style={{ height: 260 }}
    >
      {/* Photo bg */}
      <img
        src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=80"
        alt="Bali"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* FEATURED MEMORY label — top-left */}
      <div className="absolute top-4 left-4">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{
            background: "rgba(77,163,255,0.18)",
            color: "#4DA3FF",
            border: "1px solid rgba(77,163,255,0.35)",
          }}
        >
          Featured Memory
        </span>
      </div>

      {/* PIK Verified badge — top-right */}
      <div className="absolute top-4 right-4">
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
          style={{
            background: "rgba(77,163,255,0.18)",
            color: "#4DA3FF",
            border: "1px solid rgba(77,163,255,0.35)",
          }}
        >
          <ShieldCheck size={10} />
          PIK
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-xl font-bold text-white leading-tight mb-0.5">
          Bali, Indonesia
        </p>
        <p className="text-xs text-white/55 mb-3">
          Jun 2025 · 10 nights · 248 photos
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLike(id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{
              background: isLiked
                ? "rgba(217,70,239,0.18)"
                : "rgba(255,255,255,0.1)",
              border: isLiked
                ? "1px solid rgba(217,70,239,0.35)"
                : "1px solid rgba(255,255,255,0.14)",
              color: isLiked ? "#D946EF" : "rgba(255,255,255,0.8)",
            }}
          >
            <Heart
              size={13}
              fill={isLiked ? "#D946EF" : "none"}
              stroke={isLiked ? "#D946EF" : "rgba(255,255,255,0.8)"}
            />
            {142 + (isLiked ? 1 : 0)}
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <Share2 size={13} />
            Share
          </button>

          <button
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
              boxShadow: "0 0 16px rgba(77,163,255,0.38)",
            }}
          >
            View Trip Card →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Trip Cards Grid ──────────────────────────────────────────────────────────

function TripCardsGrid({
  liked,
  onToggleLike,
}: {
  liked: Set<string>;
  onToggleLike: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {MEMORIES.map((m, i) => {
        const isLiked = liked.has(m.id);
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.38, ease: EASE }}
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            style={{ height: 160, background: m.gradient }}
          >
            {/* Subtle inner glow overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
              }}
            />

            {/* Public / Private badge — top-right */}
            <div className="absolute top-2.5 right-2.5">
              {m.isPrivate ? (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  Private
                </span>
              ) : (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(77,163,255,0.18)",
                    color: "#4DA3FF",
                    border: "1px solid rgba(77,163,255,0.3)",
                  }}
                >
                  Public
                </span>
              )}
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-xs font-bold text-white leading-tight">
                {m.destination}{" "}
                <span className="text-white/60 font-normal">{m.flag}</span>
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">
                {m.date} · {m.photos} photos
              </p>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-2">
                {!m.isPrivate && m.likes !== undefined ? (
                  <button
                    onClick={() => onToggleLike(m.id)}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      size={11}
                      fill={isLiked ? "#D946EF" : "none"}
                      stroke={isLiked ? "#D946EF" : "rgba(255,255,255,0.5)"}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: isLiked ? "#D946EF" : "rgba(255,255,255,0.5)" }}
                    >
                      {m.likes + (isLiked ? 1 : 0)}
                    </span>
                  </button>
                ) : (
                  <span />
                )}

                <button
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Legacy Card ──────────────────────────────────────────────────────────────

function LegacyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.44, ease: EASE }}
      className="p-5 rounded-3xl mb-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(10,25,60,0.9) 0%, rgba(8,18,45,0.95) 100%)",
        border: "1px solid rgba(77,163,255,0.18)",
        boxShadow: "inset 0 0 40px rgba(77,163,255,0.06)",
      }}
    >
      {/* Label */}
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color: "#4DA3FF" }}
      >
        Your Adventure Legacy
      </p>

      {/* Map emoji */}
      <div className="text-4xl mb-4 leading-none select-none" aria-hidden>
        🗺️
      </div>

      {/* Body text */}
      <p className="text-sm text-[#F5F7FF] leading-relaxed mb-5">
        <span className="font-bold">Alex</span> has visited{" "}
        <span className="font-bold text-[#4DA3FF]">8 countries</span> across{" "}
        <span className="font-bold text-[#4DA3FF]">12 trips</span>, covering{" "}
        <span className="font-bold text-[#4DA3FF]">34,200 miles</span> — a true{" "}
        <span className="font-bold text-[#E8B84B]">Explorer.</span>
      </p>

      <button
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
          boxShadow: "0 0 16px rgba(77,163,255,0.3)",
        }}
      >
        <Share2 size={14} />
        Share Your Story →
      </button>
    </motion.div>
  );
}

// ─── Badges Scroll Strip (compact, for My Cards tab) ─────────────────────────

function BadgesStrip() {
  const earned = BADGES.filter((b) => b.earned);

  return (
    <div className="mb-6">
      <p className="text-sm font-bold text-[#F5F7FF] mb-3">Badges Earned</p>
      <div
        className="flex gap-2.5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {earned.map((badge, i) => (
          <motion.span
            key={badge.id}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.32, ease: EASE }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{
              background: "rgba(232,184,75,0.08)",
              border: "1px solid rgba(232,184,75,0.35)",
              color: "#E8B84B",
            }}
          >
            <span>{badge.emoji}</span>
            {badge.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// ─── My Cards Sub-tab ─────────────────────────────────────────────────────────

function MyCardsSubTab({
  liked,
  onToggleLike,
}: {
  liked: Set<string>;
  onToggleLike: (id: string) => void;
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Memories</h1>
          <p className="text-sm text-[#9BA3B7] mt-1">
            Your journey, immortalized.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
            boxShadow: "0 0 16px rgba(77,163,255,0.35)",
          }}
        >
          <Plus size={15} />
          Create
        </button>
      </div>

      {/* Stats Strip */}
      <StatsStrip />

      {/* Featured Trip Card */}
      <FeaturedCard liked={liked} onToggleLike={onToggleLike} />

      {/* Trip Cards Grid */}
      <TripCardsGrid liked={liked} onToggleLike={onToggleLike} />

      {/* Legacy Card */}
      <LegacyCard />

      {/* Badges Strip */}
      <BadgesStrip />
    </div>
  );
}

// ─── Badges Sub-tab ───────────────────────────────────────────────────────────

function BadgesSubTab() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F5F7FF]">Badges</h1>
        <p className="text-sm text-[#9BA3B7] mt-1">
          Milestones you've unlocked on your journey.
        </p>
      </div>

      {/* Earned */}
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color: "#E8B84B" }}
      >
        Earned · {BADGES.filter((b) => b.earned).length}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-7">
        {BADGES.filter((b) => b.earned).map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.38, ease: EASE }}
            className="p-4 rounded-2xl"
            style={{
              background: "rgba(232,184,75,0.06)",
              border: "1px solid rgba(232,184,75,0.3)",
            }}
          >
            <div className="text-2xl mb-2">{badge.emoji}</div>
            <p className="text-sm font-bold text-[#F5F7FF] leading-tight mb-1">
              {badge.label}
            </p>
            <p className="text-xs text-[#9BA3B7] leading-snug">
              {badge.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Locked */}
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color: "#4A5575" }}
      >
        Locked · {BADGES.filter((b) => !b.earned).length}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {BADGES.filter((b) => !b.earned).map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.38, ease: EASE }}
            className="p-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              opacity: 0.55,
            }}
          >
            <div className="text-2xl mb-2 grayscale">{badge.emoji}</div>
            <p className="text-sm font-bold text-[#9BA3B7] leading-tight mb-1">
              {badge.label}
            </p>
            <p className="text-xs text-[#4A5575] leading-snug">
              {badge.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Community Sub-tab ────────────────────────────────────────────────────────

function CommunitySubTab({
  liked,
  onToggleLike,
}: {
  liked: Set<string>;
  onToggleLike: (id: string) => void;
}) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F5F7FF]">Community</h1>
        <p className="text-sm text-[#9BA3B7] mt-1">
          Memories shared by fellow PIK travelers.
        </p>
      </div>

      {/* Community grid */}
      <div className="grid grid-cols-2 gap-3">
        {COMMUNITY_MEMORIES.map((m, i) => {
          const isLiked = liked.has(m.id);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.38, ease: EASE }}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ height: 190, background: m.gradient }}
            >
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
                }}
              />

              {/* User avatar — top-left */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                  style={{ background: m.avatarColor }}
                >
                  {m.avatar}
                </div>
                <span className="text-[10px] font-semibold text-white drop-shadow">
                  {m.user}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs font-bold text-white leading-tight">
                  {m.destination}{" "}
                  <span className="text-white/55 font-normal">{m.flag}</span>
                </p>
                <p className="text-[10px] text-white/50 mt-0.5">
                  {m.date} · {m.photos} photos
                </p>

                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => onToggleLike(m.id)}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      size={11}
                      fill={isLiked ? "#D946EF" : "none"}
                      stroke={isLiked ? "#D946EF" : "rgba(255,255,255,0.5)"}
                    />
                    <span
                      className="text-[10px]"
                      style={{
                        color: isLiked ? "#D946EF" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {m.likes + (isLiked ? 1 : 0)}
                    </span>
                  </button>

                  <button
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function MemoriesTab({ onTabChange: _onTabChange, onVarixOpen: _onVarixOpen }: Props) {
  const [sub, setSub] = useState<SubTab>("mycards");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div
      className="min-h-full pb-28 px-5 pt-6"
      style={{ background: "#080B14" }}
    >
      <SubTabBar active={sub} onChange={setSub} />

      <AnimatePresence mode="wait">
        <motion.div
          key={sub}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          {sub === "mycards" && (
            <MyCardsSubTab liked={liked} onToggleLike={toggleLike} />
          )}
          {sub === "badges" && <BadgesSubTab />}
          {sub === "community" && (
            <CommunitySubTab liked={liked} onToggleLike={toggleLike} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
