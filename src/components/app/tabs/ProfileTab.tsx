import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2, ChevronRight, Star, MapPin, Check,
  ChevronLeft, X, Zap, Crown, Sparkles, Bell,
  CreditCard, Wallet, Settings, Bookmark, Gift, TrendingUp,
} from "lucide-react";
import { currentUser } from "@/data/mock";
import type { TabId } from "@/pages/AppView";

interface Props {
  onTabChange?: (t: TabId) => void;
  onVarixOpen?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const LOGO_GRAD = "linear-gradient(135deg, #D4E8FB 0%, #9DC2F6 30%, #6B9FEE 55%, #8C87F4 75%, #B99CF9 100%)";
const GOLD = "#D4A847";
const GOLD_GRAD = "linear-gradient(120deg, #F0C040 0%, #D4A030 50%, #B8880A 100%)";

type ProfileSubTab = "overview" | "preferences" | "badges" | "settings";

// ── Places I've Been ──────────────────────────────────────────────────────────
const PLACES = [
  {
    id: "japan",
    name: "Japan",
    region: "East Asia",
    quote: "Cherry blossoms along the Philosopher's Path",
    adventures: 3,
    lastVisited: "Spring 2024",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=85",
  },
  {
    id: "bali",
    name: "Bali",
    region: "Southeast Asia",
    quote: "The sound of gamelan at dawn in Ubud",
    adventures: 2,
    lastVisited: "Summer 2023",
    img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=85",
  },
  {
    id: "patagonia",
    name: "Patagonia",
    region: "South America",
    quote: "Glaciers that make you feel small in the best way",
    adventures: 1,
    lastVisited: "Winter 2024",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85",
  },
  {
    id: "santorini",
    name: "Santorini",
    region: "Mediterranean",
    quote: "Sunsets that last forever over the caldera",
    adventures: 1,
    lastVisited: "Fall 2023",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=85",
  },
  {
    id: "morocco",
    name: "Morocco",
    region: "North Africa",
    quote: "Lost in the medina — exactly as planned",
    adventures: 2,
    lastVisited: "Spring 2023",
    img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=900&q=85",
  },
  {
    id: "iceland",
    name: "Iceland",
    region: "Northern Europe",
    quote: "Northern lights reflected in black sand",
    adventures: 1,
    lastVisited: "Winter 2023",
    img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=900&q=85",
  },
];

// ── Preferences ───────────────────────────────────────────────────────────────
const PREF_GROUPS = [
  { key: "style",  label: "Travel Style",    multi: true,  options: ["Adventure", "Cultural", "Wellness", "Beach", "Trekking", "Culinary", "Wildlife"] },
  { key: "group",  label: "Travel With",     multi: true,  options: ["Solo", "Couple", "Friends group", "Family", "Hosted group"] },
  { key: "length", label: "Trip Length",     multi: true,  options: ["Weekend", "3–5 days", "7–14 days", "2–3 weeks", "A month or more"] },
  { key: "budget", label: "Budget Per Trip", multi: false, options: ["Under $1,500", "$1,500–3,000", "$3,000–6,000", "$6,000–10,000", "$10,000+"] },
  { key: "diet",   label: "Dietary Needs",   multi: true,  options: ["No restrictions", "Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher"] },
  { key: "gear",   label: "Gear",            multi: false, options: ["Bring my own", "Rent on location", "Mix of both"] },
];

const DEFAULT_PREFS: Record<string, string[]> = {
  style:  ["Adventure", "Wellness"],
  group:  ["Friends group"],
  length: ["7–14 days"],
  budget: ["$3,000–6,000"],
  diet:   ["No restrictions"],
  gear:   ["Bring my own"],
};

// ── Earned badges ─────────────────────────────────────────────────────────────
const EARNED_BADGES = [
  { country: "Japan",     flag: "🇯🇵", trips: 3 },
  { country: "Indonesia", flag: "🇮🇩", trips: 2 },
  { country: "Greece",    flag: "🇬🇷", trips: 1 },
  { country: "Morocco",   flag: "🇲🇦", trips: 2 },
  { country: "Iceland",   flag: "🇮🇸", trips: 1 },
  { country: "UAE",       flag: "🇦🇪", trips: 1 },
  { country: "S. Africa", flag: "🇿🇦", trips: 1 },
  { country: "USA",       flag: "🇺🇸", trips: 4 },
];

const ACHIEVEMENTS = [
  { icon: "🏠", name: "First Host",     desc: "Host your first group trip",    earned: true,  progress: null },
  { icon: "🌍", name: "Globetrotter",  desc: "Visit 10 countries",             earned: false, progress: "8 of 10" },
  { icon: "👥", name: "Squad Builder", desc: "Bring 25 friends on PIK trips",  earned: false, progress: "12 of 25" },
  { icon: "🏆", name: "PIK Legend",    desc: "Complete 35+ trips",             earned: false, progress: "12 of 35" },
];

// ── Subscription tiers ────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    color: "#9BA3B7",
    features: [
      "Browse destinations",
      "Save up to 5 itineraries",
      "View Social feed",
      "Basic Varix chat (5/day)",
    ],
    locked: [
      "Book trips through PIK",
      "Full Varix trip planning",
      "Trip Rooms & group tools",
      "PIK Capsule",
      "Host trips",
      "PIK Rewards & credits",
    ],
  },
  {
    id: "explorer",
    name: "Explorer",
    price: "$19",
    period: "/mo",
    color: "#8AA0FF",
    popular: true,
    features: [
      "Everything in Free",
      "Full Varix trip planning",
      "Book trips through PIK",
      "Trip Rooms & group tools",
      "Unlimited itinerary saves",
      "PIK Capsule (1 active)",
      "Host trips up to 8 guests",
    ],
    locked: [
      "Golf trip intelligence",
      "Host Analytics dashboard",
      "PIK Rewards & travel credits",
      "Priority Varix responses",
      "Unlimited PIK Capsules",
      "Host up to 50 guests",
    ],
  },
  {
    id: "elite",
    name: "Elite Adventures",
    price: "$49",
    period: "/mo",
    color: GOLD,
    popular: false,
    features: [
      "Everything in Explorer",
      "Golf trip intelligence",
      "Host Analytics dashboard",
      "PIK Rewards & travel credits",
      "Priority Varix responses",
      "Unlimited PIK Capsules",
      "Host up to 50 guests",
      "Early access to new features",
    ],
    locked: [],
  },
];

