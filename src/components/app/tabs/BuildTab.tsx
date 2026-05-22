import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowLeft, Check, ChevronDown, ChevronUp,
  Calendar, Users, DollarSign, Globe2, Plane, Hotel,
  Footprints, FileText, CreditCard, UserCheck, Copy,
  Share2, QrCode, Phone, ArrowRight, Loader2, MapPin,
  Clock, CheckCircle2, Circle, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onTabChange?: (t: "explore" | "build" | "trips" | "groups" | "memories" | "profile") => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const LOADING_STEPS = [
  "Researching Bali destinations…",
  "Comparing luxury stays…",
  "Optimizing for 4 travelers…",
  "Building your itinerary…",
];

const QUICK_CHIPS = [
  "7-day Bali retreat",
  "Scotland golf escape",
  "Patagonia trek",
  "Japan in cherry blossom",
  "Maldives overwater",
  "Safari Serengeti",
];

const CONTEXT_PILLS = [
  { icon: "📅", label: "Dates", value: "" },
  { icon: "👥", label: "Group size", value: "4 people" },
  { icon: "💰", label: "Budget", value: "$2,500/person" },
  { icon: "🌍", label: "Style", value: "Luxury" },
];

const RECENT_BUILDS = [
  { destination: "Kyoto", duration: "10-day", date: "July 2026", travelers: 3 },
  { destination: "Bali", duration: "7-day", date: "May 2026", travelers: 5 },
];

const ITINERARY_DAYS = [
  {
    day: 1,
    title: "Arrive Bali",
    events: [
      "Arrive DPS, private transfer to Ubud (2.5h)",
      "Alaya Resort check-in & pool welcome",
      "Welcome dinner at Locavore",
    ],
  },
  {
    day: 2,
    title: "Ubud Immersion",
    events: [
      "Sunrise yoga at the resort",
      "Tegallalang Rice Terrace Trek",
      "Balinese cooking class with local family",
    ],
  },
  {
    day: 3,
    title: "Temple Circuit",
    events: [
      "Tirta Empul holy spring temple",
      "Goa Gajah elephant cave",
      "Tanah Lot sunset ceremony",
    ],
  },
];

const BOOKING_ITEMS = [
  { icon: CheckCircle2, label: "Trip Build", status: "complete", color: "#10B981" },
  { icon: Plane, label: "Flights", status: "action", color: "#4DA3FF", note: "Select flights" },
  { icon: Hotel, label: "Hotel", status: "complete", color: "#10B981", note: "Alaya Resort Ubud selected" },
  { icon: Footprints, label: "Activities", status: "action", color: "#4DA3FF", note: "3 suggested, tap to add" },
  { icon: MapPin, label: "Transport", status: "empty", color: "#4A5575", note: "Not started" },
  { icon: FileText, label: "Documents", status: "empty", color: "#4A5575", note: "Not uploaded" },
  { icon: CreditCard, label: "Payments", status: "empty", color: "#4A5575", note: "0 of 4 paid" },
  { icon: Users, label: "Travelers", status: "action", color: "#4DA3FF", note: "2 of 4 confirmed" },
];

const FLIGHT_OPTIONS = [
  {
    code: "GA 847",
    route: "LAX → DPS",
    date: "May 24",
    depart: "08:40",
    arrive: "17:25",
    price: 620,
    airline: "Garuda Indonesia",
  },
  {
    code: "QF 93",
    route: "LAX → DPS",
    date: "May 24",
    depart: "23:15",
    arrive: "+1 16:30",
    price: 580,
    airline: "Qantas",
  },
];

const MEMBERS = [
  { name: "Alex Rivera", initials: "AR", note: "You", status: "confirmed" },
  { name: "Jordan Kim", initials: "JK", note: "", status: "confirmed" },
  { name: "Taylor Moss", initials: "TM", note: "", status: "pending" },
  { name: "Casey Flynn", initials: "CF", note: "", status: "not_invited" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status, note }: { status: string; note?: string }) {
  if (status === "complete") {
    return (
      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full"
        style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
      >
        ✅ Complete
      </span>
    );
  }
  if (status === "action") {
    return (
      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full"
        style={{ background: "rgba(77,163,255,0.15)", color: "#4DA3FF" }}
      >
        🔵 {note}
      </span>
    );
  }
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: "rgba(74,85,117,0.2)", color: "#4A5575" }}
    >
      ⬜ {note ?? "Not started"}
    </span>
  );
}

function MemberStatusPill({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
        Confirmed
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
        Pending
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(74,85,117,0.2)", color: "#4A5575" }}>
      Not Invited
    </span>
  );
}

