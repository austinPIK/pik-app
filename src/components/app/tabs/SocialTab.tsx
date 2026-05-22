import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, Bookmark, BookmarkCheck, Share2, ChevronRight,
  UserPlus, Check, MapPin, Calendar, ArrowLeft, X, Upload,
  Star, Clock, Users, Sparkles, Camera, Tag, Eye, Globe,
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
const BADGE_GRAD_ID = "pik-verified-grad";

function PikVerifiedBadge({ label = "Verified PIK user" }: { label?: string }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 18 18" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label} role="img"
      style={{ flexShrink: 0, filter: "drop-shadow(0 0 4px rgba(180,140,255,0.55)) drop-shadow(0 0 8px rgba(212,168,71,0.28))" }}
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
      <path
        d="M9 1.5 L11.18 3.82 L14.25 3.75 L14.18 6.82 L16.5 9 L14.18 11.18 L14.25 14.25 L11.18 14.18 L9 16.5 L6.82 14.18 L3.75 14.25 L3.82 11.18 L1.5 9 L3.82 6.82 L3.75 3.75 L6.82 3.82 Z"
        fill={`url(#${BADGE_GRAD_ID})`}
      />
      <path d="M6.2 9.1 L8.0 10.9 L11.8 7.1" stroke="#06080F" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

type TripType = "Adventure" | "Luxury" | "Solo" | "Couples" | "Backpacking" | "Family" | "Wellness" | "Weekend" | "International" | "Hidden Gems" | "Cultural" | "Honeymoon";

interface ItineraryDay {
  day: number;
  location: string;
  activity: string;
  duration: string;
  cost: string;
}

interface SocialCard {
  id: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    isHost: boolean;
    rating?: number;
    reviews?: number;
    tripsHosted?: number;
  };
  destination: string;
  title: string;
  img: string;
  duration: string;
  tripType: TripType;
  tags: string[];
  rating: number;
  likes: number;
  saves: number;
  bookings: number;
  caption: string;
  itinerary: ItineraryDay[];
}

interface HostProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  tripsHosted: number;
  travelersHosted: number;
  topDest: string;
  rating: number;
  reviews: number;
  heroImg: string;
  featuredCard: Pick<SocialCard, "id" | "title" | "destination" | "img" | "tripType" | "duration">;
}

interface TravelerProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  countries: number;
  trips: number;
  followers: string;
  cards: Pick<SocialCard, "id" | "title" | "destination" | "img" | "tripType">[];
}

