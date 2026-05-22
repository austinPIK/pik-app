import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, Bookmark, BookmarkCheck, ArrowRight, ChevronRight, X, Star, Clock, Users, Globe } from "lucide-react";
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

// Feature 03 — search suggestions cycling every 3.5s
const SEARCH_SUGGESTIONS = [
  "7 days in Patagonia",
  "A solo trip to Japan",
  "A honeymoon in the Maldives",
  "A group trek in Iceland",
];

// Feature 06 — category filter pills
const CATEGORY_PILLS = ["All", "Adventure", "Wellness", "Cultural", "Solo", "Honeymoon", "Group", "Golf"];

// Feature 04 — Curated For You hero card
const HERO = {
  id: "hero-bali",
  destination: "Bali",
  country: "Indonesia",
  img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=85",
  dates: "May 24 – Jun 3, 2026",
  nights: 10,
  travelers: 5,
  price: 2400,
};

// Feature 07 — personalized trip cards row
const TRIP_CARDS = [
  { id: "tc1", destination: "Kyoto",     country: "Japan",        days: 10, price: 3200, title: "Temple & Zen",   img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
  { id: "tc2", destination: "Santorini", country: "Greece",       days: 7,  price: 2800, title: "Aegean Escape",  img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" },
  { id: "tc3", destination: "Maldives",  country: "Indian Ocean", days: 8,  price: 5600, title: "Crystal Waters", img: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=400&q=80" },
  { id: "tc4", destination: "Patagonia", country: "Argentina",    days: 11, price: 4100, title: "Edge of World",  img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80" },
  { id: "tc5", destination: "Amalfi",    country: "Italy",        days: 8,  price: 3400, title: "Dolce Vita",     img: "https://images.unsplash.com/photo-1555990538-c4fb98bd3f9e?w=400&q=80" },
];

// Feature 08-09 — editorial trending cards with social proof
const TRENDING = [
  { id: "tr1", category: "Adventure", title: "7 Days in Patagonia",      destination: "Patagonia, Argentina", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", bookedThisWeek: 14, price: 4100 },
  { id: "tr2", category: "Wellness",  title: "Bali Spiritual Retreat",   destination: "Ubud, Bali",           img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80", bookedThisWeek: 22, price: 2400 },
  { id: "tr3", category: "Cultural",  title: "Ancient Kyoto Deep Dive",  destination: "Kyoto, Japan",         img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80", bookedThisWeek: 9,  price: 3200 },
];

// Feature 10 — Trip Detail data per card
const TRIP_DETAILS: Record<string, {
  description: string; rating: number; reviews: number; category: string;
  days: number; travelers: string; nights: number;
  includes: string[];
  itinerary: { day: number; title: string; desc: string }[];
}> = {
  "hero-bali": {
    description: "Surrender to the island's sacred rhythm. Sacred temples, emerald rice terraces, and villa pools beneath the jungle canopy. Every day unfolds differently — and unforgettably.",
    rating: 4.9, reviews: 312, category: "Wellness", days: 10, nights: 10, travelers: "2–8",
    includes: ["Private villa", "All flights", "Daily breakfast", "Temple tours", "Airport transfers"],
    itinerary: [
      { day: 1, title: "Arrive in Ubud", desc: "Touch down and transfer to your private villa. Pool, massage, sunset." },
      { day: 2, title: "Tegallalang Rice Terraces", desc: "Dawn hike through emerald cascades. Breakfast with valley views." },
      { day: 3, title: "Sacred Temple Circuit", desc: "Tirta Empul, Gunung Kawi, Pura Ulun Danu Bratan." },
      { day: 4, title: "Cooking Class & Market", desc: "Local market at dawn, hands-on Balinese cooking class, afternoon free." },
      { day: 5, title: "Mount Batur Sunrise Trek", desc: "3am departure, summit sunrise, caldera views, coffee at the top." },
    ],
  },
  "tc1": {
    description: "Walk between centuries in Japan's ancient capital. Zen gardens, geisha districts, 1,600 Buddhist temples. Time slows here — that's the point.",
    rating: 4.95, reviews: 489, category: "Cultural", days: 10, nights: 10, travelers: "1–6",
    includes: ["Ryokan stays", "Rail pass", "Breakfast daily", "Temple entries", "Tea ceremony"],
    itinerary: [
      { day: 1, title: "Arrive Kyoto", desc: "Check in to ryokan in Gion. Evening walk through lantern-lit streets." },
      { day: 2, title: "Fushimi Inari at Dawn", desc: "Beat the crowds through 10,000 torii gates at sunrise." },
      { day: 3, title: "Arashiyama Bamboo Grove", desc: "Bamboo forest, Tenryu-ji garden, river cruise." },
    ],
  },
};

type DetailCard = { id: string; destination: string; country: string; img: string; price: number } | null;

function TripDetailSheet({ card, onClose, onDesign }: { card: NonNullable<DetailCard>; onClose: () => void; onDesign: () => void }) {
  const detail = TRIP_DETAILS[card.id] ?? {
    description: "A world-class destination curated by Varix for your travel style. Every detail tailored to you.",
    rating: 4.9, reviews: 180, category: "Adventure", days: 8, nights: 8, travelers: "1–8",
    includes: ["All flights", "Hotels", "Daily breakfast", "Activities"],
    itinerary: [
      { day: 1, title: "Arrival", desc: "Check in and settle into your destination." },
      { day: 2, title: "Explore", desc: "Full day of curated experiences." },
    ],
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "#080B14", overflowY: "auto",
      }}
    >
      {/* Hero image */}
      <div style={{ position: "relative", height: 300 }}>
        <img src={card.img} alt={card.destination} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(8,11,20,1) 0%, rgba(8,11,20,0.5) 40%, rgba(8,11,20,0.1) 100%)",
        }} />
        {/* Back button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            position: "absolute", top: 52, left: 16,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(8,11,20,0.7)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={18} style={{ color: "#F5F7FF" }} />
        </motion.button>
        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute", top: 52, right: 16,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(8,11,20,0.7)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bookmark size={16} style={{ color: GOLD }} />
        </motion.button>
        {/* Destination overlay */}
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{
              background: "rgba(138,160,255,0.2)", border: "1px solid rgba(138,160,255,0.35)",
              borderRadius: 999, padding: "3px 10px",
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#8AA0FF", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {detail.category}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={11} style={{ color: GOLD }} />
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{detail.rating}</span>
              <span style={{ fontSize: 10, color: "rgba(245,247,255,0.4)" }}>({detail.reviews} reviews)</span>
            </div>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.04em", lineHeight: 0.95, margin: 0 }}>
            {card.destination}
          </h1>
          <p style={{ fontSize: 11, color: "rgba(245,247,255,0.45)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {card.country}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", padding: "18px 20px", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { icon: Clock,  val: `${detail.nights} nights`, label: "Duration" },
          { icon: Users,  val: detail.travelers,           label: "Group size" },
          { icon: Globe,  val: `From $${card.price.toLocaleString()}`, label: "Starting price" },
        ].map(({ icon: Icon, val, label }, i) => (
          <div key={label} style={{ flex: 1, textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none", padding: "0 10px" }}>
            <Icon size={14} style={{ color: "#8AA0FF", marginBottom: 4 }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{val}</p>
            <p style={{ fontSize: 9, color: "rgba(245,247,255,0.35)", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 20px 120px" }}>
        {/* Description */}
        <p style={{ fontSize: 14, color: "rgba(245,247,255,0.65)", lineHeight: 1.7, margin: "0 0 24px", fontStyle: "italic" }}>
          {detail.description}
        </p>

        {/* What's included */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#8AA0FF", textTransform: "uppercase", margin: "0 0 12px" }}>
            WHAT'S INCLUDED
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {detail.includes.map(item => (
              <div key={item} style={{
                height: 30, paddingLeft: 12, paddingRight: 12, borderRadius: 999,
                background: "rgba(107,255,170,0.1)", border: "1px solid rgba(107,255,170,0.25)",
                display: "flex", alignItems: "center",
                fontSize: 11, fontWeight: 600, color: "#6BFFAA",
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary preview */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#8AA0FF", textTransform: "uppercase", margin: 0 }}>
              ITINERARY PREVIEW
            </p>
            <span style={{ fontSize: 11, color: "#8AA0FF" }}>Day 1–{detail.itinerary.length} of {detail.days}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {detail.itinerary.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                style={{
                  display: "flex", gap: 14,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "14px 16px",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: LOGO_GRAD,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {day.day}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{day.title}</p>
                  <p style={{ fontSize: 11, color: "rgba(245,247,255,0.45)", margin: "4px 0 0", lineHeight: 1.5 }}>{day.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom bar — Feature 11 Begin Designing */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "16px 20px max(env(safe-area-inset-bottom),20px)",
        background: "linear-gradient(to top, rgba(8,11,20,1) 0%, rgba(8,11,20,0.95) 80%, transparent 100%)",
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: "rgba(245,247,255,0.35)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>From</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#F5F7FF", margin: 0, letterSpacing: "-0.03em" }}>${card.price.toLocaleString()}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onDesign}
            style={{
              flex: 2, height: 54, borderRadius: 999,
              background: GOLD_GRAD, border: "none", cursor: "pointer",
              fontSize: 15, fontWeight: 700, color: "#1A1200",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 28px rgba(212,168,71,0.6)",
            }}
          >
            Begin Designing <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function ExploreTab({ onVarixOpen }: Props) {
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedCards, setSavedCards] = useState<Set<string>>(new Set());
  const [detailCard, setDetailCard] = useState<DetailCard>(null);

  const firstName = currentUser.name.split(" ")[0];

  // Feature 03 — cycle suggestions every 3.5s
  useEffect(() => {
    const t = setInterval(() => setSuggestionIdx(i => (i + 1) % SEARCH_SUGGESTIONS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const toggleSave = (id: string) => setSavedCards(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <>
    <div style={{ background: "#06080F", minHeight: "100%", paddingBottom: 120, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <style>{`
        @keyframes pik-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── BRAND HERO HEADER ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>

        {/* Logo rendered as CSS background-image layers — no <img> element boundary.
            All gradient masks composite in the same layer as the image itself,
            so there is no DOM element edge that can produce a seam. */}
        <div style={{
          width: "100%",
          /* Natural aspect ratio of 1983×793, capped so it doesn't dominate mobile */
          aspectRatio: "1983 / 793",
          maxHeight: "clamp(110px, 38vw, 180px)",
          backgroundImage: [
            /* top mask — dissolves into page BG */
            "linear-gradient(to bottom, #06080F 0%, rgba(6,8,15,0.82) 20%, transparent 45%)",
            /* bottom mask — same page BG so content below is seamless */
            "linear-gradient(to top,    #06080F 0%, rgba(6,8,15,0.96) 25%, transparent 58%)",
            /* left mask */
            "linear-gradient(to right,  #06080F 0%, rgba(6,8,15,0.88) 15%, transparent 38%)",
            /* right mask */
            "linear-gradient(to left,   #06080F 0%, rgba(6,8,15,0.88) 15%, transparent 38%)",
            /* the logo image itself */
            "url(/brand/pik-logo-dark.png)",
          ].join(", "),
          backgroundSize:     "100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
          backgroundPosition: "center, center, center, center, center",
          backgroundRepeat:   "no-repeat",
        }} />

        {/* Avatar — floats over the image area, safe-area aware */}
        <motion.div
          whileTap={{ scale: 0.94 }}
          style={{
            position: "absolute",
            top: "max(env(safe-area-inset-top, 14px), 14px)",
            right: 20,
            width: 38, height: 38, borderRadius: "50%",
            background: LOGO_GRAD,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700,
            boxShadow: "0 0 0 2px rgba(123,92,255,0.6), 0 4px 16px rgba(0,0,0,0.7)",
            zIndex: 10, cursor: "pointer",
          }}
        >
          {currentUser.avatar}
        </motion.div>
      </div>

      {/* ── HEADER COPY ──────────────────────────────────────────────────────── */}
      {/* No overflow:hidden here — it clips the italic glyph overhang on Safari */}
      <div style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "0 20px 0",
        background: "#06080F",
      }}>

        {/* ── 01 PERSONALIZED GREETING ──────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          style={{
            marginTop: 2,
            marginBottom: 12,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.28em",
            color: "rgba(245,247,255,0.5)",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {getGreeting()}, {firstName}.
        </motion.p>

        {/* ── 02 EXPLORE HEADLINE ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.55, ease: EASE }}
          style={{ width: "100%", minWidth: 0 }}
        >
          <h1 style={{
            fontSize: "clamp(36px, 8.5vw, 60px)",
            fontWeight: 800,
            color: "#F5F7FF",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: "0 0 10px 0",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
          }}>
            Where to next,{" "}
            {/*
              display:inline-block with paddingRight is the fix for WebKit's
              -webkit-text-fill-color:transparent + background-clip:text.
              Italic glyphs visually extend beyond their advance-width box.
              inline-block forces a containing block whose logical right edge
              covers the entire visual glyph including the italic overhang,
              so the gradient renders over the full ? character.
            */}
            <span style={{
              display: "inline-block",
              fontStyle: "italic",
              background: LOGO_GRAD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              paddingRight: "0.25em",
            }}>
              {firstName}?
            </span>
          </h1>

          {/* ── Subheading ──────────────────────────────────────────────────── */}
          <p style={{
            fontSize: 15,
            color: "rgba(245,247,255,0.42)",
            margin: "0 0 20px 0",
            lineHeight: 1.5,
            letterSpacing: "0.005em",
          }}>
            Your next legendary chapter awaits.
          </p>
        </motion.div>

        {/* ── 03 ANIMATED SEARCH BAR ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.5, ease: EASE }}
          style={{ marginTop: 4, marginBottom: 24, width: "100%" }}
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onVarixOpen}
            style={{
              width: "100%", height: 56, borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.11)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", padding: "0 20px",
              gap: 12, cursor: "pointer",
              backdropFilter: "blur(16px)",
              boxSizing: "border-box",
            }}
          >
            <Search size={18} style={{ color: "#9BA3B7", flexShrink: 0 }} />
            <div style={{ flex: 1, overflow: "hidden", position: "relative", height: 24 }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={suggestionIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center",
                    fontSize: 15, color: "rgba(155,163,183,0.45)", whiteSpace: "nowrap",
                  }}
                >
                  {SEARCH_SUGGESTIONS[suggestionIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
            <Mic size={18} style={{ color: "#9BA3B7", flexShrink: 0 }} />
          </motion.button>
        </motion.div>
      </div>

      {/* ── 04 CURATED FOR YOU HERO CARD ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.55, ease: EASE }}
        style={{ padding: "20px 20px 0" }}
      >
        <div
          onClick={() => setDetailCard({ id: HERO.id, destination: HERO.destination, country: HERO.country, img: HERO.img, price: HERO.price })}
          style={{
            position: "relative", height: 380, borderRadius: 22, overflow: "hidden",
            boxShadow: "0 12px 48px rgba(0,0,0,0.55)",
            cursor: "pointer",
          }}
        >
          {/* Background photo */}
          <img
            src={HERO.img}
            alt={HERO.destination}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(8,11,20,1) 0%, rgba(8,11,20,0.7) 40%, rgba(8,11,20,0.15) 70%, transparent 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 15% 90%, rgba(91,56,204,0.3) 0%, transparent 55%)",
          }} />

          {/* Bookmark — Feature 05 */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); toggleSave(HERO.id); }}
            style={{
              position: "absolute", top: 16, right: 16,
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(8,11,20,0.6)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {savedCards.has(HERO.id)
              ? <BookmarkCheck size={16} style={{ color: GOLD }} />
              : <Bookmark size={16} style={{ color: "rgba(245,247,255,0.7)" }} />
            }
          </motion.button>

          {/* Bottom content */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 20px" }}>
            {/* "Curated for you" tag */}
            <div style={{
              display: "inline-flex", alignItems: "center", marginBottom: 12,
              background: "rgba(212,168,71,0.18)", border: "1px solid rgba(212,168,71,0.45)",
              borderRadius: 999, padding: "3px 12px",
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase" }}>
                Curated for you
              </span>
            </div>

            <h2 style={{
              fontSize: 38, fontWeight: 800, color: "#F5F7FF",
              letterSpacing: "-0.04em", lineHeight: 0.96, margin: 0,
            }}>
              {HERO.destination}
            </h2>
            <p style={{
              fontSize: 12, color: "rgba(245,247,255,0.5)", margin: "6px 0 0",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {HERO.country}
            </p>

            {/* Trip details row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginTop: 10,
              flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 11, color: "rgba(245,247,255,0.55)" }}>{HERO.dates}</span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>·</span>
              <span style={{ fontSize: 11, color: "rgba(245,247,255,0.55)" }}>{HERO.nights} nights</span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>·</span>
              <span style={{ fontSize: 11, color: "rgba(245,247,255,0.55)" }}>{HERO.travelers} travelers</span>
            </div>

            {/* Price + CTA row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: 16,
            }}>
              <div>
                <p style={{ fontSize: 10, color: "rgba(245,247,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>From</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#F5F7FF", margin: 0, letterSpacing: "-0.03em" }}>
                  ${HERO.price.toLocaleString()}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                style={{
                  height: 46, paddingLeft: 22, paddingRight: 22,
                  borderRadius: 999, background: GOLD_GRAD, border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
                  fontSize: 13, fontWeight: 700, color: "#1A1200",
                  boxShadow: "0 4px 24px rgba(212,168,71,0.55)",
                }}
              >
                Begin Designing <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 06 CATEGORY FILTER PILLS ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.45, ease: EASE }}
        style={{ marginTop: 20 }}
      >
        <div style={{
          display: "flex", gap: 8, overflowX: "auto", overflowY: "hidden",
          paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}>
          {CATEGORY_PILLS.map((pill) => {
            const active = activeCategory === pill;
            return (
              <motion.button
                key={pill}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(pill)}
                style={{
                  flexShrink: 0, height: 34, paddingLeft: 16, paddingRight: 16,
                  borderRadius: 999, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  background: active
                    ? "rgba(123,92,255,0.25)"
                    : "rgba(255,255,255,0.05)",
                  color: active ? "#C4DAFF" : "rgba(245,247,255,0.45)",
                  outline: active ? "1px solid rgba(123,92,255,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  outlineOffset: -1,
                  transition: "all 0.18s",
                }}
              >
                {pill}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ── 07 PERSONALIZED TRIP CARDS ROW ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.48, ease: EASE }}
        style={{ marginTop: 24 }}
      >
        <div style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 14 }}>
          <p style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.34em",
            color: "#8AA0FF", textTransform: "uppercase", margin: 0, marginBottom: 5,
          }}>PERSONALIZED</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>
            Made For You
          </h2>
        </div>
        <div style={{
          display: "flex", gap: 12, overflowX: "auto", overflowY: "hidden",
          paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}>
          {TRIP_CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 + i * 0.06, duration: 0.44, ease: EASE }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDetailCard({ id: card.id, destination: card.destination, country: card.country, img: card.img, price: card.price })}
              style={{
                position: "relative", flexShrink: 0,
                width: 136, height: 188,
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                boxShadow: "0 6px 28px rgba(0,0,0,0.45)",
              }}
            >
              <img
                src={card.img}
                alt={card.destination}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(8,11,20,0.97) 0%, rgba(8,11,20,0.2) 55%, transparent 100%)",
              }} />

              {/* Bookmark */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); toggleSave(card.id); }}
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "none", border: "none", padding: 0, cursor: "pointer",
                }}
              >
                {savedCards.has(card.id)
                  ? <BookmarkCheck size={14} style={{ color: GOLD }} />
                  : <Bookmark size={14} style={{ color: "rgba(245,247,255,0.6)" }} />
                }
              </motion.button>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>
                  {card.destination}
                </p>
                <p style={{ fontSize: 9, color: "rgba(245,247,255,0.4)", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {card.days} days
                </p>
                <p style={{ fontSize: 11, color: GOLD, margin: "4px 0 0", fontWeight: 600 }}>
                  From ${card.price.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── 08-09 TRENDING SECTION ────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.52, ease: EASE }}
        style={{ marginTop: 36, paddingLeft: 20, paddingRight: 20 }}
      >
        {/* Feature 08 — Trending section header */}
        <div style={{ marginBottom: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{
              fontSize: 8, fontWeight: 700, letterSpacing: "0.34em",
              color: "#8AA0FF", textTransform: "uppercase", margin: 0, marginBottom: 5,
            }}>TRENDING NOW</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>
              What others are designing
            </h2>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 600, color: "#8AA0FF",
            background: "none", border: "none", cursor: "pointer",
          }}>
            See all <ChevronRight size={12} />
          </button>
        </div>

        {/* Feature 09 — Editorial trending cards stacked vertically */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TRENDING.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.48, ease: EASE }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setDetailCard({ id: card.id, destination: card.destination.split(",")[0], country: card.destination, img: card.img, price: card.price })}
              style={{
                position: "relative", borderRadius: 18, overflow: "hidden",
                cursor: "pointer", height: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
              }}
            >
              <img
                src={card.img}
                alt={card.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(8,11,20,0.97) 0%, rgba(8,11,20,0.45) 50%, rgba(8,11,20,0.1) 100%)",
              }} />

              {/* Bookmark */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); toggleSave(card.id); }}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(8,11,20,0.65)", backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {savedCards.has(card.id)
                  ? <BookmarkCheck size={14} style={{ color: GOLD }} />
                  : <Bookmark size={14} style={{ color: "rgba(245,247,255,0.65)" }} />
                }
              </motion.button>

              {/* Category tag */}
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(138,160,255,0.2)", border: "1px solid rgba(138,160,255,0.35)",
                borderRadius: 999, padding: "3px 10px",
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#8AA0FF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {card.category}
                </span>
              </div>

              {/* Bottom content */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
                <h3 style={{
                  fontSize: 19, fontWeight: 700, color: "#F5F7FF",
                  letterSpacing: "-0.025em", margin: 0, lineHeight: 1.1,
                }}>
                  {card.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  {/* Social proof — "14 booked this week" */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: "rgba(212,168,71,0.2)", border: "1px solid rgba(212,168,71,0.4)",
                      borderRadius: 999, padding: "2px 8px",
                      color: GOLD,
                    }}>
                      {card.bookedThisWeek} booked this week
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>
                    From ${card.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>

    {/* ── 10 TRIP DETAIL SHEET ────────────────────────────────────────────── */}
    <AnimatePresence>
      {detailCard && (
        <TripDetailSheet
          card={detailCard}
          onClose={() => setDetailCard(null)}
          onDesign={() => { setDetailCard(null); onVarixOpen?.(); }}
        />
      )}
    </AnimatePresence>
    </>
  );
}
