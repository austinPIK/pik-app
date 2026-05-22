import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Globe, Lock, Plus, Check,
} from "lucide-react";
import { trips, memories, currentUser } from "@/data/mock";
import type { TabId } from "@/pages/AppView";
import { TripCardBuilder, CreatedTripCard } from "./TripCardBuilder";
import type { TripCard } from "./TripCardBuilder";
import { CapsuleBuilder, CapsuleCard } from "./CapsuleBuilder";
import type { PikCapsule } from "./CapsuleBuilder";

interface Props {
  onTabChange?: (t: TabId) => void;
  onVarixOpen?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const LOGO_GRAD = "linear-gradient(135deg, #D4E8FB 0%, #9DC2F6 30%, #6B9FEE 55%, #8C87F4 75%, #B99CF9 100%)";
const GOLD = "#D4A847";
const GOLD_GRAD = "linear-gradient(120deg, #F0C040 0%, #D4A030 50%, #B8880A 100%)";

function useCountdown(targetDateStr: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDateStr).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDateStr]);
  return timeLeft;
}

// Kept for potential trip detail views — not rendered here
const ITINERARY_DAYS = [
  { day: 1, location: "Denpasar → Ubud, Bali",  event: "Arrive in Bali",         description: "Touch down in the Island of the Gods. Transfer through lush rice fields to your villa." },
  { day: 2, location: "Tegallalang, Ubud",       event: "Rice Terrace Trek",      description: "Dawn hike through emerald cascades. Breakfast with panoramic valley views." },
  { day: 3, location: "Ubud → Lake Beratan",     event: "Ancient Temple Circuit", description: "Sacred springs, ornate shrines, and the floating temple of Pura Ulun Danu Bratan." },
];
void ITINERARY_DAYS; // prevent unused warning

const STATUS_COLORS: Record<string, string> = {
  upcoming:  "#6BFFAA",
  confirmed: "#6BFFAA",
  filling:   GOLD,
  planning:  "#8AA0FF",
  draft:     "#9BA3B7",
};

const CAPSULES = [
  {
    id: "cap1",
    destination: "Torres del Paine, Chile",
    title: "Patagonia Winter",
    sealedDate: "Dec 15, 2024",
    unlockDate: "Dec 15, 2025",
    daysLeft: 209,
    sealed: true,
    gradientFrom: "#1a2a4a",
    gradientTo: "#0a1525",
  },
  {
    id: "cap2",
    destination: "Bali, Indonesia",
    title: "Island of Gods",
    sealedDate: "Jun 3, 2025",
    unlockDate: "Jun 3, 2026",
    daysLeft: 0,
    sealed: false,
    gradientFrom: "#2a1a4a",
    gradientTo: "#150a30",
  },
];

type TripFilter = "all" | "hosting" | "joined" | "upcoming";