const SOCIAL_CARDS: SocialCard[] = [
  {
    id: "sc1",
    creator: { name: "Elena Vasquez", handle: "@elenaexplores", avatar: "EV", isHost: true, rating: 4.98, reviews: 289, tripsHosted: 47 },
    destination: "Patagonia, Argentina",
    title: "11 Days at the End of the World",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    duration: "11 days",
    tripType: "Adventure",
    tags: ["hiking", "glaciers", "remote", "group"],
    rating: 4.97,
    likes: 2841, saves: 634, bookings: 89,
    caption: "Nothing prepares you for the scale of Torres del Paine. We hiked, we cried, we went back.",
    itinerary: [
      { day: 1, location: "Punta Arenas, Chile", activity: "Arrival & City Walk", duration: "Full day", cost: "Included" },
      { day: 2, location: "Puerto Natales",      activity: "Transfer & Gear Setup", duration: "Full day", cost: "$80/person" },
      { day: 3, location: "Torres del Paine",    activity: "W Circuit — Mirador Base", duration: "8 hrs", cost: "Included" },
      { day: 4, location: "Valle del Francés",   activity: "W Circuit — Glacier viewpoints", duration: "9 hrs", cost: "Included" },
      { day: 5, location: "Grey Glacier",        activity: "Ice Trek & Kayak", duration: "7 hrs", cost: "$120/person" },
      { day: 6, location: "Mirador Las Torres",  activity: "Sunrise hike to the towers", duration: "5 hrs", cost: "Included" },
    ],
  },
  {
    id: "sc2",
    creator: { name: "Marcus Webb", handle: "@marcusroams", avatar: "MW", isHost: false },
    destination: "Kyoto, Japan",
    title: "7 Days of Ancient Silence",
    img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    duration: "7 days",
    tripType: "Cultural",
    tags: ["temples", "solo", "zen", "off-season"],
    rating: 4.93,
    likes: 2103, saves: 589, bookings: 0,
    caption: "The bamboo grove at 5am. No one else there. That's the whole trip right there.",
    itinerary: [
      { day: 1, location: "Arashiyama",  activity: "Bamboo Grove at dawn", duration: "3 hrs", cost: "Free" },
      { day: 2, location: "Fushimi Inari", activity: "Full torii gate hike", duration: "5 hrs", cost: "Free" },
      { day: 3, location: "Gion",        activity: "Tea ceremony + evening walk", duration: "4 hrs", cost: "$60/person" },
      { day: 4, location: "Nishiki Market", activity: "Food tour + cooking class", duration: "6 hrs", cost: "$90/person" },
    ],
  },
  {
    id: "sc3",
    creator: { name: "David Kim", handle: "@davidkimtravel", avatar: "DK", isHost: true, rating: 4.95, reviews: 174, tripsHosted: 31 },
    destination: "Bali, Indonesia",
    title: "14 Nights of Sacred Stillness",
    img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80",
    duration: "14 days",
    tripType: "Wellness",
    tags: ["yoga", "retreat", "couples", "rice-fields"],
    rating: 4.96,
    likes: 1876, saves: 421, bookings: 54,
    caption: "We traded our phones for sunrise yoga and somehow came back better at our jobs.",
    itinerary: [
      { day: 1, location: "Ubud",        activity: "Arrival, orientation & jungle villa", duration: "Full day", cost: "Included" },
      { day: 2, location: "Tegalalang",  activity: "Rice terrace walk & local breakfast", duration: "4 hrs", cost: "Included" },
      { day: 3, location: "Tirta Empul", activity: "Water temple purification ceremony", duration: "3 hrs", cost: "$25/person" },
      { day: 4, location: "Mount Batur", activity: "Pre-dawn volcano summit hike", duration: "6 hrs", cost: "$45/person" },
    ],
  },
  {
    id: "sc4",
    creator: { name: "Aisha Musa", handle: "@aishawanders", avatar: "AM", isHost: false },
    destination: "Maldives",
    title: "10 Nights Above the Lagoon",
    img: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80",
    duration: "10 days",
    tripType: "Honeymoon",
    tags: ["overwater", "snorkeling", "couples", "luxury"],
    rating: 4.99,
    likes: 3421, saves: 892, bookings: 0,
    caption: "Woke up and snorkeled off my deck before breakfast. Every. Single. Morning.",
    itinerary: [
      { day: 1, location: "Malé Atoll",     activity: "Seaplane transfer + villa check-in", duration: "Full day", cost: "Included" },
      { day: 2, location: "House Reef",     activity: "Sunrise snorkel & dolphin cruise", duration: "4 hrs", cost: "Included" },
      { day: 3, location: "Baa Atoll",      activity: "Manta ray snorkeling (seasonal)", duration: "6 hrs", cost: "$80/person" },
      { day: 4, location: "Underwater Spa", activity: "Submerged couples massage", duration: "2 hrs", cost: "$340/couple" },
    ],
  },
  {
    id: "sc5",
    creator: { name: "Priya Nair", handle: "@priya.wanders", avatar: "PN", isHost: false },
    destination: "Amalfi Coast, Italy",
    title: "A Week of Dolce Vita",
    img: "https://images.unsplash.com/photo-1555990538-c4fb98bd3f9e?w=800&q=80",
    duration: "7 days",
    tripType: "Luxury",
    tags: ["mediterranean", "food", "solo-female", "scenic"],
    rating: 4.88,
    likes: 1244, saves: 312, bookings: 0,
    caption: "Limoncello at sunset over the Tyrrhenian Sea. I've retired from regular travel.",
    itinerary: [
      { day: 1, location: "Naples",    activity: "Arrival + pizza at Da Michele", duration: "Evening", cost: "Free" },
      { day: 2, location: "Positano",  activity: "Cliffside walk + boat rental", duration: "Full day", cost: "$95/person" },
      { day: 3, location: "Ravello",   activity: "Villa Rufolo gardens + concert", duration: "6 hrs", cost: "$40/person" },
      { day: 4, location: "Capri",     activity: "Blue Grotto + Via Krupp hike", duration: "Full day", cost: "$60/person" },
    ],
  },
  {
    id: "sc6",
    creator: { name: "Amara Osei", handle: "@amaraadventures", avatar: "AO", isHost: true, rating: 4.97, reviews: 132, tripsHosted: 24 },
    destination: "Serengeti, Tanzania",
    title: "Great Migration Safari: 9 Days",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    duration: "9 days",
    tripType: "Adventure",
    tags: ["safari", "wildlife", "small-group", "bucket-list"],
    rating: 4.99,
    likes: 4102, saves: 1203, bookings: 112,
    caption: "One million wildebeest crossing the Mara River. No filter. No words.",
    itinerary: [
      { day: 1, location: "Arusha",       activity: "Welcome dinner & briefing", duration: "Evening", cost: "Included" },
      { day: 2, location: "Ngorongoro",   activity: "Crater game drive", duration: "8 hrs", cost: "Included" },
      { day: 3, location: "Central Serengeti", activity: "Big Five tracking", duration: "Full day", cost: "Included" },
      { day: 4, location: "Mara River",   activity: "Wildebeest crossing viewpoint", duration: "Full day", cost: "Included" },
      { day: 5, location: "Balloon Safari", activity: "Sunrise hot-air balloon", duration: "3 hrs", cost: "$480/person" },
    ],
  },
];