function DayCard({ day, expanded, onToggle }: { day: typeof ITINERARY_DAYS[number]; expanded: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "rgba(77,163,255,0.2)", color: "#4DA3FF" }}
          >
            {day.day}
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "#F5F7FF" }}>
              Day {day.day}
            </div>
            <div className="text-xs" style={{ color: "#9BA3B7" }}>
              {day.title}
            </div>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: "#4A5575" }} />
        </motion.div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-2">
              {day.events.map((e, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#4DA3FF" }} />
                  <span className="text-sm" style={{ color: "#9BA3B7" }}>{e}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BuildTab({ onTabChange }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(120, ta.scrollHeight)}px`;
  }, [prompt]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function startGeneration(customPrompt?: string) {
    if (customPrompt !== undefined) setPrompt(customPrompt);
    setLoading(true);
    setVisibleSteps([]);

    // Stagger loading steps
    LOADING_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
      }, i * 400);
    });

    // Finish after 2s
    timerRef.current = setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 2000);
  }

  function handleChipClick(chip: string) {
    setPrompt(`Plan a ${chip} for 4 people under $2,500 each`);
    setTimeout(() => startGeneration(`Plan a ${chip} for 4 people under $2,500 each`), 100);
  }

  function handleReset() {
    setGenerated(false);
    setLoading(false);
    setVisibleSteps([]);
    setPrompt("");
  }

  function handleCopy() {
    navigator.clipboard.writeText("BALI-2026-RIV").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleDay(day: number) {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="relative min-h-screen w-full pb-28 lg:pb-8"
      style={{ background: "#03040A" }}
    >
      <AnimatePresence mode="wait">
        {!generated ? (
          /* ================================================================
             STATE 1: IDLE — THE BUILDER
          ================================================================ */
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {/* ── Page Header ── */}
            <div className="px-4 pt-12 pb-6 lg:pt-16 lg:pb-10 lg:text-center">
              {/* Varix+ badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4, ease: EASE }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4"
                style={{
                  background: "rgba(77,163,255,0.12)",
                  border: "1px solid rgba(77,163,255,0.3)",
                }}
              >
                <Sparkles size={13} style={{ color: "#4DA3FF" }} />
                <span className="text-xs font-semibold tracking-wide" style={{ color: "#4DA3FF" }}>
                  Varix+
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
                className="text-3xl lg:text-4xl font-bold tracking-tight mb-3"
                style={{ color: "#F5F7FF" }}
              >
                Build your perfect trip.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
                className="text-base max-w-md lg:mx-auto"
                style={{ color: "#9BA3B7" }}
              >
                Describe where, when, and how you want to travel. Varix will design the rest.
              </motion.p>
            </div>

            {/* ── Main Input Card — centered hero on desktop ── */}
            <div className="px-4 lg:max-w-2xl lg:mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 0 60px rgba(77,163,255,0.08)",
                }}
              >
                {/* Textarea */}
                <div className="p-5 pb-3">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Plan a 7-day luxury adventure to Bali for 4 people under $2,500 each…"
                    disabled={loading}
                    className="w-full resize-none bg-transparent outline-none text-base lg:text-lg leading-relaxed"
                    style={{
                      minHeight: 120,
                      color: "#F5F7FF",
                      caretColor: "#4DA3FF",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && prompt.trim() && !loading) {
                        e.preventDefault();
                        startGeneration();
                      }
                    }}
                  />
                </div>

                {/* Context pills */}
                <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {CONTEXT_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium shrink-0 transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: pill.value ? "#F5F7FF" : "#4A5575",
                      }}
                    >
                      <span>{pill.icon}</span>
                      <span>{pill.value || pill.label}</span>
                    </button>
                  ))}
                </div>

                {/* Generate button */}
                <div className="px-4 pb-4 pt-1">
                  <motion.button
                    onClick={() => !loading && prompt.trim() && startGeneration()}
                    disabled={loading || !prompt.trim()}
                    className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-semibold text-base transition-opacity"
                    style={{
                      height: 56,
                      background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
                      color: "#fff",
                      opacity: loading || !prompt.trim() ? 0.7 : 1,
                      cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Varix is designing your trip…
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Build My Trip with Varix+
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Loading steps */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 flex flex-col gap-2">
                        {LOADING_STEPS.map((step, i) => (
                          <AnimatePresence key={i}>
                            {visibleSteps.includes(i) && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="flex items-center gap-2"
                              >
                                <Check size={14} style={{ color: "#10B981" }} />
                                <span className="text-sm" style={{ color: "#9BA3B7" }}>
                                  {step}
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* ── Quick Build Chips ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
              className="mt-6 px-4"
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A5575" }}>
                Popular builds
              </p>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => !loading && handleChipClick(chip)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap text-sm font-medium shrink-0 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#9BA3B7",
                    }}
                  >
                    <Zap size={12} style={{ color: "#8B5CFF" }} />
                    {chip}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Recent Builds ── */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.4, ease: EASE }}
                className="mt-8 px-4"
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A5575" }}>
                  Recent builds
                </p>
                <div className="flex flex-col gap-3">
                  {RECENT_BUILDS.map((build) => (
                    <div
                      key={build.destination}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(77,163,255,0.12)" }}
                        >
                          <MapPin size={15} style={{ color: "#4DA3FF" }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: "#F5F7FF" }}>
                            {build.destination} {build.duration}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "#4A5575" }}>
                            {build.date} · {build.travelers} travelers
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{
                          background: "rgba(77,163,255,0.12)",
                          color: "#4DA3FF",
                          border: "1px solid rgba(77,163,255,0.25)",
                        }}
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ================================================================
             STATE 2: GENERATED RESULT — THE MAGIC MOMENT
          ================================================================ */
          <motion.div
            key="generated"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* ── Result Header ── */}
            <div className="px-4 pt-10 pb-5 lg:pt-12">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 mb-4 text-sm font-medium"
                style={{ color: "#9BA3B7" }}
              >
                <ArrowLeft size={16} />
                New Trip
              </button>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
                style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
              >
                <Check size={12} />
                Your Trip is Ready
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#F5F7FF" }}>
                Varix designed your Bali trip
              </h2>
              <p className="text-sm" style={{ color: "#9BA3B7" }}>
                Review, customize, and invite your group. Everything is ready to book.
              </p>
            </div>

            {/* ── Desktop 2-col layout ── */}
            <div className="px-4 lg:grid lg:grid-cols-[1fr_360px] lg:gap-5 lg:items-start">

              {/* ═══════════════════ LEFT COLUMN ═══════════════════ */}
              <div className="flex flex-col gap-5">

                {/* ── Trip Summary Hero Card ── */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
                  className="relative w-full rounded-3xl overflow-hidden"
                  style={{ height: 220 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=80"
                    alt="Bali"
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(3,4,10,0.95) 0%, rgba(3,4,10,0.5) 50%, transparent 100%)",
                    }}
                  />
                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="text-xl font-bold mb-0.5" style={{ color: "#F5F7FF" }}>
                      Bali, Indonesia
                    </div>
                    <div className="text-sm mb-1" style={{ color: "rgba(245,247,255,0.75)" }}>
                      May 24 – Jun 3, 2026 · 10 nights
                    </div>
                    <div className="text-xs mb-3" style={{ color: "rgba(245,247,255,0.55)" }}>
                      4 travelers · $2,400/person · $9,600 total · Alaya Resort Ubud
                    </div>
                    <div className="flex gap-2">
                      {["Save Trip", "Share", "Start Booking"].map((label, i) => (
                        <button
                          key={label}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{
                            background:
                              i === 2
                                ? "linear-gradient(135deg, #4DA3FF, #8B5CFF)"
                                : "rgba(255,255,255,0.12)",
                            color: "#fff",
                            border: i !== 2 ? "1px solid rgba(255,255,255,0.15)" : "none",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── AI-Generated Itinerary ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(139,92,255,0.2)" }}
                    >
                      <Sparkles size={11} style={{ color: "#8B5CFF" }} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#4A5575" }}>
                      Varix-Designed Itinerary
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {ITINERARY_DAYS.map((day) => (
                      <DayCard
                        key={day.day}
                        day={day}
                        expanded={expandedDays.includes(day.day)}
                        onToggle={() => toggleDay(day.day)}
                      />
                    ))}
                  </div>
                  <button
                    className="mt-3 flex items-center gap-1 text-sm font-medium"
                    style={{ color: "#4DA3FF" }}
                  >
                    View Full Itinerary (10 days)
                    <ArrowRight size={14} />
                  </button>
                </motion.div>

                {/* ── Flight Options ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.45, ease: EASE }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Plane size={14} style={{ color: "#4A5575" }} />
                    <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#4A5575" }}>
                      Suggested Flights
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FLIGHT_OPTIONS.map((flight) => (
                      <div
                        key={flight.code}
                        className="p-4 rounded-2xl flex flex-col gap-2.5"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold" style={{ color: "#4DA3FF" }}>
                            {flight.code}
                          </span>
                          <span className="text-xs" style={{ color: "#4A5575" }}>
                            {flight.airline}
                          </span>
                        </div>
                        <div>
                          <div className="text-base font-bold" style={{ color: "#F5F7FF" }}>
                            {flight.route}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "#9BA3B7" }}>
                            {flight.date} · {flight.depart} → {flight.arrive}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-semibold" style={{ color: "#F5F7FF" }}>
                            ${flight.price}
                            <span className="text-xs font-normal ml-1" style={{ color: "#4A5575" }}>
                              /person
                            </span>
                          </span>
                          <button
                            className="text-xs font-semibold px-3 py-1.5 rounded-full"
                            style={{
                              background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
                              color: "#fff",
                            }}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Booking source note ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "#4A5575" }}>
                    Booking availability is powered by our integrated travel partners. Hotel and
                    flight options may vary by date and destination coverage.
                  </p>
                </motion.div>

              </div>
              {/* ═══════════════════ END LEFT COLUMN ═══════════════════ */}

              {/* ═══════════════════ RIGHT COLUMN ═══════════════════ */}
              <div className="flex flex-col gap-5 mt-5 lg:mt-0">

                {/* ── Booking Readiness Tracker ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 40px rgba(77,163,255,0.06)",
                  }}
                >
                  <div className="px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 size={16} style={{ color: "#10B981" }} />
                      <h3 className="text-sm font-bold" style={{ color: "#F5F7FF" }}>
                        Booking Readiness
                      </h3>
                    </div>
                    <div className="flex flex-col gap-0">
                      {BOOKING_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.label}
                            className={cn(
                              "flex items-center justify-between py-3",
                              i < BOOKING_ITEMS.length - 1 && "border-b"
                            )}
                            style={{
                              borderColor: "rgba(255,255,255,0.05)",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${item.color}18` }}
                              >
                                <Icon size={13} style={{ color: item.color }} />
                              </div>
                              <span className="text-sm font-medium" style={{ color: "#F5F7FF" }}>
                                {item.label}
                              </span>
                            </div>
                            <StatusPill status={item.status} note={item.note} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <button
                      className="w-full h-11 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
                        color: "#fff",
                      }}
                    >
                      Complete Booking
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>

                {/* ── Budget Split ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45, ease: EASE }}
                  className="rounded-3xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={15} style={{ color: "#4A5575" }} />
                    <h3 className="text-sm font-bold" style={{ color: "#F5F7FF" }}>
                      Cost Split · 4 Travelers
                    </h3>
                  </div>

                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: "#F5F7FF" }}>
                        $9,600
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#9BA3B7" }}>
                        $2,400 per person
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                      0 of 4 paid
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: "0%", background: "linear-gradient(90deg, #4DA3FF, #8B5CFF)" }}
                    />
                  </div>

                  {/* Members */}
                  <div className="flex flex-col gap-2.5 mb-4">
                    {MEMBERS.map((m) => (
                      <div key={m.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #4DA3FF22, #8B5CFF22)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#9BA3B7",
                            }}
                          >
                            {m.initials}
                          </div>
                          <div>
                            <span className="text-sm font-medium" style={{ color: "#F5F7FF" }}>
                              {m.name}
                            </span>
                            {m.note && (
                              <span className="text-xs ml-1.5" style={{ color: "#4A5575" }}>
                                {m.note}
                              </span>
                            )}
                          </div>
                        </div>
                        <MemberStatusPill status={m.status} />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 h-10 rounded-xl text-xs font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
                        color: "#fff",
                      }}
                    >
                      Invite Travelers
                    </button>
                    <button
                      className="flex-1 h-10 rounded-xl text-xs font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#9BA3B7",
                      }}
                    >
                      Share Cost Link
                    </button>
                  </div>
                </motion.div>

                {/* ── Group Invite ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.29, duration: 0.45, ease: EASE }}
                  className="rounded-3xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={15} style={{ color: "#8B5CFF" }} />
                    <h3 className="text-sm font-bold" style={{ color: "#F5F7FF" }}>
                      Invite your travel group
                    </h3>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "#9BA3B7" }}>
                    Share this trip with your travel companions.
                  </p>

                  {/* Invite code */}
                  <div
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl mb-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="font-mono text-sm font-semibold tracking-widest" style={{ color: "#4DA3FF" }}>
                      BALI-2026-RIV
                    </span>
                    <button onClick={handleCopy} className="flex items-center gap-1">
                      {copied ? (
                        <Check size={14} style={{ color: "#10B981" }} />
                      ) : (
                        <Copy size={14} style={{ color: "#4A5575" }} />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Share2, label: "Share Link" },
                      { icon: QrCode, label: "QR Code" },
                      { icon: Phone, label: "Contact" },
                    ].map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#9BA3B7",
                        }}
                      >
                        <Icon size={16} style={{ color: "#8B5CFF" }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>

              </div>
              {/* ═══════════════════ END RIGHT COLUMN ═══════════════════ */}

            </div>
            {/* end 2-col grid */}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollbar suppression */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
