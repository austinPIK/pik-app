import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Bookmark, BookmarkCheck, Share2, ChevronRight, UserPlus, Check, MapPin, Calendar, ArrowLeft, X } from "lucide-react";
import { currentUser } from "@/data/mock";
import type { TabId } from "@/pages/AppView";

interface Props {
  onTabChange?: (t: TabId) => void;
  onVarixOpen?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const LOGO_GRAD = "linear-gradient(135deg, #D4E8FB 0%, #9DC2F6 30%, #6B9FEE 55%, #8C87F4 75%, #B99CF9 100%)";
const GOLD = "#D4A847";

const BADGE_GRAD_ID = "pik-verified-grad";

function PikVerifiedBadge({ label = "Verified PIK user" }: { label?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
      role="img"
      style={{
        flexShrink: 0,
        filter: "drop-shadow(0 0 4px rgba(180,140,255,0.55)) drop-shadow(0 0 8px rgba(212,168,71,0.28))",
      }}
    >
      <title>{label}</title>
      <defs>
        <linearGradient id={BADGE_GRAD_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#D4E8FB" />
          <stop offset="30%"  stopColor="#9DC2F6" />
          <stop offset="55%"  stopColor="#6B9FEE" />
          <stop offset="75%"  stopColor="#8C87F4" />
          <stop offset="100%" stopColor="#B99CF9" />
        </linearGradient>
      </defs>
      {/* Shield / rounded-star shape */}
      <path
        d="M9 1.5 L11.18 3.82 L14.25 3.75 L14.18 6.82 L16.5 9 L14.18 11.18 L14.25 14.25 L11.18 14.18 L9 16.5 L6.82 14.18 L3.75 14.25 L3.82 11.18 L1.5 9 L3.82 6.82 L3.75 3.75 L6.82 3.82 Z"
        fill={`url(#${BADGE_GRAD_ID})`}
      />
      {/* Checkmark */}
      <path
        d="M6.2 9.1 L8.0 10.9 L11.8 7.1"
        stroke="#06080F"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Trending itinerary cards (Feature 29) ─────────────────────────────────────

const ITINERARY_CARDS = [
  {
    id: "ic1",
    creator: { name: "Sofia Chen",    handle: "@sofiaexplores",  avatar: "SC", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=75" },
    destination: "Patagonia, Argentina",
    title: "11 Days at the End of the World",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    likes: 1284, saves: 347, bookings: 62,
    caption: "Nothing prepares you for the scale of Torres del Paine. We hiked, we cried, we went back.",
    category: "Adventure",
  },
  {
    id: "ic2",
    creator: { name: "Marcus Webb",   handle: "@marcusroams",    avatar: "MW", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=75" },
    destination: "Kyoto, Japan",
    title: "7 Days of Ancient Silence",
    img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    likes: 2103, saves: 589, bookings: 91,
    caption: "The bamboo grove at 5am. No one else there. That's the whole trip right there.",
    category: "Cultural",
  },
  {
    id: "ic3",
    creator: { name: "Priya Nair",    handle: "@priya.wanders",  avatar: "PN", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=75" },
    destination: "Amalfi Coast, Italy",
    title: "A Week of Dolce Vita",
    img: "https://images.unsplash.com/photo-1555990538-c4fb98bd3f9e?w=800&q=80",
    likes: 876, saves: 214, bookings: 38,
    caption: "Limoncello at sunset over the Tyrrhenian Sea. I've retired from regular travel.",
    category: "Wellness",
  },
  {
    id: "ic4",
    creator: { name: "Jordan Lee",    handle: "@jordanleelive",  avatar: "JL", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=75" },
    destination: "Maldives",
    title: "10 Nights Above the Lagoon",
    img: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80",
    likes: 3421, saves: 892, bookings: 147,
    caption: "Woke up and snorkeled off my deck before breakfast. Every. Single. Morning.",
    category: "Honeymoon",
  },
];

// ── Top Hosts (Feature 37) ────────────────────────────────────────────────────

const TOP_HOSTS = [
  {
    id: "h1", name: "Elena Vasquez", handle: "@elenaexplores", avatar: "EV",
    tripsHosted: 47, travelersHosted: 312, topDest: "Patagonia",
    rating: 4.98, reviews: 289,
    recentImg: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=75",
  },
  {
    id: "h2", name: "David Kim",    handle: "@davidkimtravel", avatar: "DK",
    tripsHosted: 31, travelersHosted: 198, topDest: "Southeast Asia",
    rating: 4.95, reviews: 174,
    recentImg: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&q=75",
  },
  {
    id: "h3", name: "Amara Osei",   handle: "@amaraadventures", avatar: "AO",
    tripsHosted: 24, travelersHosted: 156, topDest: "East Africa",
    rating: 4.97, reviews: 132,
    recentImg: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&q=75",
  },
  {
    id: "h4", name: "Luca Ferrari",  handle: "@lucaontheroad",  avatar: "LF",
    tripsHosted: 19, travelersHosted: 124, topDest: "Mediterranean",
    rating: 4.93, reviews: 98,
    recentImg: "https://images.unsplash.com/photo-1555990538-c4fb98bd3f9e?w=300&q=75",
  },
];

// ── Travelers (Feature 40) ────────────────────────────────────────────────────

const TRAVELERS = [
  { id: "t1", name: "Maya Rodriguez", handle: "@mayaroams",   avatar: "MR", countries: 34, trips: 28, followers: "4.2K", recentImg: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=75" },
  { id: "t2", name: "James Park",     handle: "@jamesparkt",  avatar: "JP", countries: 22, trips: 19, followers: "2.8K", recentImg: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&q=75" },
  { id: "t3", name: "Aisha Musa",     handle: "@aishawanders", avatar: "AM", countries: 41, trips: 37, followers: "6.1K", recentImg: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&q=75" },
  { id: "t4", name: "Tom Erikson",    handle: "@tomerik",     avatar: "TE", countries: 18, trips: 14, followers: "1.5K", recentImg: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=75" },
];

// ── Full itinerary detail days (Feature 35) ───────────────────────────────────

const FULL_ITINERARY_DAYS = [
  { day: 1, location: "Punta Arenas, Chile", activity: "Arrival & City Walk",                duration: "Full day", cost: "Included"   },
  { day: 2, location: "Puerto Natales",      activity: "Transfer & Gear Setup",              duration: "Full day", cost: "$80/person"  },
  { day: 3, location: "Torres del Paine",    activity: "W Circuit Day 1 — Mirador Base",    duration: "8 hrs",    cost: "Included"   },
  { day: 4, location: "Valle del Francés",   activity: "W Circuit Day 2 — Glacier viewpoints", duration: "9 hrs", cost: "Included"   },
  { day: 5, location: "Grey Glacier",        activity: "Ice Trek & Kayak",                  duration: "7 hrs",    cost: "$120/person" },
];

type SocialFilter = "trending" | "hosts" | "travelers";

type ItineraryCard = typeof ITINERARY_CARDS[number];

export function SocialTab({ onVarixOpen }: Props) {
  const [filter, setFilter]           = useState<SocialFilter>("trending");
  const [search, setSearch]           = useState("");
  const [liked, setLiked]             = useState<Set<string>>(new Set());
  const [saved, setSaved]             = useState<Set<string>>(new Set());
  const [followed, setFollowed]       = useState<Set<string>>(new Set());
  const [selectedCard, setSelectedCard] = useState<ItineraryCard | null>(null);

  const toggleLike   = (id: string) => setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSave   = (id: string) => setSaved(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFollow = (id: string) => setFollowed(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div style={{ background: "#080B14", minHeight: "100%", paddingBottom: 120, position: "relative" }}>

      {/* ── FEATURE 35: FULL ITINERARY DETAIL OVERLAY ────────────────────────── */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            key="itinerary-detail"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.42, ease: EASE }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "#080B14", overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Hero image */}
            <div style={{ position: "relative", height: 240, flexShrink: 0 }}>
              <img
                src={selectedCard.img}
                alt={selectedCard.destination}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(8,11,20,0.9) 0%, rgba(8,11,20,0.3) 60%, rgba(8,11,20,0.55) 100%)",
              }} />

              {/* Back button */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setSelectedCard(null)}
                style={{
                  position: "absolute", top: 52, left: 16,
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(8,11,20,0.65)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={16} style={{ color: "#F5F7FF" }} />
              </motion.button>

              {/* X close button */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setSelectedCard(null)}
                style={{
                  position: "absolute", top: 52, right: 16,
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(8,11,20,0.65)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} style={{ color: "#F5F7FF" }} />
              </motion.button>

              {/* Destination overlay text */}
              <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                <div style={{
                  display: "inline-block",
                  background: "rgba(138,160,255,0.2)", border: "1px solid rgba(138,160,255,0.35)",
                  borderRadius: 999, padding: "3px 10px", marginBottom: 6,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#8AA0FF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {selectedCard.category}
                  </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>
                  {selectedCard.title}
                </h2>
                <p style={{ fontSize: 11, color: "rgba(245,247,255,0.5)", margin: "5px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {selectedCard.destination}
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "20px 20px 140px" }}>

              {/* Creator profile card */}
              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20, padding: "18px", marginBottom: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "#fff",
                    boxShadow: "0 0 0 2px rgba(212,168,71,0.45)",
                  }}>
                    {selectedCard.creator.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{selectedCard.creator.name}</p>
                    <p style={{ fontSize: 11, color: "#8AA0FF", margin: "2px 0 0" }}>{selectedCard.creator.handle}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleFollow(selectedCard.id)}
                    style={{
                      height: 32, paddingLeft: 16, paddingRight: 16, borderRadius: 999,
                      background: followed.has(selectedCard.id) ? "rgba(123,92,255,0.2)" : LOGO_GRAD,
                      border: "none", cursor: "pointer",
                      fontSize: 12, fontWeight: 700,
                      color: followed.has(selectedCard.id) ? "#8AA0FF" : "#fff",
                      outline: followed.has(selectedCard.id) ? "1px solid rgba(123,92,255,0.4)" : "none",
                      outlineOffset: -1, flexShrink: 0,
                    }}
                  >
                    {followed.has(selectedCard.id) ? "Following" : "Follow"}
                  </motion.button>
                </div>

                {/* Creator stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {[
                    { val: "24", label: "Trips" },
                    { val: "18", label: "Countries" },
                    { val: "9",  label: "Hosted" },
                    { val: selectedCard.bookings.toString(), label: "Bookings" },
                  ].map(({ val, label }) => (
                    <div key={label} style={{
                      background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 6px", textAlign: "center",
                    }}>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#F5F7FF", margin: 0, letterSpacing: "-0.02em" }}>{val}</p>
                      <p style={{ fontSize: 8, color: "rgba(245,247,255,0.38)", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full itinerary section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.34em", color: "#8AA0FF", textTransform: "uppercase", margin: 0 }}>FULL ITINERARY</p>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {FULL_ITINERARY_DAYS.map((day, i) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + i * 0.07, duration: 0.38, ease: EASE }}
                      style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 16, padding: "14px 16px",
                        display: "flex", alignItems: "flex-start", gap: 14,
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, background: LOGO_GRAD, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, color: "#fff",
                      }}>
                        {day.day}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0, lineHeight: 1.2 }}>{day.activity}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                          <MapPin size={9} style={{ color: "#8AA0FF", flexShrink: 0 }} />
                          <p style={{ fontSize: 10, color: "#8AA0FF", margin: 0 }}>{day.location}</p>
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                          <span style={{
                            fontSize: 9, fontWeight: 600, color: "rgba(245,247,255,0.45)",
                            background: "rgba(255,255,255,0.05)", borderRadius: 999, padding: "2px 8px",
                          }}>
                            {day.duration}
                          </span>
                          <span style={{
                            fontSize: 9, fontWeight: 600,
                            color: day.cost === "Included" ? "#6BFFAA" : GOLD,
                            background: day.cost === "Included" ? "rgba(107,255,170,0.1)" : "rgba(212,168,71,0.1)",
                            borderRadius: 999, padding: "2px 8px",
                          }}>
                            {day.cost}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom fixed action bar */}
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              padding: "14px 20px 34px",
              background: "linear-gradient(to top, rgba(8,11,20,1) 60%, rgba(8,11,20,0) 100%)",
              display: "flex", gap: 10,
            }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                style={{
                  flex: 1, height: 48, borderRadius: 999,
                  background: "linear-gradient(120deg, #F0C040 0%, #D4A030 50%, #B8880A 100%)",
                  border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 700, color: "#1A1200",
                  boxShadow: "0 4px 18px rgba(212,168,71,0.38)",
                }}
              >
                Design a Trip Like This
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                style={{
                  flex: 1, height: 48, borderRadius: 999,
                  background: "transparent",
                  border: "1.5px solid rgba(138,160,255,0.45)",
                  cursor: "pointer",
                  fontSize: 13, fontWeight: 700, color: "#8AA0FF",
                }}
              >
                Save Itinerary
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SOCIAL CINEMATIC HEADER ───────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>

        {/* Editorial travel photo — blurred into pure atmospheric color and warmth */}
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=60"
          alt="" aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.2, filter: "blur(26px)",
            transform: "scale(1.08)", pointerEvents: "none",
          }}
        />

        {/* Dark editorial overlay — magazine cover quality */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, rgba(6,9,18,0.88) 0%, rgba(8,11,20,0.76) 55%, rgba(8,11,20,0.96) 100%)",
          pointerEvents: "none",
        }} />

        {/* Bottom fade into feed */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 48,
          background: "linear-gradient(to bottom, transparent 0%, #080B14 100%)",
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", padding: "60px 20px 0" }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.34em", color: "#8AA0FF",
                textTransform: "uppercase", margin: "0 0 9px",
              }}>
                THE TRAVELER NETWORK
              </p>
              <h1 style={{
                fontSize: 42, fontWeight: 900, color: "#F5F7FF",
                letterSpacing: "-0.045em", margin: "0 0 10px", lineHeight: 0.95,
              }}>
                Social
              </h1>
              <p style={{
                fontSize: 13, color: "rgba(245,247,255,0.5)", margin: 0,
                fontStyle: "italic", maxWidth: 250, lineHeight: 1.55,
              }}>
                Discover journeys, hosts, and travelers shaping the next escape.
              </p>
            </div>
            <div style={{
              width: 42, height: 42, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700, marginTop: 2,
              boxShadow: "0 0 0 2px rgba(123,92,255,0.45), 0 4px 16px rgba(0,0,0,0.5)",
            }}>
              {currentUser.avatar}
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {([
              { id: "trending",  label: "Trending"  },
              { id: "hosts",     label: "Top Hosts" },
              { id: "travelers", label: "Travelers" },
            ] as { id: SocialFilter; label: string }[]).map(f => {
              const active = filter === f.id;
              return (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setFilter(f.id)}
                  style={{
                    flex: 1, height: 36, borderRadius: 999, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    background: active ? "rgba(123,92,255,0.28)" : "rgba(255,255,255,0.07)",
                    color: active ? "#C4DAFF" : "rgba(245,247,255,0.45)",
                    outline: active ? "1px solid rgba(123,92,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    outlineOffset: -1,
                    transition: "all 0.18s",
                  }}
                >
                  {f.label}
                </motion.button>
              );
            })}
          </div>

          {/* Search bar */}
          <div style={{
            height: 44, borderRadius: 12,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.11)",
            display: "flex", alignItems: "center", padding: "0 14px", gap: 10,
            marginBottom: 26,
          }}>
            <Search size={14} style={{ color: "rgba(245,247,255,0.38)", flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations, hosts, travelers..."
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 13, color: "#F5F7FF",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── FEED CONTENT ──────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
        >

          {/* ── TRENDING ITINERARY CARDS ────────────────────────────────────── */}
          {filter === "trending" && (
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 24 }}>
              {ITINERARY_CARDS.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.48, ease: EASE }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 6px 28px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Creator row */}
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: "#fff",
                      }}>
                        {card.creator.avatar}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{card.creator.name}</p>
                        <p style={{ fontSize: 10, color: "#8AA0FF", margin: "1px 0 0" }}>{card.creator.handle}</p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleFollow(card.id)}
                      style={{
                        height: 30, paddingLeft: 14, paddingRight: 14, borderRadius: 999,
                        background: followed.has(card.id) ? "rgba(123,92,255,0.2)" : LOGO_GRAD,
                        border: "none", cursor: "pointer",
                        fontSize: 11, fontWeight: 700,
                        color: followed.has(card.id) ? "#8AA0FF" : "#fff",
                        outline: followed.has(card.id) ? "1px solid rgba(123,92,255,0.4)" : "none",
                        outlineOffset: -1,
                      }}
                    >
                      {followed.has(card.id) ? "Following" : "Follow"}
                    </motion.button>
                  </div>

                  {/* Destination image — tap to open detail */}
                  <div
                    style={{ position: "relative", height: 220, cursor: "pointer" }}
                    onClick={() => setSelectedCard(card)}
                  >
                    <img
                      src={card.img}
                      alt={card.destination}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(8,11,20,0.85) 0%, transparent 50%)",
                    }} />
                    {/* Category tag */}
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      background: "rgba(138,160,255,0.2)", border: "1px solid rgba(138,160,255,0.35)",
                      borderRadius: 999, padding: "3px 10px",
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#8AA0FF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {card.category}
                      </span>
                    </div>
                    {/* Trip title */}
                    <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.025em", margin: 0, lineHeight: 1.1 }}>
                        {card.title}
                      </h3>
                      <p style={{ fontSize: 10, color: "rgba(245,247,255,0.45)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {card.destination}
                      </p>
                    </div>
                  </div>

                  {/* Feature 30 — Engagement stats row */}
                  <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Heart size={12} style={{ color: liked.has(card.id) ? "#FF6B8A" : "#9BA3B7" }} />
                      <span style={{ fontSize: 11, color: "#9BA3B7", fontWeight: 500 }}>
                        {(card.likes + (liked.has(card.id) ? 1 : 0)).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Bookmark size={12} style={{ color: saved.has(card.id) ? GOLD : "#9BA3B7" }} />
                      <span style={{ fontSize: 11, color: "#9BA3B7", fontWeight: 500 }}>
                        {(card.saves + (saved.has(card.id) ? 1 : 0)).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Calendar size={12} style={{ color: "#6BFFAA" }} />
                      <span style={{ fontSize: 11, color: "#6BFFAA", fontWeight: 600 }}>
                        {card.bookings} PIK bookings
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  <div style={{ padding: "10px 16px 4px" }}>
                    <p style={{ fontSize: 13, color: "rgba(245,247,255,0.65)", lineHeight: 1.55, margin: 0, fontStyle: "italic" }}>
                      "{card.caption}"
                    </p>
                  </div>

                  {/* Action row: Like / Save / Share / Book */}
                  <div style={{ padding: "8px 12px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggleLike(card.id)}
                      style={{
                        flex: 1, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                        background: liked.has(card.id) ? "rgba(255,107,138,0.18)" : "rgba(255,255,255,0.05)",
                        outline: liked.has(card.id) ? "1px solid rgba(255,107,138,0.4)" : "1px solid rgba(255,255,255,0.07)",
                        outlineOffset: -1,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      }}
                    >
                      <Heart size={13} style={{ color: liked.has(card.id) ? "#FF6B8A" : "#9BA3B7" }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: liked.has(card.id) ? "#FF6B8A" : "#9BA3B7" }}>Like</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggleSave(card.id)}
                      style={{
                        flex: 1, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                        background: saved.has(card.id) ? "rgba(212,168,71,0.18)" : "rgba(255,255,255,0.05)",
                        outline: saved.has(card.id) ? `1px solid rgba(212,168,71,0.4)` : "1px solid rgba(255,255,255,0.07)",
                        outlineOffset: -1,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      }}
                    >
                      {saved.has(card.id)
                        ? <BookmarkCheck size={13} style={{ color: GOLD }} />
                        : <Bookmark size={13} style={{ color: "#9BA3B7" }} />
                      }
                      <span style={{ fontSize: 11, fontWeight: 600, color: saved.has(card.id) ? GOLD : "#9BA3B7" }}>Save</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      style={{
                        flex: 1, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                        background: "rgba(255,255,255,0.05)",
                        outline: "1px solid rgba(255,255,255,0.07)", outlineOffset: -1,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      }}
                    >
                      <Share2 size={13} style={{ color: "#9BA3B7" }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#9BA3B7" }}>Share</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      style={{
                        flex: 1, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                        background: "linear-gradient(120deg, #F0C040 0%, #D4A030 50%, #B8880A 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: "#1A1200",
                      }}
                    >
                      Book
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── TOP HOSTS FEED ──────────────────────────────────────────────── */}
          {filter === "hosts" && (
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {TOP_HOSTS.map((host, i) => (
                <motion.div
                  key={host.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18, overflow: "hidden", cursor: "pointer",
                  }}
                >
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 56, height: 56, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 700, color: "#fff",
                        boxShadow: "0 0 0 2px rgba(212,168,71,0.5)",
                      }}>
                        {host.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{host.name}</p>
                          <PikVerifiedBadge label="Verified PIK host" />
                        </div>
                        <p style={{ fontSize: 11, color: "#8AA0FF", margin: 0 }}>{host.handle}</p>
                        <p style={{ fontSize: 10, color: "rgba(245,247,255,0.4)", margin: "3px 0 0" }}>
                          ★ {host.rating} · {host.reviews} reviews
                        </p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={e => { e.stopPropagation(); toggleFollow(host.id); }}
                        style={{
                          height: 32, paddingLeft: 14, paddingRight: 14, borderRadius: 999, border: "none", cursor: "pointer",
                          background: followed.has(host.id) ? "rgba(123,92,255,0.2)" : LOGO_GRAD,
                          fontSize: 11, fontWeight: 700,
                          color: followed.has(host.id) ? "#8AA0FF" : "#fff",
                          outline: followed.has(host.id) ? "1px solid rgba(123,92,255,0.4)" : "none",
                          outlineOffset: -1, flexShrink: 0,
                        }}
                      >
                        {followed.has(host.id) ? "Following" : "Follow"}
                      </motion.button>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
                      {[
                        { val: host.tripsHosted,    label: "Trips Hosted" },
                        { val: host.travelersHosted, label: "Travelers"    },
                        { val: host.topDest,         label: "Top Dest."    },
                      ].map(({ val, label }) => (
                        <div key={label}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F7FF", margin: 0, letterSpacing: "-0.02em" }}>{val}</p>
                          <p style={{ fontSize: 9, color: "rgba(245,247,255,0.35)", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent itinerary preview */}
                  <div style={{ position: "relative", height: 100, overflow: "hidden" }}>
                    <img src={host.recentImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,11,20,0.8) 0%, rgba(8,11,20,0.2) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                      <span style={{ fontSize: 10, color: "rgba(245,247,255,0.55)" }}>Most recent itinerary</span>
                    </div>
                    <div style={{ position: "absolute", bottom: 10, right: 14 }}>
                      <div style={{
                        height: 28, paddingLeft: 12, paddingRight: 12, borderRadius: 999,
                        background: "linear-gradient(120deg, #F0C040 0%, #D4A030 50%, #B8880A 100%)",
                        display: "flex", alignItems: "center",
                        fontSize: 10, fontWeight: 700, color: "#1A1200",
                      }}>
                        Join a Trip
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── TRAVELERS FEED ──────────────────────────────────────────────── */}
          {filter === "travelers" && (
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {TRAVELERS.map((traveler, i) => (
                <motion.div
                  key={traveler.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18, overflow: "hidden", cursor: "pointer",
                  }}
                >
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: "#fff",
                      }}>
                        {traveler.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{traveler.name}</p>
                        <p style={{ fontSize: 11, color: "#8AA0FF", margin: "2px 0 0" }}>{traveler.handle}</p>
                        <p style={{ fontSize: 10, color: "rgba(245,247,255,0.38)", margin: "4px 0 0" }}>
                          {traveler.countries} countries · {traveler.trips} trips · {traveler.followers} followers
                        </p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={e => { e.stopPropagation(); toggleFollow(traveler.id); }}
                        style={{
                          height: 30, paddingLeft: 12, paddingRight: 12, borderRadius: 999, border: "none", cursor: "pointer",
                          background: followed.has(traveler.id) ? "rgba(123,92,255,0.2)" : LOGO_GRAD,
                          fontSize: 10, fontWeight: 700,
                          color: followed.has(traveler.id) ? "#8AA0FF" : "#fff",
                          outline: followed.has(traveler.id) ? "1px solid rgba(123,92,255,0.4)" : "none",
                          outlineOffset: -1, flexShrink: 0,
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        {followed.has(traveler.id) ? <Check size={11} /> : <UserPlus size={11} />}
                        {followed.has(traveler.id) ? "Following" : "Follow"}
                      </motion.button>
                    </div>
                  </div>
                  {/* Recent itinerary thumbnail */}
                  <div style={{ position: "relative", height: 80, overflow: "hidden" }}>
                    <img src={traveler.recentImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(8,11,20,0.5)" }} />
                    <div style={{ position: "absolute", bottom: 8, left: 14 }}>
                      <span style={{ fontSize: 10, color: "rgba(245,247,255,0.5)" }}>Most recent itinerary →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