const TOP_HOSTS: HostProfile[] = [
  {
    id: "h1", name: "Elena Vasquez", handle: "@elenaexplores", avatar: "EV",
    tripsHosted: 47, travelersHosted: 312, topDest: "Patagonia",
    rating: 4.98, reviews: 289,
    heroImg: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=75",
    featuredCard: { id: "sc1", title: "11 Days at the End of the World", destination: "Patagonia, Argentina", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=75", tripType: "Adventure", duration: "11 days" },
  },
  {
    id: "h2", name: "David Kim", handle: "@davidkimtravel", avatar: "DK",
    tripsHosted: 31, travelersHosted: 198, topDest: "Southeast Asia",
    rating: 4.95, reviews: 174,
    heroImg: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=75",
    featuredCard: { id: "sc3", title: "14 Nights of Sacred Stillness", destination: "Bali, Indonesia", img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=75", tripType: "Wellness", duration: "14 days" },
  },
  {
    id: "h3", name: "Amara Osei", handle: "@amaraadventures", avatar: "AO",
    tripsHosted: 24, travelersHosted: 156, topDest: "East Africa",
    rating: 4.97, reviews: 132,
    heroImg: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=75",
    featuredCard: { id: "sc6", title: "Great Migration Safari: 9 Days", destination: "Serengeti, Tanzania", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=75", tripType: "Adventure", duration: "9 days" },
  },
  {
    id: "h4", name: "Luca Ferrari", handle: "@lucaontheroad", avatar: "LF",
    tripsHosted: 19, travelersHosted: 124, topDest: "Mediterranean",
    rating: 4.93, reviews: 98,
    heroImg: "https://images.unsplash.com/photo-1555990538-c4fb98bd3f9e?w=600&q=75",
    featuredCard: { id: "hx4", title: "Cinque Terre in 8 Days", destination: "Liguria, Italy", img: "https://images.unsplash.com/photo-1555990538-c4fb98bd3f9e?w=400&q=75", tripType: "Luxury", duration: "8 days" },
  },
];

const FEATURED_TRAVELERS: TravelerProfile[] = [
  {
    id: "t1", name: "Maya Rodriguez", handle: "@mayaroams", avatar: "MR",
    countries: 34, trips: 28, followers: "4.2K",
    cards: [
      { id: "tc1a", title: "Solo Through Patagonia", destination: "Chile", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=75", tripType: "Solo" },
      { id: "tc1b", title: "Hidden Beaches of Yucatán", destination: "Mexico", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=75", tripType: "Hidden Gems" },
    ],
  },
  {
    id: "t2", name: "James Park", handle: "@jamesparkt", avatar: "JP",
    countries: 22, trips: 19, followers: "2.8K",
    cards: [
      { id: "tc2a", title: "Kyoto on a Budget", destination: "Japan", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&q=75", tripType: "Backpacking" },
      { id: "tc2b", title: "Vietnam End-to-End", destination: "Vietnam", img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=300&q=75", tripType: "International" },
    ],
  },
  {
    id: "t3", name: "Aisha Musa", handle: "@aishawanders", avatar: "AM",
    countries: 41, trips: 37, followers: "6.1K",
    cards: [
      { id: "tc3a", title: "Maldives Overwater Bliss", destination: "Maldives", img: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=300&q=75", tripType: "Honeymoon" },
      { id: "tc3b", title: "Safari Solo: East Africa", destination: "Tanzania", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&q=75", tripType: "Adventure" },
    ],
  },
  {
    id: "t4", name: "Tom Erikson", handle: "@tomerik", avatar: "TE",
    countries: 18, trips: 14, followers: "1.5K",
    cards: [
      { id: "tc4a", title: "Norwegian Fjords Weekend", destination: "Norway", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&q=75", tripType: "Weekend" },
      { id: "tc4b", title: "Dolomites Family Trek", destination: "Italy", img: "https://images.unsplash.com/photo-1531016010-40b5941ec703?w=300&q=75", tripType: "Family" },
    ],
  },
];

const TRIP_TYPE_PILLS: TripType[] = ["Adventure", "Luxury", "Solo", "Couples", "Backpacking", "Family", "Wellness", "Weekend", "International", "Hidden Gems"];

type SectionFilter = "trending" | "hosts" | "travelers";

// ── Upload Trip Card sheet ────────────────────────────────────────────────────

interface UploadSheetProps {
  onClose: () => void;
}

function UploadTripCardSheet({ onClose }: UploadSheetProps) {
  const [step, setStep] = useState<"details" | "itinerary" | "publish">("details");
  const [form, setForm] = useState({
    destination: "",
    tripType: "" as TripType | "",
    caption: "",
    tags: "",
    status: "completed" as "completed" | "upcoming",
    visibility: "public" as "public" | "followers",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  return createPortal(
    <motion.div
      key="upload-sheet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.42, ease: EASE }}
        style={{
          width: "100%", maxHeight: "92vh", borderRadius: "24px 24px 0 0",
          background: "#0E1120", border: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "none", overflowY: "auto", WebkitOverflowScrolling: "touch" as const,
          paddingBottom: "max(env(safe-area-inset-bottom), 24px)",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", color: "#8AA0FF", textTransform: "uppercase", margin: "0 0 4px" }}>SHARE YOUR JOURNEY</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0 }}>Upload Trip Card</h2>
          </div>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} style={{ color: "#9BA3B7" }} />
          </motion.button>
        </div>

        {/* Step pills */}
        <div style={{ display: "flex", gap: 6, padding: "16px 20px 0" }}>
          {(["details", "itinerary", "publish"] as const).map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: step === s ? LOGO_GRAD : (["details", "itinerary", "publish"].indexOf(step) > i ? "rgba(107,159,238,0.45)" : "rgba(255,255,255,0.1)"),
            }} />
          ))}
        </div>

        <div style={{ padding: "20px 20px 0" }}>
          {step === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Photo upload */}
              <div style={{
                height: 140, borderRadius: 16,
                background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.12)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
              }}>
                <Camera size={24} style={{ color: "rgba(245,247,255,0.3)" }} />
                <p style={{ fontSize: 12, color: "rgba(245,247,255,0.38)", margin: 0 }}>Add photos & hero image</p>
              </div>

              <input
                value={form.destination}
                onChange={e => set("destination")(e.target.value)}
                placeholder="Destination (e.g. Kyoto, Japan)"
                style={{ height: 48, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", padding: "0 14px", fontSize: 14, color: "#F5F7FF", width: "100%", boxSizing: "border-box" }}
              />

              {/* Trip type grid */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,247,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Trip Type</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TRIP_TYPE_PILLS.map(t => (
                    <motion.button key={t} whileTap={{ scale: 0.93 }}
                      onClick={() => set("tripType")(form.tripType === t ? "" : t)}
                      style={{
                        height: 30, paddingLeft: 12, paddingRight: 12, borderRadius: 999, border: "none", cursor: "pointer",
                        fontSize: 11, fontWeight: 600,
                        background: form.tripType === t ? "rgba(123,92,255,0.28)" : "rgba(255,255,255,0.06)",
                        color: form.tripType === t ? "#C4DAFF" : "rgba(245,247,255,0.45)",
                        outline: form.tripType === t ? "1px solid rgba(123,92,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        outlineOffset: -1,
                      }}>
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>

              <textarea
                value={form.caption}
                onChange={e => set("caption")(e.target.value)}
                placeholder="Caption — what made this trip unforgettable?"
                rows={3}
                style={{ borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", padding: "12px 14px", fontSize: 14, color: "#F5F7FF", resize: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
              />

              <input
                value={form.tags}
                onChange={e => set("tags")(e.target.value)}
                placeholder="Tags (e.g. hiking, solo, hidden-gems)"
                style={{ height: 48, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", padding: "0 14px", fontSize: 14, color: "#F5F7FF", width: "100%", boxSizing: "border-box" }}
              />

              {/* Status toggle */}
              <div style={{ display: "flex", gap: 8 }}>
                {(["completed", "upcoming"] as const).map(s => (
                  <motion.button key={s} whileTap={{ scale: 0.94 }}
                    onClick={() => set("status")(s)}
                    style={{
                      flex: 1, height: 42, borderRadius: 12, border: "none", cursor: "pointer",
                      fontSize: 12, fontWeight: 600,
                      background: form.status === s ? "rgba(107,255,170,0.12)" : "rgba(255,255,255,0.05)",
                      color: form.status === s ? "#6BFFAA" : "rgba(245,247,255,0.38)",
                      outline: form.status === s ? "1px solid rgba(107,255,170,0.3)" : "1px solid rgba(255,255,255,0.07)",
                      outlineOffset: -1, textTransform: "capitalize",
                    }}>
                    {s === "completed" ? "✓ Completed" : "◎ Upcoming"}
                  </motion.button>
                ))}
              </div>

              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => setStep("itinerary")}
                disabled={!form.destination || !form.tripType}
                style={{
                  height: 50, borderRadius: 999, border: "none", cursor: form.destination && form.tripType ? "pointer" : "not-allowed",
                  background: form.destination && form.tripType ? LOGO_GRAD : "rgba(255,255,255,0.06)",
                  fontSize: 14, fontWeight: 700,
                  color: form.destination && form.tripType ? "#fff" : "rgba(245,247,255,0.25)",
                  marginBottom: 8,
                }}>
                Next: Add Itinerary
              </motion.button>
            </div>
          )}

          {step === "itinerary" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 13, color: "rgba(245,247,255,0.5)", margin: 0, lineHeight: 1.55 }}>
                Add day-by-day details so other travelers can follow your exact path.
              </p>
              {[1, 2, 3, 4].map(day => (
                <div key={day} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: LOGO_GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {day}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(245,247,255,0.5)" }}>Day {day}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input placeholder="Location" style={{ height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", outline: "none", padding: "0 12px", fontSize: 13, color: "#F5F7FF", width: "100%", boxSizing: "border-box" }} />
                    <input placeholder="Activity" style={{ height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", outline: "none", padding: "0 12px", fontSize: 13, color: "#F5F7FF", width: "100%", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <input placeholder="Duration" style={{ flex: 1, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", outline: "none", padding: "0 12px", fontSize: 13, color: "#F5F7FF", boxSizing: "border-box" }} />
                      <input placeholder="Est. cost" style={{ flex: 1, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", outline: "none", padding: "0 12px", fontSize: 13, color: "#F5F7FF", boxSizing: "border-box" }} />
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep("details")}
                  style={{ flex: 1, height: 48, borderRadius: 999, border: "1.5px solid rgba(138,160,255,0.35)", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#8AA0FF" }}>
                  Back
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("publish")}
                  style={{ flex: 2, height: 48, borderRadius: 999, border: "none", cursor: "pointer", background: LOGO_GRAD, fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  Next: Publish
                </motion.button>
              </div>
            </div>
          )}

          {step === "publish" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={14} style={{ color: "#8AA0FF", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#F5F7FF" }}>{form.destination}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Tag size={14} style={{ color: GOLD, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#F5F7FF" }}>{form.tripType}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Eye size={14} style={{ color: "#6BFFAA", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#F5F7FF" }}>Visible to: Everyone</span>
                </div>
              </div>

              {/* Visibility */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,247,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Visibility</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["public", "followers"] as const).map(v => (
                    <motion.button key={v} whileTap={{ scale: 0.94 }}
                      onClick={() => set("visibility")(v)}
                      style={{
                        flex: 1, height: 42, borderRadius: 12, border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600,
                        background: form.visibility === v ? "rgba(123,92,255,0.2)" : "rgba(255,255,255,0.05)",
                        color: form.visibility === v ? "#C4DAFF" : "rgba(245,247,255,0.38)",
                        outline: form.visibility === v ? "1px solid rgba(123,92,255,0.4)" : "1px solid rgba(255,255,255,0.07)",
                        outlineOffset: -1,
                      }}>
                      {v === "public" ? <><Globe size={12} style={{ display: "inline", marginRight: 5 }} />Public</> : <><Users size={12} style={{ display: "inline", marginRight: 5 }} />Followers</>}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep("itinerary")}
                  style={{ flex: 1, height: 48, borderRadius: 999, border: "1.5px solid rgba(138,160,255,0.35)", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#8AA0FF" }}>
                  Back
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
                  style={{ flex: 2, height: 48, borderRadius: 999, border: "none", cursor: "pointer", background: GOLD_GRAD, fontSize: 14, fontWeight: 700, color: "#1A1200", boxShadow: "0 4px 18px rgba(212,168,71,0.38)" }}>
                  Publish Trip Card
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ── Itinerary detail overlay ──────────────────────────────────────────────────

function ItineraryOverlay({ card, followed, onFollow, onClose }: {
  card: SocialCard;
  followed: boolean;
  onFollow: () => void;
  onClose: () => void;
}) {
  return createPortal(
    <motion.div
      key="itinerary-detail"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.42, ease: EASE }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#080B14", overflowY: "auto", WebkitOverflowScrolling: "touch" as const }}
    >
      {/* Hero */}
      <div style={{ position: "relative", height: 260, flexShrink: 0 }}>
        <img src={card.img} alt={card.destination} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,11,20,0.95) 0%, rgba(8,11,20,0.2) 60%, rgba(8,11,20,0.5) 100%)" }} />
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          style={{ position: "absolute", top: "max(env(safe-area-inset-top, 52px), 52px)", left: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(8,11,20,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={16} style={{ color: "#F5F7FF" }} />
        </motion.button>
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#8AA0FF", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(138,160,255,0.2)", border: "1px solid rgba(138,160,255,0.35)", borderRadius: 999, padding: "3px 10px" }}>{card.tripType}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(212,168,71,0.12)", border: "1px solid rgba(212,168,71,0.3)", borderRadius: 999, padding: "3px 10px" }}>★ {card.rating}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(245,247,255,0.55)", background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: "3px 10px" }}>{card.duration}</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F5F7FF", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>{card.title}</h2>
          <p style={{ fontSize: 11, color: "rgba(245,247,255,0.5)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.destination}</p>
        </div>
      </div>

      <div style={{ padding: "20px 20px 160px" }}>
        {/* Creator card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 18, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", boxShadow: card.creator.isHost ? "0 0 0 2px rgba(212,168,71,0.45)" : "none" }}>
              {card.creator.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{card.creator.name}</p>
                {card.creator.isHost && <PikVerifiedBadge label="Verified PIK host" />}
              </div>
              <p style={{ fontSize: 11, color: "#8AA0FF", margin: 0 }}>{card.creator.handle}</p>
              {card.creator.isHost && card.creator.rating && (
                <p style={{ fontSize: 10, color: "rgba(245,247,255,0.4)", margin: "2px 0 0" }}>★ {card.creator.rating} · {card.creator.reviews} reviews</p>
              )}
            </div>
            <motion.button whileTap={{ scale: 0.92 }} onClick={onFollow}
              style={{ height: 32, paddingLeft: 16, paddingRight: 16, borderRadius: 999, background: followed ? "rgba(123,92,255,0.2)" : LOGO_GRAD, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: followed ? "#8AA0FF" : "#fff", outline: followed ? "1px solid rgba(123,92,255,0.4)" : "none", outlineOffset: -1, flexShrink: 0 }}>
              {followed ? "Following" : "Follow"}
            </motion.button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { val: card.creator.isHost ? String(card.creator.tripsHosted ?? "–") : "–", label: "Hosted" },
              { val: "★" + card.rating, label: "Rating" },
              { val: card.saves.toLocaleString(), label: "Saves" },
              { val: card.bookings > 0 ? String(card.bookings) : "–", label: "Bookings" },
            ].map(({ val, label }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#F5F7FF", margin: 0, letterSpacing: "-0.02em" }}>{val}</p>
                <p style={{ fontSize: 8, color: "rgba(245,247,255,0.38)", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {card.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {card.tags.map(tag => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,247,255,0.45)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "4px 10px" }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Itinerary */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.34em", color: "#8AA0FF", textTransform: "uppercase", margin: 0 }}>FULL ITINERARY</p>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {card.itinerary.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.38, ease: EASE }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: LOGO_GRAD, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>
                  {day.day}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0, lineHeight: 1.2 }}>{day.activity}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    <MapPin size={9} style={{ color: "#8AA0FF", flexShrink: 0 }} />
                    <p style={{ fontSize: 10, color: "#8AA0FF", margin: 0 }}>{day.location}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(245,247,255,0.45)", background: "rgba(255,255,255,0.05)", borderRadius: 999, padding: "2px 8px" }}>{day.duration}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: day.cost === "Free" || day.cost === "Included" ? "#6BFFAA" : GOLD, background: day.cost === "Free" || day.cost === "Included" ? "rgba(107,255,170,0.1)" : "rgba(212,168,71,0.1)", borderRadius: 999, padding: "2px 8px" }}>{day.cost}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "14px 20px max(env(safe-area-inset-bottom), 28px)", background: "linear-gradient(to top, rgba(8,11,20,1) 60%, transparent 100%)", display: "flex", gap: 10 }}>
        {card.creator.isHost ? (
          <>
            <motion.button whileTap={{ scale: 0.96 }}
              style={{ flex: 1, height: 50, borderRadius: 999, background: GOLD_GRAD, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#1A1200", boxShadow: "0 4px 18px rgba(212,168,71,0.38)" }}>
              Book Trip
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }}
              style={{ flex: 1, height: 50, borderRadius: 999, background: "transparent", border: "1.5px solid rgba(138,160,255,0.45)", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#8AA0FF" }}>
              Request to Join
            </motion.button>
          </>
        ) : (
          <>
            <motion.button whileTap={{ scale: 0.96 }}
              style={{ flex: 1, height: 50, borderRadius: 999, background: LOGO_GRAD, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              Build Similar Trip
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }}
              style={{ flex: 1, height: 50, borderRadius: 999, background: "rgba(212,168,71,0.12)", border: "1.5px solid rgba(212,168,71,0.35)", cursor: "pointer", fontSize: 11, fontWeight: 700, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Sparkles size={13} />Ask Varix
            </motion.button>
          </>
        )}
      </div>
    </motion.div>,
    document.body
  );
}

// ── Trip Card component ───────────────────────────────────────────────────────

function SocialTripCard({
  card, liked, saved, followed,
  onLike, onSave, onFollow, onViewItinerary,
  index,
}: {
  card: SocialCard;
  liked: boolean; saved: boolean; followed: boolean;
  onLike: () => void; onSave: () => void; onFollow: () => void;
  onViewItinerary: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.48, ease: EASE }}
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.45)" }}
    >
      {/* Creator row */}
      <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", boxShadow: card.creator.isHost ? `0 0 0 2px ${GOLD}55` : "none" }}>
            {card.creator.avatar}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{card.creator.name}</p>
              {card.creator.isHost && <PikVerifiedBadge label="Verified PIK host" />}
            </div>
            <p style={{ fontSize: 10, color: "#8AA0FF", margin: "1px 0 0" }}>{card.creator.handle}</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={onFollow}
          style={{ height: 30, paddingLeft: 14, paddingRight: 14, borderRadius: 999, background: followed ? "rgba(123,92,255,0.2)" : LOGO_GRAD, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: followed ? "#8AA0FF" : "#fff", outline: followed ? "1px solid rgba(123,92,255,0.4)" : "none", outlineOffset: -1 }}>
          {followed ? "Following" : "Follow"}
        </motion.button>
      </div>

      {/* Hero image */}
      <div style={{ position: "relative", height: 230, cursor: "pointer" }} onClick={onViewItinerary}>
        <img src={card.img} alt={card.destination} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,11,20,0.9) 0%, rgba(8,11,20,0.1) 55%)" }} />

        {/* Badges top-left */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#8AA0FF", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(138,160,255,0.2)", border: "1px solid rgba(138,160,255,0.35)", borderRadius: 999, padding: "3px 10px" }}>{card.tripType}</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(245,247,255,0.55)", background: "rgba(0,0,0,0.45)", borderRadius: 999, padding: "3px 10px", backdropFilter: "blur(4px)" }}>{card.duration}</span>
        </div>

        {/* Rating top-right */}
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
          <Star size={9} style={{ color: GOLD, fill: GOLD }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: GOLD }}>{card.rating}</span>
        </div>

        {/* Title bottom */}
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <h3 style={{ fontSize: 19, fontWeight: 700, color: "#F5F7FF", letterSpacing: "-0.025em", margin: 0, lineHeight: 1.1 }}>{card.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
            <MapPin size={9} style={{ color: "rgba(245,247,255,0.45)", flexShrink: 0 }} />
            <p style={{ fontSize: 10, color: "rgba(245,247,255,0.45)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em" }}>{card.destination}</p>
          </div>
        </div>

        {/* View itinerary overlay hint */}
        <div style={{ position: "absolute", bottom: 12, right: 14, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#F5F7FF" }}>View Itinerary</span>
          <ChevronRight size={10} style={{ color: "#F5F7FF" }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Heart size={12} style={{ color: liked ? "#FF6B8A" : "#9BA3B7" }} />
          <span style={{ fontSize: 11, color: "#9BA3B7", fontWeight: 500 }}>{(card.likes + (liked ? 1 : 0)).toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Bookmark size={12} style={{ color: saved ? GOLD : "#9BA3B7" }} />
          <span style={{ fontSize: 11, color: "#9BA3B7", fontWeight: 500 }}>{(card.saves + (saved ? 1 : 0)).toLocaleString()}</span>
        </div>
        {card.bookings > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Calendar size={12} style={{ color: "#6BFFAA" }} />
            <span style={{ fontSize: 11, color: "#6BFFAA", fontWeight: 600 }}>{card.bookings} booked</span>
          </div>
        )}
        <div style={{ flex: 1 }} />
        {card.tags.slice(0, 2).map(tag => (
          <span key={tag} style={{ fontSize: 9, color: "rgba(245,247,255,0.35)", background: "rgba(255,255,255,0.04)", borderRadius: 999, padding: "2px 7px" }}>#{tag}</span>
        ))}
      </div>

      {/* Caption */}
      <div style={{ padding: "10px 16px 4px" }}>
        <p style={{ fontSize: 13, color: "rgba(245,247,255,0.6)", lineHeight: 1.55, margin: 0, fontStyle: "italic" }}>"{card.caption}"</p>
      </div>

      {/* Action row */}
      <div style={{ padding: "10px 12px 14px", display: "flex", alignItems: "center", gap: 6 }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onLike}
          style={{ flex: 1, height: 38, borderRadius: 10, border: "none", cursor: "pointer", background: liked ? "rgba(255,107,138,0.18)" : "rgba(255,255,255,0.05)", outline: liked ? "1px solid rgba(255,107,138,0.4)" : "1px solid rgba(255,255,255,0.07)", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Heart size={13} style={{ color: liked ? "#FF6B8A" : "#9BA3B7" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: liked ? "#FF6B8A" : "#9BA3B7" }}>Like</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.88 }} onClick={onSave}
          style={{ flex: 1, height: 38, borderRadius: 10, border: "none", cursor: "pointer", background: saved ? "rgba(212,168,71,0.18)" : "rgba(255,255,255,0.05)", outline: saved ? `1px solid rgba(212,168,71,0.4)` : "1px solid rgba(255,255,255,0.07)", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          {saved ? <BookmarkCheck size={13} style={{ color: GOLD }} /> : <Bookmark size={13} style={{ color: "#9BA3B7" }} />}
          <span style={{ fontSize: 11, fontWeight: 600, color: saved ? GOLD : "#9BA3B7" }}>Save</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.88 }}
          style={{ flex: 1, height: 38, borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.05)", outline: "1px solid rgba(255,255,255,0.07)", outlineOffset: -1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Share2 size={13} style={{ color: "#9BA3B7" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#9BA3B7" }}>Share</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.88 }} onClick={onViewItinerary}
          style={{ flex: 1.4, height: 38, borderRadius: 10, border: "none", cursor: "pointer", background: card.creator.isHost ? GOLD_GRAD : LOGO_GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: card.creator.isHost ? "#1A1200" : "#fff" }}>
          {card.creator.isHost ? "Book" : "View"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SocialTab({ onVarixOpen }: Props) {
  const [section, setSection]           = useState<SectionFilter>("trending");
  const [typeFilter, setTypeFilter]     = useState<TripType | "">("");
  const [search, setSearch]             = useState("");
  const [liked, setLiked]               = useState<Set<string>>(new Set());
  const [saved, setSaved]               = useState<Set<string>>(new Set());
  const [followed, setFollowed]         = useState<Set<string>>(new Set());
  const [selectedCard, setSelectedCard] = useState<SocialCard | null>(null);
  const [showUpload, setShowUpload]     = useState(false);

  const toggleLike   = (id: string) => setLiked(p   => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSave   = (id: string) => setSaved(p   => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFollow = (id: string) => setFollowed(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const searchLower = search.toLowerCase();

  const filteredCards = SOCIAL_CARDS.filter(c => {
    const matchType = !typeFilter || c.tripType === typeFilter;
    const matchSearch = !searchLower || c.destination.toLowerCase().includes(searchLower) || c.title.toLowerCase().includes(searchLower) || c.creator.name.toLowerCase().includes(searchLower) || c.tags.some(t => t.includes(searchLower));
    return matchType && matchSearch;
  });

  return (
    <div style={{ background: "#080B14", minHeight: "100%", paddingBottom: 120, position: "relative" }}>

      {/* Overlays */}
      <AnimatePresence>
        {selectedCard && (
          <ItineraryOverlay
            key="overlay"
            card={selectedCard}
            followed={followed.has(selectedCard.creator.handle)}
            onFollow={() => toggleFollow(selectedCard.creator.handle)}
            onClose={() => setSelectedCard(null)}
          />
        )}
        {showUpload && <UploadTripCardSheet key="upload" onClose={() => setShowUpload(false)} />}
      </AnimatePresence>

      {/* ── CINEMATIC HEADER ──────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=60"
          alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, filter: "blur(26px)", transform: "scale(1.08)", pointerEvents: "none" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(6,9,18,0.9) 0%, rgba(8,11,20,0.76) 55%, rgba(8,11,20,0.97) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(to bottom, transparent 0%, #080B14 100%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", padding: "60px 20px 0" }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.34em", color: "#8AA0FF", textTransform: "uppercase", margin: "0 0 9px" }}>THE TRAVELER NETWORK</p>
              <h1 style={{ fontSize: 42, fontWeight: 900, color: "#F5F7FF", letterSpacing: "-0.045em", margin: "0 0 10px", lineHeight: 0.95 }}>Social</h1>
              <p style={{ fontSize: 12, color: "rgba(245,247,255,0.48)", margin: 0, fontStyle: "italic", lineHeight: 1.6 }}>
                Explore real Trip Cards from hosts and travelers. Save the itinerary, follow the creator, or let Varix build your own version.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: LOGO_GRAD, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, boxShadow: "0 0 0 2px rgba(123,92,255,0.45), 0 4px 16px rgba(0,0,0,0.5)" }}>
                {currentUser.avatar}
              </div>
              {/* Upload button */}
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setShowUpload(true)}
                style={{ height: 32, paddingLeft: 12, paddingRight: 12, borderRadius: 999, background: GOLD_GRAD, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: "#1A1200", boxShadow: "0 2px 12px rgba(212,168,71,0.35)" }}>
                <Upload size={11} />
                Share Trip Card
              </motion.button>
            </div>
          </div>

          {/* Section pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {([
              { id: "trending",  label: "Trending"  },
              { id: "hosts",     label: "Top Hosts" },
              { id: "travelers", label: "Travelers" },
            ] as { id: SectionFilter; label: string }[]).map(f => {
              const active = section === f.id;
              return (
                <motion.button key={f.id} whileTap={{ scale: 0.93 }} onClick={() => setSection(f.id)}
                  style={{ flex: 1, height: 36, borderRadius: 999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 500, background: active ? "rgba(123,92,255,0.28)" : "rgba(255,255,255,0.07)", color: active ? "#C4DAFF" : "rgba(245,247,255,0.45)", outline: active ? "1px solid rgba(123,92,255,0.5)" : "1px solid rgba(255,255,255,0.08)", outlineOffset: -1, transition: "all 0.18s" }}>
                  {f.label}
                </motion.button>
              );
            })}
          </div>

          {/* Search bar */}
          <div style={{ height: 44, borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)", display: "flex", alignItems: "center", padding: "0 14px", gap: 10, marginBottom: 14 }}>
            <Search size={14} style={{ color: "rgba(245,247,255,0.38)", flexShrink: 0 }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations, hosts, travelers, tags..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "#F5F7FF" }}
            />
          </div>

          {/* Trip type filter pills — only on trending */}
          {section === "trending" && (
            <div style={{ overflowX: "auto", display: "flex", gap: 6, paddingBottom: 4, marginBottom: 12, scrollbarWidth: "none" }}>
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => setTypeFilter("")}
                style={{ flexShrink: 0, height: 28, paddingLeft: 12, paddingRight: 12, borderRadius: 999, border: "none", cursor: "pointer", fontSize: 10, fontWeight: typeFilter === "" ? 700 : 500, background: typeFilter === "" ? "rgba(107,159,238,0.25)" : "rgba(255,255,255,0.06)", color: typeFilter === "" ? "#9DC2F6" : "rgba(245,247,255,0.38)", outline: typeFilter === "" ? "1px solid rgba(107,159,238,0.4)" : "1px solid rgba(255,255,255,0.07)", outlineOffset: -1 }}>
                All
              </motion.button>
              {TRIP_TYPE_PILLS.map(t => {
                const active = typeFilter === t;
                return (
                  <motion.button key={t} whileTap={{ scale: 0.93 }} onClick={() => setTypeFilter(active ? "" : t)}
                    style={{ flexShrink: 0, height: 28, paddingLeft: 12, paddingRight: 12, borderRadius: 999, border: "none", cursor: "pointer", fontSize: 10, fontWeight: active ? 700 : 500, background: active ? "rgba(123,92,255,0.28)" : "rgba(255,255,255,0.06)", color: active ? "#C4DAFF" : "rgba(245,247,255,0.38)", outline: active ? "1px solid rgba(123,92,255,0.5)" : "1px solid rgba(255,255,255,0.07)", outlineOffset: -1 }}>
                    {t}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── FEED ──────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
        >

          {/* TRENDING — Trip Cards grid */}
          {section === "trending" && (
            <div style={{
              padding: "4px 20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
              gap: 24,
            }}>
              {filteredCards.length === 0 ? (
                <div style={{ gridColumn: "1/-1", padding: "60px 0", textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "rgba(245,247,255,0.3)", margin: 0 }}>No Trip Cards match your filters.</p>
                </div>
              ) : filteredCards.map((card, i) => (
                <SocialTripCard
                  key={card.id}
                  card={card}
                  index={i}
                  liked={liked.has(card.id)}
                  saved={saved.has(card.id)}
                  followed={followed.has(card.creator.handle)}
                  onLike={() => toggleLike(card.id)}
                  onSave={() => toggleSave(card.id)}
                  onFollow={() => toggleFollow(card.creator.handle)}
                  onViewItinerary={() => setSelectedCard(card)}
                />
              ))}
            </div>
          )}

          {/* TOP HOSTS */}
          {section === "hosts" && (
            <div style={{ padding: "4px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              {TOP_HOSTS.filter(h => !searchLower || h.name.toLowerCase().includes(searchLower) || h.topDest.toLowerCase().includes(searchLower)).map((host, i) => (
                <motion.div
                  key={host.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.45, ease: EASE }}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}
                >
                  {/* Host info */}
                  <div style={{ padding: 18 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 58, height: 58, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", boxShadow: `0 0 0 2px ${GOLD}55` }}>
                        {host.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                          <p style={{ fontSize: 16, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{host.name}</p>
                          <PikVerifiedBadge label="Verified PIK host" />
                        </div>
                        <p style={{ fontSize: 11, color: "#8AA0FF", margin: 0 }}>{host.handle}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                          <Star size={10} style={{ color: GOLD, fill: GOLD }} />
                          <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>{host.rating}</span>
                          <span style={{ fontSize: 10, color: "rgba(245,247,255,0.35)" }}>· {host.reviews} reviews</span>
                        </div>
                      </div>
                      <motion.button whileTap={{ scale: 0.92 }}
                        onClick={() => toggleFollow(host.id)}
                        style={{ height: 34, paddingLeft: 16, paddingRight: 16, borderRadius: 999, background: followed.has(host.id) ? "rgba(123,92,255,0.2)" : LOGO_GRAD, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: followed.has(host.id) ? "#8AA0FF" : "#fff", outline: followed.has(host.id) ? "1px solid rgba(123,92,255,0.4)" : "none", outlineOffset: -1, flexShrink: 0 }}>
                        {followed.has(host.id) ? "Following" : "Follow"}
                      </motion.button>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 24 }}>
                      {[
                        { val: host.tripsHosted,     label: "Trips Hosted" },
                        { val: host.travelersHosted, label: "Travelers"    },
                        { val: host.topDest,          label: "Top Dest."   },
                      ].map(({ val, label }) => (
                        <div key={label}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F7FF", margin: 0, letterSpacing: "-0.02em" }}>{val}</p>
                          <p style={{ fontSize: 9, color: "rgba(245,247,255,0.35)", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Trip Card preview */}
                  <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
                    <img src={host.featuredCard.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,11,20,0.85) 0%, rgba(8,11,20,0.3) 60%, rgba(8,11,20,0.55) 100%)" }} />
                    <div style={{ position: "absolute", inset: "0 0 0 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#8AA0FF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Featured Trip Card</span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F7FF", margin: "3px 0 2px" }}>{host.featuredCard.title}</p>
                      <span style={{ fontSize: 10, color: "rgba(245,247,255,0.45)" }}>{host.featuredCard.destination} · {host.featuredCard.duration}</span>
                    </div>
                    <div style={{ position: "absolute", bottom: 12, right: 14, display: "flex", gap: 6 }}>
                      <motion.button whileTap={{ scale: 0.94 }}
                        style={{ height: 30, paddingLeft: 12, paddingRight: 12, borderRadius: 999, background: GOLD_GRAD, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#1A1200" }}>
                        Book Trip
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.94 }}
                        style={{ height: 30, paddingLeft: 12, paddingRight: 12, borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 10, fontWeight: 600, color: "#F5F7FF" }}>
                        Request to Join
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* FEATURED TRAVELERS */}
          {section === "travelers" && (
            <div style={{ padding: "4px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              {FEATURED_TRAVELERS.filter(t => !searchLower || t.name.toLowerCase().includes(searchLower)).map((traveler, i) => (
                <motion.div
                  key={traveler.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.45, ease: EASE }}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}
                >
                  {/* Traveler info */}
                  <div style={{ padding: "16px 18px 14px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: LOGO_GRAD, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                        {traveler.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F7FF", margin: 0 }}>{traveler.name}</p>
                        <p style={{ fontSize: 11, color: "#8AA0FF", margin: "2px 0 0" }}>{traveler.handle}</p>
                        <p style={{ fontSize: 10, color: "rgba(245,247,255,0.38)", margin: "4px 0 0" }}>
                          {traveler.countries} countries · {traveler.trips} trips · {traveler.followers} followers
                        </p>
                      </div>
                      <motion.button whileTap={{ scale: 0.92 }}
                        onClick={() => toggleFollow(traveler.id)}
                        style={{ height: 30, paddingLeft: 12, paddingRight: 12, borderRadius: 999, background: followed.has(traveler.id) ? "rgba(123,92,255,0.2)" : LOGO_GRAD, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: followed.has(traveler.id) ? "#8AA0FF" : "#fff", outline: followed.has(traveler.id) ? "1px solid rgba(123,92,255,0.4)" : "none", outlineOffset: -1, flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
                        {followed.has(traveler.id) ? <Check size={11} /> : <UserPlus size={11} />}
                        {followed.has(traveler.id) ? "Following" : "Follow"}
                      </motion.button>
                    </div>

                    {/* Their Trip Cards — horizontal scroll */}
                    <div style={{ marginLeft: -18, marginRight: -18, paddingLeft: 18, paddingRight: 18, overflowX: "auto", display: "flex", gap: 10, scrollbarWidth: "none" }}>
                      {traveler.cards.map(card => (
                        <div key={card.id} style={{ flexShrink: 0, width: 160, borderRadius: 14, overflow: "hidden", position: "relative", height: 100, cursor: "pointer" }}>
                          <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,11,20,0.85) 0%, rgba(8,11,20,0.1) 60%)" }} />
                          <div style={{ position: "absolute", top: 7, left: 8, background: "rgba(138,160,255,0.25)", border: "1px solid rgba(138,160,255,0.35)", borderRadius: 999, padding: "2px 7px" }}>
                            <span style={{ fontSize: 8, fontWeight: 700, color: "#8AA0FF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.tripType}</span>
                          </div>
                          <div style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#F5F7FF", margin: 0, lineHeight: 1.2 }}>{card.title}</p>
                            <p style={{ fontSize: 9, color: "rgba(245,247,255,0.45)", margin: "3px 0 0" }}>{card.destination}</p>
                          </div>
                        </div>
                      ))}
                      {/* CTA card */}
                      <div style={{ flexShrink: 0, width: 140, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: 100, cursor: "pointer" }}>
                        <Sparkles size={18} style={{ color: GOLD }} />
                        <p style={{ fontSize: 10, fontWeight: 600, color: GOLD, margin: 0, textAlign: "center", lineHeight: 1.4 }}>Ask Varix to Recreate This</p>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display: "flex", gap: 8, padding: "0 18px 16px" }}>
                    <motion.button whileTap={{ scale: 0.96 }}
                      style={{ flex: 1, height: 38, borderRadius: 10, background: LOGO_GRAD, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                      Build Similar Trip
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.96 }}
                      style={{ flex: 1, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "rgba(245,247,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Share2 size={12} />Share
                    </motion.button>
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