const NOTIF_TOGGLES = [
  { key: "trip",     label: "Trip updates"              },
  { key: "chat",     label: "Group chat messages"       },
  { key: "host",     label: "Host activity"             },
  { key: "booking",  label: "Booking confirmations"     },
  { key: "capsule",  label: "PIK Capsule unlocks"       },
  { key: "trending", label: "Trending itinerary alerts" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ChipGroup({ options, selected, multi, onToggle }: {
  options: string[]; selected: string[]; multi: boolean; onToggle: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <motion.button
            key={opt} whileTap={{ scale: 0.93 }}
            onClick={() => onToggle(opt)}
            style={{
              height: 34, paddingLeft: 16, paddingRight: 16, borderRadius: 999,
              border: active ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              background: active
                ? "linear-gradient(135deg, rgba(139,92,255,0.3) 0%, rgba(109,62,230,0.2) 100%)"
                : "rgba(255,255,255,0.05)",
              color: active ? "#E4D9FF" : "rgba(245,247,255,0.45)",
              fontSize: 13, fontWeight: active ? 600 : 400,
              boxShadow: active ? "0 0 18px rgba(139,127,191,0.35)" : "none",
              transition: "all 0.18s",
            }}
          >
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Places Carousel (Overview, small) ────────────────────────────────────────
function PlacesCarousel() {
  const [idx, setIdx] = useState(0);
  const place = PLACES[idx];

  // Auto-advance every 4 seconds
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PLACES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(245,247,255,0.4)", textTransform: "uppercase", margin: "0 0 14px" }}>
        PLACES I'VE BEEN
      </p>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 220, marginBottom: 14 }}>
        {PLACES.map((p, i) => (
          <img
            key={p.id}
            src={p.img}
            alt={p.name}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: i === idx ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,11,20,0.97) 0%, rgba(8,11,20,0.3) 55%, transparent 100%)" }} />

        <button onClick={() => setIdx(i => (i - 1 + PLACES.length) % PLACES.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(8,11,20,0.65)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={16} style={{ color: "#F5F7FF" }} />
        </button>
        <button onClick={() => setIdx(i => (i + 1) % PLACES.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(8,11,20,0.65)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronRight size={16} style={{ color: "#F5F7FF" }} />
        </button>

        <div style={{ position: "absolute", bottom: 14, left: 18 }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>{place.name}</p>
          <p style={{ fontSize: 10, color: "rgba(245,247,255,0.5)", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>{place.region}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14 }}>
        {PLACES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 999, border: "none", cursor: "pointer", background: i === idx ? "#8AA0FF" : "rgba(255,255,255,0.18)", transition: "all 0.25s" }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={place.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} style={{ textAlign: "center", padding: "0 10px" }}>
          <p style={{ fontSize: 14, fontStyle: "italic", color: "rgba(245,247,255,0.6)", margin: 0, lineHeight: 1.55 }}>"{place.quote}"</p>
          <p style={{ fontSize: 11, color: "rgba(245,247,255,0.35)", margin: "8px 0 0" }}>
            {place.adventures} adventure{place.adventures > 1 ? "s" : ""} &nbsp;•&nbsp; Last visited {place.lastVisited}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Places Carousel (Badges tab, large + thumbnails) ─────────────────────────
function PlacesCarouselLarge() {
  const [idx, setIdx] = useState(0);
  const place = PLACES[idx];
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PLACES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Scroll active thumb into view
  useEffect(() => {
    const container = thumbRef.current;
    if (!container) return;
    const thumb = container.children[idx] as HTMLElement;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [idx]);

  return (
    <div>
      {/* Section label */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(245,247,255,0.4)", textTransform: "uppercase", margin: "0 0 16px" }}>
        PLACES I'VE BEEN
      </p>

      {/* Main image */}
      <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", height: 310, marginBottom: 0 }}>
        {PLACES.map((p, i) => (
          <img
            key={p.id}
            src={p.img}
            alt={p.name}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: i === idx ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        ))}

        {/* Gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,11,20,1) 0%, rgba(8,11,20,0.45) 45%, rgba(8,11,20,0.1) 100%)" }} />

        {/* Nav arrows */}
        <button
          onClick={() => setIdx(i => (i - 1 + PLACES.length) % PLACES.length)}
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(8,11,20,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ChevronLeft size={18} style={{ color: "#F5F7FF" }} />
        </button>
        <button
          onClick={() => setIdx(i => (i + 1) % PLACES.length)}
          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(8,11,20,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ChevronRight size={18} style={{ color: "#F5F7FF" }} />
        </button>

        {/* Name + region overlay */}
        <div style={{ position: "absolute", bottom: 20, left: 22, right: 22 }}>
          <AnimatePresence mode="wait">
            <motion.div key={place.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <p style={{ fontSize: 30, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.035em", margin: 0, lineHeight: 1 }}>{place.name}</p>
              <p style={{ fontSize: 11, color: "rgba(245,247,255,0.55)", margin: "5px 0 0", textTransform: "uppercase", letterSpacing: "0.14em" }}>{place.region}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators top-right */}
        <div style={{ position: "absolute", top: 16, right: 18, display: "flex", gap: 5 }}>
          {PLACES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 999, border: "none", cursor: "pointer", background: i === idx ? "#fff" : "rgba(255,255,255,0.35)", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Quote + stats */}
      <AnimatePresence mode="wait">
        <motion.div key={`info-${place.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} style={{ padding: "18px 4px 0", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontStyle: "italic", color: "rgba(245,247,255,0.65)", margin: 0, lineHeight: 1.6 }}>
            "{place.quote}"
          </p>
          <p style={{ fontSize: 12, color: "rgba(245,247,255,0.32)", margin: "10px 0 0" }}>
            {place.adventures} adventure{place.adventures > 1 ? "s" : ""} &nbsp;·&nbsp; Last visited {place.lastVisited}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Thumbnail strip */}
      <div ref={thumbRef} style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2, marginTop: 20, scrollbarWidth: "none" }}>
        {PLACES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIdx(i)}
            style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 14, overflow: "hidden", border: i === idx ? "2px solid #8AA0FF" : "2px solid transparent", cursor: "pointer", position: "relative", transition: "border-color 0.25s", outline: "none" }}
          >
            <img src={p.img} alt={p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: i === idx ? 1 : 0.45, transition: "opacity 0.25s" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(8,11,20,0.85) 0%, transparent 100%)", padding: "4px 5px 5px" }}>
              <p style={{ fontSize: 7, fontWeight: 700, color: "#F5F7FF", margin: 0, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── PIK Rewards Modal ─────────────────────────────────────────────────────────
const EARN_CATEGORIES = [
  {
    id: "booking",
    label: "Booking",
    icon: "✈️",
    items: [
      { label: "Complete a trip",          desc: "Finish any booked PIK trip",                      pts: "+200 pts" },
      { label: "Host a group trip",        desc: "Organise a trip for 4+ members",                  pts: "+500 pts" },
      { label: "Book consecutive trips",   desc: "Two or more trips within 60 days",                pts: "+150 pts" },
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: "👥",
    items: [
      { label: "Refer a friend",           desc: "Earn when they complete their first booking",     pts: "+100 pts" },
      { label: "Create a Trip Card",       desc: "Share a beautifully designed trip recap",         pts: "+50 pts" },
      { label: "Write a destination review", desc: "Verified review on any PIK destination",        pts: "+25 pts" },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    icon: "🌍",
    items: [
      { label: "Complete your profile",    desc: "Photo, bio, travel style, and home base",         pts: "+75 pts" },
      { label: "Seal a PIK Capsule",       desc: "Time-lock a memory — opened within a year",       pts: "+30 pts" },
      { label: "Add a new destination",    desc: "Mark a new country on your travel map",           pts: "+15 pts" },
    ],
  },
  {
    id: "community",
    label: "Community",
    icon: "🏆",
    items: [
      { label: "Join a PIK Group",         desc: "Active member in any travel group",               pts: "+20 pts" },
      { label: "Monthly streak bonus",     desc: "Log in every day for a month",                    pts: "+100 pts" },
      { label: "Feature recommendation",  desc: "PIK-approved community contribution",              pts: "+250 pts" },
    ],
  },
];

function RewardsModal({ onClose }: { onClose: () => void }) {
  const [openCategory, setOpenCategory] = useState<string | null>("booking");
  const [howOpen, setHowOpen]           = useState(false);

  // Stardust particles — stable positions, varied character
  // type: "dust"=sharp tiny dot, "speck"=soft blurred glow, "glint"=micro twinkle
  const PARTICLES: { x: number; y: number; r: number; o: number; blur: number; type: "dust"|"speck"|"glint"; delay: number }[] = [
    { x: 8,  y: 12, r: 0.6, o: 0.85, blur: 0,   type: "glint", delay: 0    },
    { x: 28, y: 6,  r: 1.2, o: 0.45, blur: 1.5, type: "speck", delay: 0.4  },
    { x: 55, y: 10, r: 0.5, o: 0.7,  blur: 0,   type: "dust",  delay: 0.9  },
    { x: 75, y: 5,  r: 0.8, o: 0.55, blur: 0.8, type: "glint", delay: 0.2  },
    { x: 90, y: 18, r: 1.4, o: 0.35, blur: 2,   type: "speck", delay: 1.1  },
    { x: 18, y: 35, r: 0.4, o: 0.6,  blur: 0,   type: "dust",  delay: 0.6  },
    { x: 44, y: 28, r: 0.9, o: 0.4,  blur: 1.2, type: "speck", delay: 1.5  },
    { x: 65, y: 32, r: 0.5, o: 0.75, blur: 0,   type: "glint", delay: 0.3  },
    { x: 85, y: 42, r: 0.7, o: 0.5,  blur: 0.6, type: "dust",  delay: 0.8  },
    { x: 5,  y: 55, r: 1.0, o: 0.3,  blur: 1.8, type: "speck", delay: 1.8  },
    { x: 32, y: 58, r: 0.4, o: 0.65, blur: 0,   type: "dust",  delay: 0.1  },
    { x: 60, y: 52, r: 1.1, o: 0.38, blur: 1.4, type: "speck", delay: 1.3  },
    { x: 80, y: 60, r: 0.5, o: 0.58, blur: 0,   type: "glint", delay: 0.7  },
    { x: 22, y: 72, r: 0.3, o: 0.45, blur: 0,   type: "dust",  delay: 2.0  },
    { x: 95, y: 68, r: 0.8, o: 0.32, blur: 1.0, type: "speck", delay: 0.5  },
    { x: 48, y: 78, r: 0.6, o: 0.5,  blur: 0,   type: "glint", delay: 1.6  },
    { x: 70, y: 75, r: 0.4, o: 0.4,  blur: 0,   type: "dust",  delay: 0.15 },
    { x: 12, y: 88, r: 1.3, o: 0.28, blur: 2.2, type: "speck", delay: 1.0  },
  ];

  return createPortal(
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "#080B14", overflowY: "auto" }}
    >
      <style>{`
        @keyframes dust-twinkle {
          0%, 100% { opacity: var(--p-o); }
          45%      { opacity: calc(var(--p-o) * 0.12); }
          55%      { opacity: calc(var(--p-o) * 0.08); }
        }
        @keyframes dust-drift {
          0%, 100% { transform: translate(0,0); opacity: var(--p-o); }
          50%      { transform: translate(0.6px,-1.2px); opacity: calc(var(--p-o)*0.7); }
        }
        @keyframes rewards-halo {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 0.8;  transform: scale(1.06); }
        }
      `}</style>

      {/* Cinematic header */}
      <div style={{
        position: "relative", padding: "52px 20px 28px",
        background: "linear-gradient(180deg, rgba(26,18,0,0.95) 0%, rgba(8,11,20,0) 100%)",
        overflow: "hidden",
      }}>
        {/* Glow halo */}
        <div style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          width: 280, height: 140,
          background: "radial-gradient(ellipse, rgba(212,168,71,0.28) 0%, rgba(212,168,71,0.08) 45%, transparent 70%)",
          filter: "blur(18px)",
          animation: "rewards-halo 3.5s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Stardust particle field — no star shapes, only ambient dust and soft glows */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Soft glow filter for speck particles */}
            <filter id="dust-glow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="0.8" in="SourceGraphic" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="speck-blur" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="1.4" in="SourceGraphic" />
            </filter>
          </defs>
          {PARTICLES.map((p, i) => {
            const baseColor = i % 3 === 0 ? "#F5E080" : i % 3 === 1 ? "#F0C040" : "#E8B830";
            if (p.type === "speck") {
              return (
                <circle key={i} cx={p.x} cy={p.y} r={p.r * 2.2}
                  fill={baseColor}
                  filter="url(#speck-blur)"
                  style={{
                    ["--p-o" as string]: p.o,
                    opacity: p.o,
                    animation: `dust-drift ${5 + i * 0.6}s ease-in-out infinite`,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties}
                />
              );
            }
            if (p.type === "glint") {
              return (
                <circle key={i} cx={p.x} cy={p.y} r={p.r}
                  fill={baseColor}
                  filter="url(#dust-glow)"
                  style={{
                    ["--p-o" as string]: p.o,
                    opacity: p.o,
                    animation: `dust-twinkle ${3.2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties}
                />
              );
            }
            // dust — tiny sharp dot, nearly static
            return (
              <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.7}
                fill={baseColor}
                style={{
                  ["--p-o" as string]: p.o,
                  opacity: p.o,
                  animation: `dust-drift ${8 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              />
            );
          })}
        </svg>

        {/* Title row */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", color: GOLD, textTransform: "uppercase", margin: "0 0 6px" }}>PIK REWARDS</p>
            <h2 style={{
              fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.04em", lineHeight: 1,
              background: GOLD_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 14px rgba(212,168,71,0.6)) drop-shadow(0 0 32px rgba(240,192,64,0.3))`,
            }}>
              Your Rewards
            </h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <X size={16} style={{ color: "#F5F7FF" }} />
          </motion.button>
        </div>
      </div>

      <div style={{ padding: "0 20px 120px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Points balance card */}
        <div style={{
          borderRadius: 22, padding: "24px 22px",
          background: "linear-gradient(135deg, rgba(212,168,71,0.15) 0%, rgba(123,92,255,0.1) 100%)",
          border: "1.5px solid rgba(212,168,71,0.3)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,168,71,0.18) 0%, transparent 70%)",
            filter: "blur(16px)", pointerEvents: "none",
          }} />
          <p style={{ fontSize: 9, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 10px" }}>YOUR BALANCE</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#F5F7FF", letterSpacing: "-0.05em", lineHeight: 1 }}>2,840</span>
            <span style={{ fontSize: 16, color: "rgba(245,247,255,0.45)", fontWeight: 500 }}>pts</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(212,168,71,0.8)", margin: "0 0 6px" }}>
            Estimated value: up to $28.40 in PIK travel rewards
          </p>
          <p style={{ fontSize: 10, color: "rgba(245,247,255,0.3)", margin: "0 0 20px", lineHeight: 1.5 }}>
            Rewards apply to eligible trips and may be limited per booking.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Lifetime Points", val: "4,120" },
              { label: "Next Milestone",  val: "5,000" },
            ].map(({ label, val }) => (
              <div key={label} style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 14px" }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{val}</p>
                <p style={{ fontSize: 10, color: "rgba(245,247,255,0.4)", margin: "2px 0 0" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How Rewards Work — expandable */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden" }}>
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() => setHowOpen(v => !v)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} style={{ color: GOLD }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF" }}>How Rewards Work</span>
            </div>
            <motion.div animate={{ rotate: howOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={14} style={{ color: "rgba(245,247,255,0.4)" }} />
            </motion.div>
          </motion.button>
          <AnimatePresence initial={false}>
            {howOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { step: "01", title: "Earn Points", body: "Complete trips, engage with the community, and hit milestones to earn PIK Rewards points." },
                    { step: "02", title: "Accumulate Value", body: "Points accumulate over time. 1,000 points = estimated $10 in potential travel value, subject to redemption rules." },
                    { step: "03", title: "Redeem on Eligible Bookings", body: "Apply points at checkout on qualifying PIK trips. Redemption may be capped per booking and is subject to availability." },
                    { step: "04", title: "Points Stay Active", body: "Your balance remains active while your account remains in good standing." },
                  ].map(({ step, title, body }) => (
                    <div key={step} style={{ display: "flex", gap: 12, paddingTop: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, background: "rgba(212,168,71,0.12)",
                        border: "1px solid rgba(212,168,71,0.3)", display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: GOLD, letterSpacing: "0.05em" }}>{step}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: "0 0 3px" }}>{title}</p>
                        <p style={{ fontSize: 12, color: "rgba(245,247,255,0.45)", margin: 0, lineHeight: 1.55 }}>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ways to Earn More — accordion by category */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <TrendingUp size={14} style={{ color: GOLD }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>Ways to Earn More</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {EARN_CATEGORIES.map(cat => {
              const isOpen = openCategory === cat.id;
              return (
                <div key={cat.id} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, overflow: "hidden",
                }}>
                  <motion.button
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{cat.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF" }}>{cat.label}</span>
                      <span style={{ fontSize: 10, color: "rgba(245,247,255,0.3)", fontWeight: 500 }}>
                        {cat.items.length} ways
                      </span>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight size={14} style={{ color: "rgba(245,247,255,0.4)" }} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                          {cat.items.map((item, i) => (
                            <div
                              key={item.label}
                              style={{
                                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                                padding: "12px 16px", gap: 12,
                                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(245,247,255,0.85)", margin: "0 0 3px" }}>{item.label}</p>
                                <p style={{ fontSize: 11, color: "rgba(245,247,255,0.35)", margin: 0, lineHeight: 1.45 }}>{item.desc}</p>
                              </div>
                              <div style={{
                                background: "rgba(212,168,71,0.12)", border: "1px solid rgba(212,168,71,0.28)",
                                borderRadius: 999, padding: "4px 10px", flexShrink: 0, whiteSpace: "nowrap",
                              }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: GOLD }}>{item.pts}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 10, color: "rgba(245,247,255,0.25)", textAlign: "center", lineHeight: 1.65, margin: 0, paddingInline: 8 }}>
          PIK Rewards are not cash and hold no guaranteed monetary value. Redemption is subject to eligibility requirements, booking availability, and PIK's terms of service. Value estimates are illustrative and may vary.
        </p>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "16px 20px max(env(safe-area-inset-bottom),20px)",
        background: "linear-gradient(to top, rgba(8,11,20,1) 0%, rgba(8,11,20,0.95) 70%, transparent 100%)",
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%", height: 52, borderRadius: 999, border: "none", cursor: "pointer",
            background: GOLD_GRAD, fontSize: 15, fontWeight: 700, color: "#1A1200",
            boxShadow: "0 4px 24px rgba(212,168,71,0.45)",
          }}
        >
          View Redemption Options
        </motion.button>
        <p style={{ fontSize: 10, color: "rgba(245,247,255,0.3)", textAlign: "center", margin: "8px 0 0", lineHeight: 1.5 }}>
          You'll see available reward usage before completing your booking.
        </p>
      </div>
    </motion.div>,
    document.body
  );
}

// ── Tier Modal ────────────────────────────────────────────────────────────────
function TierModal({ currentTier, onClose, onSelect }: {
  currentTier: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [selected, setSelected] = useState(currentTier);
  const TIER_ICONS = { free: Zap, explorer: Sparkles, elite: Crown };

  return createPortal(
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "#080B14", overflowY: "auto" }}
    >
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 1, background: "rgba(8,11,20,0.96)", backdropFilter: "blur(16px)", padding: "52px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>Choose Your Plan</h2>
            <p style={{ fontSize: 13, color: "rgba(245,247,255,0.4)", margin: "4px 0 0" }}>Select a tier to subscribe. Tiers are purchase-based.</p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <X size={16} style={{ color: "#F5F7FF" }} />
          </motion.button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 120px", display: "flex", flexDirection: "column", gap: 14 }}>
        {TIERS.map(tier => {
          const Icon = TIER_ICONS[tier.id as keyof typeof TIER_ICONS];
          const isSelected = selected === tier.id;
          const isCurrent = currentTier === tier.id;

          return (
            <motion.button
              key={tier.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(tier.id)}
              style={{
                width: "100%", textAlign: "left", borderRadius: 22, padding: "20px",
                background: isSelected ? `linear-gradient(135deg, ${tier.color}20, ${tier.color}08)` : "rgba(255,255,255,0.04)",
                border: isSelected ? `2px solid ${tier.color}70` : "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer", position: "relative",
                boxShadow: isSelected ? `0 0 28px ${tier.color}20` : "none",
                transition: "all 0.2s",
              }}
            >
              {tier.popular && (
                <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: LOGO_GRAD, borderRadius: 999, padding: "4px 14px", fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}

              {/* Header row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: `${tier.color}18`, border: `1px solid ${tier.color}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} style={{ color: tier.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{tier.name}</p>
                    {isCurrent && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#6BFFAA", background: "rgba(107,255,170,0.12)", borderRadius: 999, padding: "2px 8px", letterSpacing: "0.1em", display: "inline-block", marginTop: 3 }}>
                        ✓ CURRENT PLAN
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color: tier.color, letterSpacing: "-0.04em", margin: 0, lineHeight: 1 }}>{tier.price}</p>
                  <p style={{ fontSize: 11, color: "rgba(245,247,255,0.4)", margin: "2px 0 0" }}>{tier.period || "free forever"}</p>
                </div>
              </div>

              {/* Feature divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${tier.color}30, transparent)`, marginBottom: 14 }} />

              {/* Included features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                    <div style={{ width: 17, height: 17, borderRadius: "50%", background: `${tier.color}22`, border: `1px solid ${tier.color}45`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={9} style={{ color: tier.color }} />
                    </div>
                    <span style={{ fontSize: 12.5, color: "rgba(245,247,255,0.78)", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
                {tier.locked.length > 0 && (
                  <>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                    {tier.locked.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <div style={{ width: 17, height: 17, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          <X size={8} style={{ color: "rgba(255,255,255,0.2)" }} />
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(245,247,255,0.22)" }}>{f}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Sticky CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px max(env(safe-area-inset-bottom),20px)", background: "linear-gradient(to top, rgba(8,11,20,1) 0%, rgba(8,11,20,0.95) 80%, transparent 100%)" }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { onSelect(selected); onClose(); }}
          style={{ width: "100%", height: 54, borderRadius: 999, border: "none", cursor: "pointer", background: selected === "elite" ? GOLD_GRAD : LOGO_GRAD, fontSize: 15, fontWeight: 700, color: selected === "elite" ? "#1A1200" : "#fff", boxShadow: selected === "elite" ? "0 4px 24px rgba(212,168,71,0.5)" : "0 4px 24px rgba(123,92,255,0.5)", letterSpacing: "0.01em" }}
        >
          {selected === currentTier ? "Keep Current Plan" : `Switch to ${TIERS.find(t => t.id === selected)?.name}`}
        </motion.button>
      </div>
    </motion.div>,
    document.body
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProfileTab({ onVarixOpen }: Props) {
  const [subTab, setSubTab]           = useState<ProfileSubTab>("overview");
  const [prefs, setPrefs]             = useState<Record<string, string[]>>(DEFAULT_PREFS);
  const [prefsDirty, setPrefsDirty]   = useState(false);
  const [notifs, setNotifs]           = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_TOGGLES.map(n => [n.key, true]))
  );
  const [currentTier, setCurrentTier] = useState("explorer");
  const [tierModalOpen, setTierModalOpen]       = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);

  const togglePref = (group: string, val: string, multi: boolean) => {
    setPrefs(prev => {
      const cur = prev[group] ?? [];
      const next = multi
        ? cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]
        : [val];
      return { ...prev, [group]: next };
    });
    setPrefsDirty(true);
  };

  const tierInfo = TIERS.find(t => t.id === currentTier)!;

  return (
    <>
    <div style={{ background: "#080B14", minHeight: "100%", paddingBottom: 120 }}>

      {/* ── PROFILE PASSPORT HERO ────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>

        {/* Warm gradient atmosphere — deep indigo-to-dark, gives the hero visual depth */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #0D0E22 0%, #0A0C1A 45%, #080B14 100%)",
        }} />

        {/* Violet crown glow — above the avatar, creates aura and prestige */}
        <div style={{
          position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
          width: 360, height: 260,
          background: "radial-gradient(ellipse at 50% 30%, rgba(123,92,255,0.22) 0%, rgba(91,56,204,0.08) 45%, transparent 72%)",
          filter: "blur(36px)", pointerEvents: "none",
        }} />

        {/* Gold warmth — under the avatar, identity and prestige */}
        <div style={{
          position: "absolute", top: 140, left: "50%", transform: "translateX(-50%)",
          width: 220, height: 160,
          background: "radial-gradient(ellipse, rgba(212,168,71,0.13) 0%, transparent 68%)",
          filter: "blur(28px)", pointerEvents: "none",
        }} />

        {/* Bottom fade into sub-tab content */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "linear-gradient(to bottom, transparent 0%, #080B14 100%)",
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", padding: "56px 20px 28px", textAlign: "center" }}>

          {/* PIK PASSPORT eyebrow */}
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.36em", color: GOLD,
            textTransform: "uppercase", margin: "0 0 22px",
          }}>
            PIK PASSPORT
          </p>

          {/* Medallion avatar — one gold ring, properly visible */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 18 }}>
            {/* Outer gold ring with glow */}
            <div style={{
              position: "absolute", inset: -5, borderRadius: "50%",
              border: "1.5px solid rgba(212,168,71,0.55)",
              boxShadow: "0 0 22px rgba(212,168,71,0.2), 0 0 48px rgba(123,92,255,0.15)",
            }} />
            {/* Avatar */}
            <div style={{
              width: 92, height: 92, borderRadius: "50%", background: LOGO_GRAD,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 27, fontWeight: 700, color: "#fff",
              boxShadow: "0 10px 36px rgba(0,0,0,0.55)",
            }}>
              {currentUser.avatar}
            </div>
            {/* Edit button */}
            <motion.button whileTap={{ scale: 0.9 }} style={{
              position: "absolute", bottom: 2, right: 2,
              width: 27, height: 27, borderRadius: "50%", background: LOGO_GRAD,
              border: "2.5px solid #080B14", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
            }}>
              <Edit2 size={11} style={{ color: "#fff" }} />
            </motion.button>
          </div>

          {/* Name + verified badge */}
          <h2 style={{
            fontSize: 24, fontWeight: 800, color: "#F5F7FF",
            letterSpacing: "-0.03em", margin: "0 0 5px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {currentUser.name}
            <span
              aria-label="Verified PIK user"
              title="Verified PIK user"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 20, height: 20, borderRadius: "50%",
                background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
                boxShadow: "0 0 10px rgba(77,163,255,0.5)",
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5L4.2 7.8L9 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </h2>

          {/* Handle */}
          <p style={{ fontSize: 12, color: "#8AA0FF", margin: "0 0 5px" }}>
            @{currentUser.name.toLowerCase().replace(" ", ".")}
          </p>

          {/* Location */}
          <p style={{
            fontSize: 11, color: "rgba(245,247,255,0.4)", margin: "0 0 12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <MapPin size={9} /> {currentUser.location}
          </p>

          {/* Credential narrative — the emotional identity line */}
          <p style={{
            fontSize: 13, color: "rgba(245,247,255,0.5)", margin: "0 auto 16px",
            fontStyle: "italic", lineHeight: 1.6, maxWidth: 275,
          }}>
            Explorer of {currentUser.stats.countries} countries,&nbsp;
            {currentUser.stats.trips} trips, and {currentUser.stats.hosted} hosted adventures.
          </p>

          {/* Tier badge */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTierModalOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: `linear-gradient(120deg, ${tierInfo.color}1A, ${tierInfo.color}0A)`,
              border: `1px solid ${tierInfo.color}50`,
              borderRadius: 999, padding: "7px 18px", cursor: "pointer",
              boxShadow: `0 2px 18px ${tierInfo.color}18`,
            }}
          >
            <Star size={11} style={{ color: tierInfo.color }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: tierInfo.color,
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>
              {tierInfo.name}
            </span>
            <ChevronRight size={10} style={{ color: tierInfo.color, opacity: 0.65 }} />
          </motion.button>

          {/* Social proof stats — followers/following */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 20 }}>
            {[
              { val: currentUser.followers.toLocaleString(), label: "Followers" },
              { val: currentUser.following.toString(),       label: "Following" },
            ].map(({ val, label }, i) => (
              <div key={label} style={{
                textAlign: "center", paddingInline: 28,
                borderRight: i === 0 ? "1px solid rgba(255,255,255,0.09)" : "none",
              }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#F5F7FF", margin: 0, letterSpacing: "-0.025em" }}>
                  {val}
                </p>
                <p style={{ fontSize: 9, color: "rgba(245,247,255,0.38)", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SUB-TAB ROW ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px" }}>
          {(["overview", "preferences", "badges", "settings"] as ProfileSubTab[]).map(t => {
            const labels = { overview: "Overview", preferences: "Preferences", badges: "Places", settings: "Settings" };
            const active = subTab === t;
            return (
              <motion.button
                key={t} whileTap={{ scale: 0.95 }}
                onClick={() => setSubTab(t)}
                style={{ flex: 1, height: 32, borderRadius: 10, border: "none", cursor: "pointer", background: active ? "rgba(123,92,255,0.28)" : "transparent", color: active ? "#C4DAFF" : "rgba(245,247,255,0.4)", fontSize: 11, fontWeight: active ? 700 : 500, outline: active ? "1px solid rgba(123,92,255,0.45)" : "none", outlineOffset: -1, transition: "all 0.15s" }}
              >
                {labels[t]}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: EASE }}
          style={{ padding: "0 20px" }}
        >

          {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
          {subTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Lifetime stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { val: currentUser.stats.trips,     label: "Trips",    color: "#C4DAFF" },
                  { val: currentUser.stats.countries,  label: "Countries", color: GOLD      },
                  { val: currentUser.stats.hosted,     label: "Hosted",   color: "#8AA0FF" },
                ].map(({ val, label, color }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: "-0.03em", margin: 0, lineHeight: 1 }}>{val}</p>
                    <p style={{ fontSize: 9, color: "rgba(245,247,255,0.38)", margin: "5px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Places carousel (small) */}
              <PlacesCarousel />

              {/* Quick access */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                {[
                  { icon: Bookmark,   label: "Saved Trips",       sub: "Your wishlist"              },
                  { icon: Gift,       label: "PIK Rewards",        sub: "2,840 pts · $28.40 credit",  action: () => setRewardsModalOpen(true) },
                  { icon: CreditCard, label: "Subscription",       sub: `${tierInfo.name} · Active`, action: () => setTierModalOpen(true) },
                  { icon: Wallet,     label: "Wallet & Documents", sub: "Passes, vouchers, tickets"  },
                  { icon: Settings,   label: "Settings",           sub: "Account & preferences",     action: () => setSubTab("settings") },
                ].map(({ icon: Icon, label, sub, action }, i) => (
                  <motion.button
                    key={label} whileTap={{ scale: 0.99 }}
                    onClick={action ?? undefined}
                    style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: action ? "pointer" : "default", display: "flex", alignItems: "center", gap: 14, textAlign: "left", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  >
                    <Icon size={17} style={{ color: "#8AA0FF", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F7FF", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 10, color: "rgba(245,247,255,0.38)", margin: "1px 0 0" }}>{sub}</p>
                    </div>
                    {action && <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ── PREFERENCES ───────────────────────────────────────────────── */}
          {subTab === "preferences" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 24 }}>
              {PREF_GROUPS.map(group => (
                <div key={group.key}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: "0 0 10px" }}>{group.label}</p>
                  <ChipGroup options={group.options} selected={prefs[group.key] ?? []} multi={group.multi} onToggle={v => togglePref(group.key, v, group.multi)} />
                </div>
              ))}
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{ width: "100%", height: 50, borderRadius: 999, border: "none", cursor: "pointer", background: prefsDirty ? LOGO_GRAD : "rgba(255,255,255,0.06)", fontSize: 15, fontWeight: 700, color: prefsDirty ? "#fff" : "rgba(245,247,255,0.25)", transition: "all 0.2s", boxShadow: prefsDirty ? "0 4px 24px rgba(123,92,255,0.4)" : "none" }}
                onClick={() => setPrefsDirty(false)}
              >
                Save Preferences
              </motion.button>
              <p style={{ fontSize: 12, color: "rgba(245,247,255,0.3)", textAlign: "center", margin: "-10px 0 0", lineHeight: 1.5 }}>
                Your preferences help Varix curate personalized trip recommendations.
              </p>
            </div>
          )}

          {/* ── PLACES / BADGES ───────────────────────────────────────────── */}
          {subTab === "badges" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 24 }}>
              {/* Large auto-cycling image carousel */}
              <PlacesCarouselLarge />

              {/* Achievements */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,247,255,0.4)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.15em" }}>ACHIEVEMENTS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ACHIEVEMENTS.map(ach => (
                    <div key={ach.name} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: ach.earned ? "rgba(212,168,71,0.15)" : "rgba(255,255,255,0.04)", border: ach.earned ? "1px solid rgba(212,168,71,0.4)" : "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, filter: ach.earned ? "none" : "grayscale(1) opacity(0.3)" }}>
                        {ach.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{ach.name}</p>
                        <p style={{ fontSize: 10, color: "rgba(245,247,255,0.4)", margin: "2px 0 0" }}>{ach.desc}</p>
                      </div>
                      {ach.earned
                        ? <span style={{ fontSize: 10, fontWeight: 700, color: "#6BFFAA", background: "rgba(107,255,170,0.12)", borderRadius: 999, padding: "3px 9px", flexShrink: 0 }}>Earned</span>
                        : ach.progress
                          ? <span style={{ fontSize: 10, fontWeight: 600, color: "#8AA0FF", flexShrink: 0 }}>{ach.progress}</span>
                          : null
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Earned country badges */}
              <div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(245,247,255,0.55)", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>Country Stamps</p>
                  <span style={{ fontSize: 11, color: GOLD }}>{EARNED_BADGES.length} earned</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {EARNED_BADGES.map(badge => (
                    <motion.div key={badge.country} whileTap={{ scale: 0.95 }} style={{ aspectRatio: "1", borderRadius: 16, background: "linear-gradient(135deg, rgba(212,168,71,0.14), rgba(123,92,255,0.12))", border: "1px solid rgba(212,168,71,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
                      <span style={{ fontSize: 22 }}>{badge.flag}</span>
                      <p style={{ fontSize: 8, fontWeight: 700, color: "#C4DAFF", margin: 0, textAlign: "center", lineHeight: 1.2 }}>{badge.country}</p>
                      <p style={{ fontSize: 7, color: GOLD, margin: 0 }}>{badge.trips} trip{badge.trips > 1 ? "s" : ""}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ──────────────────────────────────────────────────── */}
          {subTab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 24 }}>

              {/* Subscription */}
              <div style={{ background: `linear-gradient(135deg, ${tierInfo.color}14, ${tierInfo.color}06)`, border: `1px solid ${tierInfo.color}30`, borderRadius: 18, padding: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: tierInfo.color, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>SUBSCRIPTION</p>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{tierInfo.name}</p>
                    <p style={{ fontSize: 12, color: "rgba(245,247,255,0.5)", margin: "2px 0 0" }}>{tierInfo.price}{tierInfo.period} · Renews June 1, 2026</p>
                  </div>
                  <Star size={22} style={{ color: tierInfo.color }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setTierModalOpen(true)} style={{ flex: 1, height: 40, borderRadius: 999, border: "none", cursor: "pointer", background: currentTier === "elite" ? "rgba(255,255,255,0.07)" : GOLD_GRAD, fontSize: 13, fontWeight: 700, color: currentTier === "elite" ? "rgba(245,247,255,0.4)" : "#1A1200" }}>
                    {currentTier === "elite" ? "On Best Plan" : "Upgrade Plan"}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setTierModalOpen(true)} style={{ height: 40, paddingLeft: 16, paddingRight: 16, borderRadius: 999, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12, fontWeight: 500, color: "rgba(245,247,255,0.5)" }}>
                    View All Plans
                  </motion.button>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,247,255,0.4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>NOTIFICATIONS</p>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                  {NOTIF_TOGGLES.map((n, i) => (
                    <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <p style={{ fontSize: 13, color: "#F5F7FF", margin: 0 }}>{n.label}</p>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                        style={{ width: 44, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: notifs[n.key] ? LOGO_GRAD : "rgba(255,255,255,0.1)", position: "relative", flexShrink: 0, transition: "background 0.2s" }}
                      >
                        <motion.div
                          animate={{ x: notifs[n.key] ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          style={{ position: "absolute", top: 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                        />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,247,255,0.4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>PRIVACY</p>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                  {[
                    { label: "Profile visibility",  sub: "Public"          },
                    { label: "Share itineraries",   sub: "Enabled"         },
                    { label: "Booking activity",    sub: "Followers only"  },
                  ].map(({ label, sub }, i) => (
                    <motion.button key={label} whileTap={{ scale: 0.99 }} style={{ width: "100%", padding: "13px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <p style={{ fontSize: 13, color: "#F5F7FF", margin: 0 }}>{label}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: "#8AA0FF" }}>{sub}</span>
                        <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,247,255,0.4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>ACCOUNT</p>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                  {[
                    { label: "Change Email",       sub: "alex.rivera@gmail.com"     },
                    { label: "Change Password",    sub: "Last changed 3 months ago" },
                    { label: "Connected Accounts", sub: "Apple, Google"             },
                  ].map(({ label, sub }, i) => (
                    <motion.button key={label} whileTap={{ scale: 0.99 }} style={{ width: "100%", padding: "13px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div>
                        <p style={{ fontSize: 13, color: "#F5F7FF", margin: 0 }}>{label}</p>
                        <p style={{ fontSize: 10, color: "rgba(245,247,255,0.35)", margin: "2px 0 0" }}>{sub}</p>
                      </div>
                      <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
                {["Terms of Service", "Privacy Policy", "Open Source Licenses"].map((label, i) => (
                  <motion.button key={label} whileTap={{ scale: 0.99 }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ fontSize: 12, color: "rgba(245,247,255,0.4)" }}>{label}</span>
                    <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.15)" }} />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>

    {/* Modals rendered into document.body via portals — bypass transform stacking context */}
    <AnimatePresence>
      {tierModalOpen && (
        <TierModal
          key="tier-modal"
          currentTier={currentTier}
          onClose={() => setTierModalOpen(false)}
          onSelect={id => setCurrentTier(id)}
        />
      )}
    </AnimatePresence>

    <AnimatePresence>
      {rewardsModalOpen && (
        <RewardsModal
          key="rewards-modal"
          onClose={() => setRewardsModalOpen(false)}
        />
      )}
    </AnimatePresence>
    </>
  );
}
