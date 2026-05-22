import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X, Sparkles, MapPin, BedDouble, Mic, Send, ArrowRight, Users, Bell,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG            = "#06080F";
const PURPLE        = "#8C87F4";
const STEEL         = "#9DC2F6";   // logo mid-blue (PIK letter gradient)
const ICE           = "#D4E8FB";   // logo top highlight
const CYAN          = STEEL;       // alias — all "cyan" now uses logo steel-blue
// Logo-accurate gradient
const LOGO_GRAD     = `linear-gradient(135deg, ${ICE} 0%, ${STEEL} 40%, ${PURPLE} 85%, #B99CF9 100%)`;
const TEXT_PRIMARY  = "#F0F4FF";
const TEXT_SECONDARY = "#8B95B5";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "explore" | "trips" | "social" | "groups" | "profile";

interface Props {
  onClose: () => void;
  onTabChange: (t: TabId) => void;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  {
    dest: "Amalfi Coast Escape",
    sub: "6 days · Italy",
    img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=75",
  },
  {
    dest: "Bali Retreat",
    sub: "7 days · Indonesia",
    img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=75",
  },
  {
    dest: "Kenya Safari",
    sub: "5 days · Kenya",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=75",
  },
];

const QUICK_ACTIONS = [
  { icon: MapPin,    label: "Plan a trip",           color: CYAN    },
  { icon: BedDouble, label: "Find hotels",           color: PURPLE  },
  { icon: Sparkles,  label: "Surprise me",           color: "#D946EF" },
  { icon: Bell,      label: "Concierge",             color: "#E8B84B" },
  { icon: Users,     label: "Build a group getaway", color: "#10B981" },
];

// ─── Caustic blob data ────────────────────────────────────────────────────────
const CAUSTICS = [
  { w: 52, h: 30, top: "18%", left: "22%", color: "rgba(0,212,255,0.55)",   blur: 8,  dur: 3.2, delay: 0,   rot: [15, 35, 5, 25, 15]     },
  { w: 28, h: 44, top: "48%", left: "12%", color: "rgba(123,92,255,0.5)",   blur: 7,  dur: 2.6, delay: 0.7, rot: [-20, 0, -35, -10, -20]  },
  { w: 40, h: 22, top: "60%", left: "52%", color: "rgba(0,212,255,0.45)",   blur: 9,  dur: 3.9, delay: 1.3, rot: [30, 10, 45, 20, 30]     },
  { w: 36, h: 36, top: "30%", left: "55%", color: "rgba(123,92,255,0.4)",   blur: 10, dur: 2.3, delay: 0.4, rot: [-5, 15, -20, 8, -5]     },
  { w: 20, h: 28, top: "70%", left: "30%", color: "rgba(0,212,255,0.6)",    blur: 6,  dur: 4.4, delay: 1.9, rot: [40, 20, 55, 30, 40]     },
  { w: 45, h: 18, top: "12%", left: "45%", color: "rgba(180,120,255,0.4)",  blur: 8,  dur: 2.8, delay: 1.1, rot: [0, -15, 10, -5, 0]      },
];

// ─── Floating sparks data ─────────────────────────────────────────────────────
const SPARKS: Array<{
  top?: string; bottom?: string; left?: string; right?: string;
  color: string; delay: number; size: number; dx: number[];
}> = [
  { top: "8%",        left:  "25%",  color: PURPLE,                    delay: 0,   size: 3,   dx: [0, 3, -2, 1, 0]   },
  { top: "12%",       right: "20%",  color: CYAN,                      delay: 0.4, size: 2,   dx: [0, -2, 3, -1, 0]  },
  { top: "45%",       left:  "4%",   color: CYAN,                      delay: 0.8, size: 2,   dx: [0, 2, -1, 2, 0]   },
  { top: "50%",       right: "5%",   color: PURPLE,                    delay: 1.2, size: 3,   dx: [0, -3, 1, -2, 0]  },
  { bottom: "18%",    left:  "18%",  color: CYAN,                      delay: 1.0, size: 2,   dx: [0, 1, -2, 1, 0]   },
  { bottom: "10%",    right: "25%",  color: PURPLE,                    delay: 1.6, size: 3,   dx: [0, -1, 2, -1, 0]  },
  { top: "28%",       left:  "10%",  color: "rgba(255,255,255,0.8)",   delay: 0.3, size: 1.5, dx: [0, 2, -1, 0, 0]   },
  { top: "35%",       right: "12%",  color: "rgba(255,255,255,0.7)",   delay: 0.9, size: 1.5, dx: [0, -1, 2, -2, 0]  },
  { top: "65%",       left:  "8%",   color: PURPLE,                    delay: 1.4, size: 2,   dx: [0, 3, -1, 2, 0]   },
  { top: "70%",       right: "8%",   color: CYAN,                      delay: 0.6, size: 2,   dx: [0, -2, 3, -1, 0]  },
  { top: "20%",       left:  "48%",  color: CYAN,                      delay: 2.0, size: 1.5, dx: [0, 1, -1, 2, 0]   },
  { bottom: "25%",    left:  "45%",  color: PURPLE,                    delay: 1.7, size: 2,   dx: [0, -2, 1, -1, 0]  },
];