export function TripsTab({ onVarixOpen }: Props) {
  const upcomingTrip   = trips.find(t => t.status === "upcoming") ?? trips[0];
  const completedTrips = trips.filter(t => t.status === "completed");
  const countdown      = useCountdown(upcomingTrip.dates.start);

  const [builderOpen, setBuilderOpen]     = useState(false);
  const [userCards, setUserCards]         = useState<TripCard[]>([]);
  const [capsuleOpen, setCapsuleOpen]     = useState(false);
  const [userCapsules, setUserCapsules]   = useState<PikCapsule[]>([]);
  const [toast, setToast]                 = useState<string | null>(null);
  const [featureTab, setFeatureTab]       = useState<"cards" | "capsule">("cards");
  const [tripFilter, setTripFilter]       = useState<TripFilter>("all");

  const handleCardSave = (card: TripCard) => {
    setUserCards(prev => [card, ...prev]);
    setBuilderOpen(false);
    setToast("Trip Card created.");
    setTimeout(() => setToast(null), 3500);
  };

  const handleCapsuleSave = (capsule: PikCapsule) => {
    setUserCapsules(prev => [capsule, ...prev]);
    setCapsuleOpen(false);
    setToast("Capsule sealed.");
    setTimeout(() => setToast(null), 3500);
  };

  const handleDesignTrip = () => {
    setToast("Trip design wizard — coming soon.");
    setTimeout(() => setToast(null), 3500);
  };

  // Filter trips for deck (not the hero trip)
  const deckTrips = (() => {
    const nonHero = trips.filter(t => t.id !== upcomingTrip.id);
    switch (tripFilter) {
      case "hosting":
        return nonHero.filter(t => t.status === "planning");
      case "upcoming":
        return nonHero.filter(t => t.status === "upcoming");
      case "joined":
        return nonHero; // same as all for mock
      case "all":
      default:
        return nonHero.filter(t => t.status !== "completed");
    }
  })();

  return (
    <div style={{ background: "#080B14", minHeight: "100%", paddingBottom: "calc(170px + env(safe-area-inset-bottom))" }}>
      <style>{`
        @keyframes pik-status-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(107,255,170,0.7); }
          50%       { box-shadow: 0 0 0 5px rgba(107,255,170,0); }
        }
      `}</style>

      {/* ── A. TRIPS CINEMATIC HEADER ────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>

        {/* Editorial destination photo — Bali warmth, heavily processed into pure atmosphere */}
        <img
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=60"
          alt="" aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.22, filter: "blur(28px)",
            transform: "scale(1.1)", pointerEvents: "none",
          }}
        />

        {/* Cinematic dark overlay — preserves text authority */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(165deg, rgba(6,9,18,0.9) 0%, rgba(8,11,20,0.78) 55%, rgba(8,11,20,0.95) 100%)",
          pointerEvents: "none",
        }} />

        {/* Golden hour warmth — lower left, suggests warm destination light */}
        <div style={{
          position: "absolute", bottom: -20, left: -20, width: 300, height: 220,
          background: "radial-gradient(ellipse, rgba(212,168,71,0.14) 0%, transparent 65%)",
          filter: "blur(44px)", pointerEvents: "none",
        }} />

        {/* Bottom edge fade — leads into the upcoming trip card */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 56,
          background: "linear-gradient(to bottom, transparent 0%, #080B14 100%)",
          pointerEvents: "none",
        }} />

        {/* Header text */}
        <div style={{
          position: "relative",
          padding: "62px 20px 36px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        }}>
          <div>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.34em", color: GOLD,
              textTransform: "uppercase", margin: "0 0 10px",
            }}>
              YOUR NEXT ESCAPE
            </p>
            <h1 style={{
              fontSize: 42, fontWeight: 900, color: "#F5F7FF",
              letterSpacing: "-0.045em", margin: "0 0 10px", lineHeight: 0.95,
            }}>
              Trips
            </h1>
            <p style={{
              fontSize: 13, color: "rgba(245,247,255,0.52)", margin: 0,
              fontStyle: "italic", letterSpacing: "0.01em",
            }}>
              Every journey, beautifully in motion.
            </p>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: "50%", background: LOGO_GRAD,
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700, marginTop: 2,
            boxShadow: "0 0 0 2px rgba(123,92,255,0.45), 0 4px 16px rgba(0,0,0,0.5)",
          }}>
            {currentUser.avatar}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── B. HERO — NEXT UPCOMING TRIP ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{
            position: "relative", borderRadius: 22, overflow: "hidden",
            height: 300, cursor: "pointer",
            boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${upcomingTrip.gradientFrom} 0%, ${upcomingTrip.gradientVia ?? upcomingTrip.gradientFrom} 50%, ${upcomingTrip.gradientTo} 100%)`,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(8,11,20,0.92) 0%, rgba(8,11,20,0.35) 50%, rgba(8,11,20,0.05) 100%)",
          }} />
          <div style={{
            position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            filter: "blur(28px)", pointerEvents: "none",
          }} />

          {/* Status + dates */}
          <div style={{ position: "absolute", top: 18, left: 18, right: 18, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(8,11,20,0.6)", backdropFilter: "blur(12px)",
              borderRadius: 999, padding: "5px 12px",
              border: `1px solid ${STATUS_COLORS[upcomingTrip.status] ?? "#8AA0FF"}40`,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: STATUS_COLORS[upcomingTrip.status] ?? "#8AA0FF",
                animation: "pik-status-pulse 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: STATUS_COLORS[upcomingTrip.status] ?? "#8AA0FF" }}>
                Confirmed
              </span>
            </div>
            <p style={{ fontSize: 10, color: "rgba(245,247,255,0.45)", margin: 0, textAlign: "right" }}>
              {upcomingTrip.dates.start}
            </p>
          </div>

          {/* Destination */}
          <div style={{ position: "absolute", bottom: 90, left: 18, right: 18 }}>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.04em", lineHeight: 0.95, margin: 0 }}>
              {upcomingTrip.destination}
            </h2>
            <p style={{ fontSize: 10, color: "rgba(245,247,255,0.4)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {upcomingTrip.country} · {upcomingTrip.nights} nights · {upcomingTrip.group.length} travelers
            </p>
          </div>

          {/* Countdown */}
          <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, display: "flex", alignItems: "center", gap: 4 }}>
            {[
              { val: countdown.days,    label: "Days" },
              { val: countdown.hours,   label: "Hrs"  },
              { val: countdown.minutes, label: "Min"  },
              { val: countdown.seconds, label: "Sec"  },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <span style={{ color: "rgba(245,247,255,0.25)", fontSize: 20, fontWeight: 300 }}>:</span>}
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.03em", lineHeight: 1, margin: 0, fontVariantNumeric: "tabular-nums" }}>
                    {String(val).padStart(2, "0")}
                  </p>
                  <p style={{ fontSize: 7, color: "rgba(245,247,255,0.35)", margin: "2px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Group member row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.48, ease: EASE }}
          style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {upcomingTrip.group.slice(0, 5).map((m, i) => (
                <div key={m.id} style={{
                  width: 32, height: 32, borderRadius: "50%", background: LOGO_GRAD,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "#fff",
                  marginLeft: i === 0 ? 0 : -10,
                  border: i === 0 ? `2px solid ${GOLD}` : "2px solid #080B14",
                  position: "relative", zIndex: upcomingTrip.group.length - i,
                }}>
                  {m.avatar}
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#F5F7FF", margin: 0 }}>
                Hosted by you · {upcomingTrip.group.length - 1} friends confirmed
              </p>
              <p style={{ fontSize: 10, color: "rgba(245,247,255,0.38)", margin: "2px 0 0" }}>Tap to view group</p>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: "#8AA0FF", flexShrink: 0 }} />
        </motion.div>

        {/* ── C. TRIPS FILTER + DECK ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.48, ease: EASE }}
        >
          {/* Filter row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {(["all", "hosting", "joined", "upcoming"] as TripFilter[]).map(f => {
              const labels = { all: "All", hosting: "Hosting", joined: "Joined", upcoming: "Upcoming" };
              const active = tripFilter === f;
              return (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setTripFilter(f)}
                  style={{
                    height: 32, paddingLeft: 14, paddingRight: 14, borderRadius: 999,
                    border: "none", cursor: "pointer", fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    background: active ? "rgba(123,92,255,0.22)" : "rgba(255,255,255,0.05)",
                    color: active ? "#C4DAFF" : "rgba(245,247,255,0.45)",
                    outline: active ? "1px solid rgba(123,92,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    outlineOffset: -1,
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                >
                  {labels[f]}
                </motion.button>
              );
            })}
          </div>

          {/* Trip deck */}
          {deckTrips.length > 0 ? (
            <div style={{
              display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4,
              scrollbarWidth: "none", scrollSnapType: "x mandatory",
            }}>
              {deckTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    flexShrink: 0, width: 220, height: 160, borderRadius: 18,
                    background: `linear-gradient(135deg, ${trip.gradientFrom} 0%, ${trip.gradientTo} 100%)`,
                    position: "relative", overflow: "hidden", cursor: "pointer",
                    scrollSnapAlign: "start",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(8,11,20,0.88) 0%, rgba(8,11,20,0.1) 60%, transparent 100%)",
                  }} />

                  {/* Status badge */}
                  <div style={{
                    position: "absolute", top: 12, left: 12,
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(8,11,20,0.6)", backdropFilter: "blur(10px)",
                    borderRadius: 999, padding: "4px 10px",
                    border: `1px solid ${STATUS_COLORS[trip.status] ?? "#8AA0FF"}40`,
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: STATUS_COLORS[trip.status] ?? "#8AA0FF",
                    }} />
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
                      textTransform: "uppercase", color: STATUS_COLORS[trip.status] ?? "#8AA0FF",
                    }}>
                      {trip.status}
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                    <p style={{
                      fontSize: 16, fontWeight: 800, color: "#F5F7FF",
                      letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1,
                    }}>
                      {trip.destination}
                    </p>
                    <p style={{ fontSize: 9, color: "rgba(245,247,255,0.45)", margin: "4px 0 0" }}>
                      {trip.country} · {trip.dates.start}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "24px", textAlign: "center",
            }}>
              <p style={{ fontSize: 13, color: "rgba(245,247,255,0.35)", margin: 0 }}>
                No trips in this category yet.
              </p>
            </div>
          )}
        </motion.div>

        {/* ── HOST A TRIP CTA ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{
            background: "linear-gradient(135deg, rgba(212,168,71,0.1) 0%, rgba(123,92,255,0.07) 100%)",
            border: "1px solid rgba(212,168,71,0.22)",
            borderRadius: 18, padding: "18px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
          }}
        >
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: "0 0 3px" }}>
              Host a Trip
            </p>
            <p style={{ fontSize: 11, color: "rgba(245,247,255,0.42)", margin: 0, lineHeight: 1.4 }}>
              Organize and invite your crew
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleDesignTrip}
            style={{
              height: 38, paddingLeft: 16, paddingRight: 16, borderRadius: 999,
              background: GOLD_GRAD, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, color: "#1A1200",
              flexShrink: 0, whiteSpace: "nowrap",
              boxShadow: "0 3px 14px rgba(212,168,71,0.38)",
            }}
          >
            Design a New Trip
          </motion.button>
        </motion.div>

        {/* ── D. PAST TRIPS ────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.34em", color: "#8AA0FF", textTransform: "uppercase", margin: 0, marginBottom: 4 }}>PAST TRIPS</p>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>Completed</h2>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#8AA0FF", background: "none", border: "none", cursor: "pointer" }}>
              See all <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {completedTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.44, ease: EASE }}
                whileTap={{ scale: 0.99 }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "14px 16px", cursor: "pointer",
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${trip.gradientFrom}, ${trip.gradientTo})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Globe size={20} style={{ color: "rgba(255,255,255,0.45)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{trip.destination}</p>
                  <p style={{ fontSize: 10, color: "#8AA0FF", margin: "2px 0 0" }}>{trip.country} · {trip.dates.start}</p>
                  <p style={{ fontSize: 10, color: "rgba(245,247,255,0.35)", margin: "3px 0 0" }}>{trip.group.length} travelers · {trip.nights} nights</p>
                </div>
                <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── E. ADVENTURE LEGACY STATS ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.34em", color: "#8AA0FF", textTransform: "uppercase", margin: 0, marginBottom: 4 }}>YOUR HISTORY</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>Adventure Legacy</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { val: currentUser.stats.trips,     label: "Trips Taken",  color: "#C4DAFF" },
              { val: currentUser.stats.countries,  label: "Countries",    color: GOLD      },
              { val: currentUser.stats.hosted,     label: "Trips Hosted", color: "#8AA0FF" },
            ].map(({ val, label, color }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "18px 14px", textAlign: "center",
              }}>
                <p style={{ fontSize: 34, fontWeight: 800, color, letterSpacing: "-0.03em", margin: 0, lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 9, color: "rgba(245,247,255,0.38)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── F. FEATURE TAB SWITCHER ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Tab header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: 5, marginBottom: 20,
          }}>
            {([
              { key: "cards",   label: "Trip Cards"    },
              { key: "capsule", label: "PIK Capsule"   },
            ] as const).map(({ key, label }) => {
              const active = featureTab === key;
              return (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFeatureTab(key)}
                  style={{
                    height: 38, borderRadius: 11, border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: active ? 700 : 500,
                    background: active ? LOGO_GRAD : "transparent",
                    color: active ? "#fff" : "rgba(245,247,255,0.4)",
                    transition: "all 0.2s",
                    boxShadow: active ? "0 2px 12px rgba(123,92,255,0.35)" : "none",
                  }}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>

          {/* ── G. TRIP CARDS TAB ──────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {featureTab === "cards" && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Section label */}
                <div>
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.34em", color: "#8AA0FF", textTransform: "uppercase", margin: 0, marginBottom: 4 }}>MEMORIES</p>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>Trip Cards</h2>
                </div>

                {/* Year in Review */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(212,168,71,0.14) 0%, rgba(212,168,71,0.05) 100%)",
                  border: "1px solid rgba(212,168,71,0.28)", borderRadius: 18, padding: "20px",
                }}>
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase", margin: 0, marginBottom: 14 }}>2025 YEAR IN REVIEW</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                    {[
                      { val: "8", label: "Trips" },
                      { val: "6", label: "Countries" },
                      { val: "47", label: "Days Away" },
                      { val: "12", label: "Friends" },
                    ].map(({ val, label }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 26, fontWeight: 800, color: GOLD, margin: 0, letterSpacing: "-0.03em" }}>{val}</p>
                        <p style={{ fontSize: 8, color: "rgba(212,168,71,0.55)", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    style={{
                      marginTop: 16, width: "100%", height: 40, borderRadius: 999,
                      background: GOLD_GRAD, border: "none", cursor: "pointer",
                      fontSize: 12, fontWeight: 700, color: "#1A1200",
                    }}
                  >
                    View Full Year Recap
                  </motion.button>
                </div>

                {/* User-created trip cards carousel */}
                {userCards.length > 0 && (
                  <div style={{
                    display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4,
                    scrollbarWidth: "none", scrollSnapType: "x mandatory",
                  }}>
                    {userCards.map(card => (
                      <motion.div key={card.id} whileTap={{ scale: 0.97 }} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                        <CreatedTripCard card={card} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Memory cards from mock data */}
                {memories.slice(0, 3).map((mem, i) => (
                  <motion.div
                    key={mem.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.44, ease: EASE }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      borderRadius: 18, overflow: "hidden", cursor: "pointer",
                      height: i === 0 ? 190 : 130,
                      background: `linear-gradient(135deg, ${mem.gradientFrom}, ${mem.gradientTo})`,
                      position: "relative", boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,11,20,0.88) 0%, rgba(8,11,20,0.15) 60%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontSize: i === 0 ? 20 : 15, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.02em", margin: 0 }}>{mem.destination}</p>
                        <p style={{ fontSize: 9, color: "rgba(245,247,255,0.4)", margin: "3px 0 0" }}>{mem.country} · {mem.date} · {mem.photoCount} photos</p>
                      </div>
                      <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(245,247,255,0.45)", background: "rgba(0,0,0,0.5)", borderRadius: 999, padding: "3px 8px" }}>PIK CARD</span>
                    </div>
                  </motion.div>
                ))}

                {/* Bottom CTA bar */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 16,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>Memories</p>
                    <p style={{ fontSize: 11, color: "rgba(245,247,255,0.38)", margin: "3px 0 0" }}>
                      Capture a trip you took before joining PIK
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setBuilderOpen(true)}
                    style={{
                      height: 36, paddingLeft: 14, paddingRight: 14, borderRadius: 10,
                      background: "transparent", cursor: "pointer",
                      border: "1.5px dashed transparent",
                      backgroundImage: `linear-gradient(#080B14, #080B14), ${LOGO_GRAD}`,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      display: "flex", alignItems: "center", gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={14} style={{ color: "#8AA0FF" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, background: LOGO_GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      New Trip Card
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── H. PIK CAPSULE TAB ─────────────────────────────────────────────── */}
            {featureTab === "capsule" && (
              <motion.div
                key="capsule"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Section header — cinematic, spacious */}
                <div style={{ paddingBottom: 4 }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.34em",
                    color: "#8B72FF", textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}>PIK CAPSULE</p>
                  <h2 style={{
                    fontSize: 24, fontWeight: 800, color: "#F5F7FF",
                    letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 10px",
                  }}>Time-Locked Memories</h2>
                  <p style={{
                    fontSize: 13, color: "rgba(245,247,255,0.42)",
                    margin: 0, lineHeight: 1.55,
                  }}>
                    Preserve your trip moments and unlock them when the memory is ready.
                  </p>
                </div>

                {/* Capsule cards — full-bleed horizontal snap carousel, 280px cards */}
                <div
                  style={{
                    display: "flex", gap: 14, overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    paddingBottom: 8,
                    /* Bleed to screen edges so the carousel feels full-width */
                    marginLeft: -20, marginRight: -20,
                    paddingLeft: 20, paddingRight: 20,
                    scrollbarWidth: "none",
                  } as React.CSSProperties}
                >
                  {/* User-created capsules */}
                  {userCapsules.map(cap => (
                    <motion.div key={cap.id} whileTap={{ scale: 0.97 }} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                      <CapsuleCard capsule={cap} />
                    </motion.div>
                  ))}

                  {CAPSULES.map((cap) => (
                    <motion.div
                      key={cap.id}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flexShrink: 0,
                        width: 280, height: 178,
                        borderRadius: 20,
                        background: `linear-gradient(160deg, ${cap.gradientFrom} 0%, ${cap.gradientTo} 100%)`,
                        position: "relative", overflow: "hidden", cursor: "pointer",
                        border: cap.sealed
                          ? "1px solid rgba(123,92,255,0.2)"
                          : "1px solid rgba(212,168,71,0.4)",
                        scrollSnapAlign: "start",
                        boxShadow: cap.sealed
                          ? "0 6px 22px rgba(0,0,0,0.45)"
                          : "0 0 14px rgba(212,168,71,0.15), 0 6px 22px rgba(0,0,0,0.45)",
                      }}
                    >
                      {/* Soft ambient glow */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: cap.sealed
                          ? "radial-gradient(ellipse at 25% 50%, rgba(123,92,255,0.1) 0%, transparent 60%)"
                          : "radial-gradient(ellipse at 25% 50%, rgba(212,168,71,0.12) 0%, transparent 60%)",
                        pointerEvents: "none",
                      }} />

                      {/* Card content */}
                      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", padding: "14px 16px 14px" }}>

                        {/* Top row — date pill + optional unlock badge */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <div style={{
                            background: "rgba(0,0,0,0.38)", backdropFilter: "blur(8px)",
                            borderRadius: 999, padding: "3px 10px",
                            border: "1px solid rgba(255,255,255,0.09)",
                          }}>
                            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(245,247,255,0.5)", letterSpacing: "0.03em" }}>
                              Sealed {cap.sealedDate}
                            </span>
                          </div>
                          {!cap.sealed && (
                            <div style={{
                              background: "rgba(107,255,170,0.1)", border: "1px solid rgba(107,255,170,0.3)",
                              borderRadius: 999, padding: "3px 9px",
                            }}>
                              <span style={{ fontSize: 8, fontWeight: 700, color: "#6BFFAA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                Ready
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Middle — lock icon + countdown number */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                            background: cap.sealed ? "rgba(255,255,255,0.06)" : "rgba(212,168,71,0.12)",
                            border: `1px solid ${cap.sealed ? "rgba(255,255,255,0.1)" : "rgba(212,168,71,0.4)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: cap.sealed ? "none" : "0 0 10px rgba(212,168,71,0.3)",
                          }}>
                            <Lock size={15} style={{ color: cap.sealed ? "rgba(245,247,255,0.45)" : GOLD }} />
                          </div>
                          {cap.sealed && cap.daysLeft > 0 ? (
                            <div>
                              <p style={{ fontSize: 32, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.04em", margin: 0, lineHeight: 1 }}>
                                {cap.daysLeft}
                              </p>
                              <p style={{ fontSize: 8, color: "rgba(245,247,255,0.35)", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                days to unlock
                              </p>
                            </div>
                          ) : (
                            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(245,247,255,0.55)", margin: 0, lineHeight: 1.4 }}>
                              Tap to open<br/>your memories
                            </p>
                          )}
                        </div>

                        {/* Bottom — title + location */}
                        <div style={{ marginTop: 10 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0, letterSpacing: "-0.02em" }}>
                            {cap.title}
                          </p>
                          <p style={{ fontSize: 10, color: "rgba(245,247,255,0.32)", margin: "2px 0 0" }}>
                            {cap.destination} · {cap.sealed ? `Unlocks ${cap.unlockDate}` : "Ready to open"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Create a PIK Capsule CTA — clean, no competing noise */}
                <div style={{
                  background: "rgba(123,92,255,0.08)",
                  border: "1px solid rgba(139,92,255,0.18)", borderRadius: 20, padding: "20px",
                }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: LOGO_GRAD, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 0 14px rgba(123,92,255,0.35)",
                    }}>
                      <Lock size={18} style={{ color: "#fff" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F7FF", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                        Seal the moment.
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(245,247,255,0.38)", margin: 0, lineHeight: 1.5 }}>
                        Lock photos and memories. Unlock when you're ready.
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setCapsuleOpen(true)}
                    style={{
                      width: "100%", height: 44, borderRadius: 999,
                      background: LOGO_GRAD, border: "none", cursor: "pointer",
                      fontSize: 14, fontWeight: 700, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 4px 14px rgba(123,92,255,0.32)",
                    }}
                  >
                    <Plus size={15} />
                    Create a PIK Capsule
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Trip Card Builder modal */}
      <AnimatePresence>
        {builderOpen && (
          <TripCardBuilder
            key="trip-card-builder"
            onSave={handleCardSave}
            onClose={() => setBuilderOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Capsule Builder modal */}
      <AnimatePresence>
        {capsuleOpen && (
          <CapsuleBuilder
            key="capsule-builder"
            onSave={handleCapsuleSave}
            onClose={() => setCapsuleOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed", bottom: 96, left: 20, right: 20, zIndex: 600,
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(107,255,170,0.35)",
              borderRadius: 14, padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 10,
              backdropFilter: "blur(12px)",
            }}
          >
            <Check size={16} style={{ color: "#6BFFAA", flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#F5F7FF" }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