// ─── Varix Orb ────────────────────────────────────────────────────────────────
function VarixOrb() {
  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Layer 1: Outer atmosphere halo (outside breathing wrapper) ── */}
      <motion.div
        animate={{
          scale:   [0.95, 1.06, 0.98, 1.04, 0.95],
          opacity: [0.6,  0.85, 0.7,  0.9,  0.6 ],
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position:     "absolute",
          width:        280,
          height:       280,
          borderRadius: "50%",
          background:   "radial-gradient(circle at 50% 50%, rgba(196,218,255,0.15) 0%, rgba(138,160,255,0.18) 25%, rgba(123,92,255,0.14) 50%, transparent 75%)",
          filter:       "blur(20px)",
          zIndex:       0,
        }}
      />

      {/* ── Breathing scale wrapper (layers 2–8) ── */}
      <motion.div
        animate={{ scale: [0.95, 1.04, 0.97, 1.03, 0.95] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset:    0,
          display:  "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        {/* ── Layer 2: Main sphere body ── */}
        <div
          style={{
            position:     "absolute",
            width:        160,
            height:       160,
            borderRadius: "50%",
            background:   "radial-gradient(circle at 38% 32%, rgba(196,218,255,0.35) 0%, rgba(138,160,255,0.45) 25%, rgba(123,92,255,0.5) 50%, rgba(60,20,120,0.88) 70%, rgba(6,8,15,0.95) 100%)",
            boxShadow:    "0 0 40px rgba(123,92,255,0.55), 0 0 80px rgba(138,160,255,0.25), inset 0 0 30px rgba(138,160,255,0.15)",
          }}
        />

        {/* ── Layer 3: Caustic blobs (clipped inside sphere) ── */}
        <div
          style={{
            position:     "absolute",
            width:        160,
            height:       160,
            borderRadius: "50%",
            overflow:     "hidden",
          }}
        >
          {CAUSTICS.map((blob, i) => (
            <motion.div
              key={i}
              style={{
                position:     "absolute",
                width:        blob.w,
                height:       blob.h,
                top:          blob.top,
                left:         blob.left,
                borderRadius: "50%",
                background:   blob.color,
                filter:       `blur(${blob.blur}px)`,
              }}
              animate={{
                opacity: [0.3, 0.9, 0.5, 0.85, 0.3],
                scale:   [0.7, 1.3, 0.9, 1.2,  0.7],
                rotate:  blob.rot,
              }}
              transition={{
                duration: blob.dur,
                repeat:   Infinity,
                ease:     "easeInOut",
                delay:    blob.delay,
              }}
            />
          ))}
        </div>

        {/* ── Layer 4: Specular highlight ── */}
        <div
          style={{
            position:     "absolute",
            width:        50,
            height:       30,
            top:          "16%",
            left:         "18%",
            borderRadius: "50%",
            background:   "rgba(255,255,255,0.12)",
            filter:       "blur(4px)",
            transform:    "rotate(-25deg)",
          }}
        />

        {/* ── Layer 5: Ring 1 — outermost, slow clockwise, purple ── */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full"
          style={{
            width:     188,
            height:    188,
            border:    `1.5px solid rgba(123,92,255,0.75)`,
            boxShadow: `0 0 18px rgba(123,92,255,0.55), inset 0 0 18px rgba(123,92,255,0.15)`,
          }}
        >
          {/* N dot */}
          <div
            style={{
              position:     "absolute",
              top:          -3,
              left:         "50%",
              transform:    "translateX(-50%)",
              width:        6,
              height:       6,
              borderRadius: "50%",
              background:   PURPLE,
              boxShadow:    `0 0 10px ${PURPLE}, 0 0 20px ${PURPLE}`,
            }}
          />
          {/* S dot */}
          <div
            style={{
              position:     "absolute",
              bottom:       -3,
              left:         "50%",
              transform:    "translateX(-50%)",
              width:        4,
              height:       4,
              borderRadius: "50%",
              background:   `rgba(123,92,255,0.6)`,
              boxShadow:    `0 0 8px ${PURPLE}`,
            }}
          />
          {/* E dot */}
          <div
            style={{
              position:     "absolute",
              right:        -3,
              top:          "50%",
              transform:    "translateY(-50%)",
              width:        4,
              height:       4,
              borderRadius: "50%",
              background:   `rgba(0,212,255,0.8)`,
              boxShadow:    `0 0 10px ${CYAN}`,
            }}
          />
          {/* W dot */}
          <div
            style={{
              position:     "absolute",
              left:         -3,
              top:          "50%",
              transform:    "translateY(-50%)",
              width:        4,
              height:       4,
              borderRadius: "50%",
              background:   `rgba(0,212,255,0.6)`,
              boxShadow:    `0 0 6px ${CYAN}`,
            }}
          />
        </motion.div>

        {/* ── Layer 5b: Ring 2 — counter-rotate, cyan ── */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full"
          style={{
            width:     148,
            height:    148,
            border:    `1.5px solid rgba(0,212,255,0.65)`,
            boxShadow: `0 0 16px rgba(0,212,255,0.45), inset 0 0 16px rgba(0,212,255,0.12)`,
          }}
        >
          {/* N dot */}
          <div
            style={{
              position:     "absolute",
              top:          -3,
              left:         "50%",
              transform:    "translateX(-50%)",
              width:        5,
              height:       5,
              borderRadius: "50%",
              background:   CYAN,
              boxShadow:    `0 0 10px ${CYAN}, 0 0 18px ${CYAN}`,
            }}
          />
          {/* E dot */}
          <div
            style={{
              position:     "absolute",
              right:        -3,
              top:          "50%",
              transform:    "translateY(-50%)",
              width:        4,
              height:       4,
              borderRadius: "50%",
              background:   `rgba(123,92,255,0.9)`,
              boxShadow:    `0 0 8px ${PURPLE}`,
            }}
          />
        </motion.div>

        {/* ── Layer 6: Spark particles (12 particles) ── */}
        {SPARKS.map((spark, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width:        spark.size,
              height:       spark.size,
              borderRadius: "50%",
              background:   spark.color,
              boxShadow:    `0 0 ${spark.size * 2}px ${spark.color}`,
              top:          spark.top,
              bottom:       spark.bottom,
              left:         spark.left,
              right:        spark.right,
            }}
            animate={{
              opacity: [0, 1, 0.3, 0.9, 0],
              scale:   [0.5, 1.6, 0.8, 1.3, 0.5],
              x:       spark.dx,
              y:       spark.dx.map(v => -v * 0.7),
            }}
            transition={{
              duration: 2.8,
              repeat:   Infinity,
              ease:     "easeInOut",
              delay:    spark.delay,
            }}
          />
        ))}

        {/* ── Layer 7: Center caustic shimmer (over sphere) ── */}
        <motion.div
          animate={{
            opacity: [0.3, 0.75, 0.45, 0.8,  0.3],
            scale:   [0.85, 1.15, 0.95, 1.1, 0.85],
            rotate:  [0, 8, -5, 3, 0],
          }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position:     "absolute",
            width:        90,
            height:       90,
            borderRadius: "50%",
            background:   "radial-gradient(circle at 40% 38%, rgba(196,218,255,0.55) 0%, rgba(138,160,255,0.45) 30%, rgba(123,92,255,0.3) 60%, transparent 80%)",
            filter:       "blur(8px)",
          }}
        />

        {/* ── Layer 8: Center Sparkles icon ── */}
        <motion.div
          animate={{
            rotate: [0, 12, -8, 6,    0],
            scale:  [1,  1.08, 0.96, 1.05, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", zIndex: 10 }}
        >
          <Sparkles
            size={38}
            style={{
              color:  "#fff",
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 14px rgba(0,212,255,0.7)) drop-shadow(0 0 28px rgba(123,92,255,0.6))",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function VarixSheet({ onClose, onTabChange }: Props) {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasText  = prompt.trim().length > 0;

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── Backdrop ── */}
      <motion.div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />

      {/* ── Sheet ── */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #080B14 0%, ${BG} 100%)`,
          border: "1px solid rgba(255,255,255,0.07)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          maxHeight: "94dvh",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.9 }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <X size={15} style={{ color: TEXT_SECONDARY }} />
        </button>

        {/* ── Scrollable body ── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col items-center pt-2 pb-6 px-5">

            {/* PIK logo — same CSS background-image technique as ExploreTab:
                pik-logo-dark.png composited with gradient masks in one layer,
                no <img> element boundary, blends perfectly into the sheet BG */}
            <div
              style={{
                width: 210,
                height: 84,   /* 210 × (793/1983) ≈ 84px */
                marginBottom: 16,
                backgroundImage: [
                  "linear-gradient(to bottom, #080B14 0%, rgba(8,11,20,0.72) 22%, transparent 50%)",
                  "linear-gradient(to top,    #080B14 0%, rgba(8,11,20,0.88) 28%, transparent 62%)",
                  "linear-gradient(to right,  #080B14 0%, rgba(8,11,20,0.78) 14%, transparent 38%)",
                  "linear-gradient(to left,   #080B14 0%, rgba(8,11,20,0.78) 14%, transparent 38%)",
                  "url(/brand/pik-logo-dark.png)",
                ].join(", "),
                backgroundSize:     "100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
                backgroundPosition: "center",
                backgroundRepeat:   "no-repeat",
              }}
            />

            {/* Title */}
            <h2
              className="text-xl font-bold text-center mb-1"
              style={{ color: TEXT_PRIMARY }}
            >
              <span>Varix — </span>
              <span
                style={{
                  background: LOGO_GRAD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI Travel Concierge
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className="text-sm text-center"
              style={{ color: TEXT_SECONDARY, lineHeight: 1.6 }}
            >
              Your intelligent travel companion.
              <br />
              Plan, discover, and experience more.
            </p>

            {/* ── THE ORB ── */}
            <div className="my-8">
              <VarixOrb />
            </div>

            {/* Greeting */}
            <p
              className="text-xl font-bold mb-1"
              style={{ color: TEXT_PRIMARY }}
            >
              Hi Alex! 👋
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: TEXT_SECONDARY }}
            >
              Where can I take you today?
            </p>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-2.5 justify-center mb-8 w-full">
              {QUICK_ACTIONS.map(({ icon: Icon, label, color }) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-opacity hover:opacity-80"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: TEXT_PRIMARY,
                    fontSize: 12,
                  }}
                >
                  <Icon size={14} style={{ color, flexShrink: 0 }} />
                  {label}
                </motion.button>
              ))}
            </div>

            {/* Suggested For You */}
            <div className="w-full mb-2">
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-[10px] font-semibold uppercase"
                  style={{ letterSpacing: "0.18em", color: TEXT_SECONDARY }}
                >
                  SUGGESTED FOR YOU
                </p>
                <button
                  className="text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: CYAN }}
                >
                  View all ›
                </button>
              </div>

              {/* Horizontal scroll cards */}
              <div
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {SUGGESTIONS.map((s) => (
                  <motion.button
                    key={s.dest}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 rounded-2xl overflow-hidden text-left relative"
                    style={{ width: 148, height: 160 }}
                    onClick={() => onTabChange("trips")}
                  >
                    <img
                      src={s.img}
                      alt={s.dest}
                      className="w-full h-full object-cover"
                    />
                    {/* Bottom gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(6,8,15,0.94) 30%, transparent 70%)",
                      }}
                    />
                    {/* Text */}
                    <div className="absolute bottom-0 left-0 p-3">
                      <p
                        className="text-xs font-bold leading-tight"
                        style={{ color: TEXT_PRIMARY }}
                      >
                        {s.dest}
                      </p>
                      <p
                        className="text-[10px] mt-0.5"
                        style={{ color: "rgba(240,244,255,0.55)" }}
                      >
                        {s.sub}
                      </p>
                    </div>
                    {/* Arrow circle */}
                    <div
                      className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: LOGO_GRAD,
                        boxShadow: `0 0 8px rgba(0,212,255,0.4)`,
                      }}
                    >
                      <ArrowRight size={11} color="#fff" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom chat input ── */}
        <div
          className="flex-shrink-0 px-4 pb-8 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <input
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Varix anything…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: TEXT_PRIMARY, caretColor: CYAN }}
              onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            />

            {/* Mic */}
            <button className="flex-shrink-0 transition-opacity hover:opacity-70">
              <Mic size={17} style={{ color: TEXT_SECONDARY }} />
            </button>

            {/* Send */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: hasText
                  ? LOGO_GRAD
                  : "rgba(255,255,255,0.08)",
                boxShadow: hasText
                  ? `0 0 16px rgba(123,92,255,0.5), 0 0 32px rgba(0,212,255,0.25)`
                  : "none",
                transition: "background 0.25s, box-shadow 0.25s",
              }}
            >
              <Send
                size={14}
                style={{ color: hasText ? "#fff" : TEXT_SECONDARY }}
              />
            </motion.button>
          </div>

          {/* Disclaimer */}
          <p
            className="text-center mt-2.5"
            style={{ fontSize: 10, color: "#3A4260" }}
          >
            🛡 Varix may make mistakes. Please verify important details.
          </p>
        </div>
      </motion.div>
    </>
  );
}
