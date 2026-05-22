import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Briefcase, Users, DollarSign, UserPlus, Calendar,
  FileText, BarChart, Share2, Settings, Eye, Send, ArrowRight,
} from "lucide-react";

type TabId = "explore" | "adventures" | "social" | "host" | "profile";

interface Props {
  onTabChange?: (t: TabId) => void;
  onVarixOpen?: () => void;
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG     = "#080B14";
const PURPLE = "#8C87F4";
const STEEL  = "#9DC2F6";   // logo mid-blue
const ICE    = "#D4E8FB";   // logo top highlight
const GOLD   = "#E8B84B";
const TEXT   = "#F0F4FF";
const MUTED  = "#8B95B5";
const DIMMER = "#3A4870";

// Logo-accurate gradient (matches the metallic "PIK" letters exactly)
const LOGO_GRAD = `linear-gradient(135deg, ${ICE} 0%, ${STEEL} 40%, ${PURPLE} 85%, #B99CF9 100%)`;

// ── Data ──────────────────────────────────────────────────────────────────────
const HOSTED_TRIPS = [
  {
    id: "kyoto",
    destination: "Kyoto, Japan",
    dates: "Jul 10–20, 2026",
    status: "filling" as const,
    spotsTotal: 8,
    spotsFilled: 5,
    inviteCode: "KYOTO-2026-RIV",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=70",
  },
  {
    id: "bali",
    destination: "Bali, Indonesia",
    dates: "May 24 – Jun 3, 2026",
    status: "confirmed" as const,
    spotsTotal: 6,
    spotsFilled: 6,
    inviteCode: "BALI-2026-RIV",
    img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=70",
  },
  {
    id: "patagonia",
    destination: "Patagonia, Argentina",
    dates: "Sep 1–12, 2026",
    status: "draft" as const,
    spotsTotal: 10,
    spotsFilled: 0,
    inviteCode: "",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=70",
  },
];

type TripStatus = "filling" | "confirmed" | "draft";
const STATUS: Record<TripStatus, { label: string; color: string; bg: string }> = {
  filling:   { label: "● Filling",   color: "#F59E0B", bg: "rgba(245,158,11,0.15)"  },
  confirmed: { label: "✓ Confirmed", color: "#10B981", bg: "rgba(16,185,129,0.15)"  },
  draft:     { label: "Draft",       color: MUTED,     bg: "rgba(155,163,183,0.1)"  },
};

// ── Stat value renderer ───────────────────────────────────────────────────────
function StatValue({ value, label }: { value: string; label: string }) {
  if (label === "Travelers") {
    return (
      <p style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: 0 }}>
        {value}
      </p>
    );
  }
  if (label === "Earned") {
    return (
      <p style={{
        fontSize: 18, fontWeight: 800, margin: 0,
        background: `linear-gradient(135deg, ${GOLD}, #D4941A)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        {value}
      </p>
    );
  }
  // Active Trips — logo gradient
  return (
    <p style={{
      fontSize: 18, fontWeight: 800, margin: 0,
      background: LOGO_GRAD,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>
      {value}
    </p>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function HostTab({ onTabChange, onVarixOpen }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function copyCode(code: string) {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", paddingBottom: 120, overflowX: "hidden" }}>

      {/* ── 1. CINEMATIC HERO HEADER ────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "52px 24px 36px", overflow: "hidden" }}>
        {/* Ambient radial glow top-right */}
        <div style={{
          position: "absolute", top: -80, right: -60,
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,92,255,0.18) 0%, rgba(138,160,255,0.06) 50%, transparent 75%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        {/* Second glow blob bottom-left */}
        <div style={{
          position: "absolute", bottom: -40, left: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(138,160,255,0.1) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none",
        }} />

        {/* Label row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "3px",
            background: LOGO_GRAD,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", textTransform: "uppercase",
          }}>HOST</span>
          <span style={{ fontSize: 9, color: DIMMER }}>·</span>
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "1.5px", color: DIMMER, textTransform: "uppercase" }}>PIK DESTINATIONS</span>
        </div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ margin: 0, marginBottom: 12, lineHeight: 1.08 }}
        >
          <span style={{ display: "block", fontSize: 34, fontWeight: 800, color: TEXT, letterSpacing: "-0.03em" }}>
            Bring your people
          </span>
          <span style={{
            display: "block", fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em",
            background: LOGO_GRAD,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 12px rgba(123,92,255,0.5))",
          }}>
            somewhere unforgettable.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.65, maxWidth: 300 }}
        >
          Design experiences. Share them with the people who matter. Earn while you travel.
        </motion.p>
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* ── 2. DESIGN A NEW TRIP — HERO MOMENT ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          animate-boxShadow={undefined}
          style={{ borderRadius: 22, marginBottom: 20 }}
        >
          <motion.div
            animate={{ boxShadow: [
              "0 8px 40px rgba(123,92,255,0.5), 0 0 80px rgba(138,160,255,0.25)",
              "0 12px 60px rgba(123,92,255,0.75), 0 0 100px rgba(138,160,255,0.4)",
              "0 8px 40px rgba(123,92,255,0.5), 0 0 80px rgba(138,160,255,0.25)",
            ]}}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ borderRadius: 22 }}
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                borderRadius: 22,
                padding: "28px 24px",
                background: LOGO_GRAD,
                border: "1px solid rgba(196,218,255,0.2)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {/* Shimmer diagonal overlay */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                style={{
                  position: "absolute", top: 0, bottom: 0, width: "40%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                  pointerEvents: "none",
                }}
              />
              {/* Subtle noise texture overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative", zIndex: 1 }}>
                {/* Icon container */}
                <div style={{
                  width: 56, height: 56, borderRadius: 18,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}>
                  <Plus size={26} color="#fff" strokeWidth={2.5} />
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    Design a New Trip
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", margin: "4px 0 0", lineHeight: 1.4 }}>
                    Pick a destination, invite your people,<br/>and let PIK handle the rest.
                  </p>
                </div>

                <ArrowRight size={20} color="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }} />
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── 3. HOST STATS ───────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Active Trips", value: "2",     icon: Briefcase,  color: STEEL,     glow: "rgba(138,160,255,0.2)"  },
            { label: "Travelers",    value: "47",     icon: Users,      color: "#10B981", glow: "rgba(16,185,129,0.2)"   },
            { label: "Earned",       value: "$1,100", icon: DollarSign, color: GOLD,      glow: "rgba(232,184,75,0.2)"   },
          ].map(({ label, value, icon: Icon, color, glow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              style={{
                borderRadius: 18,
                padding: "16px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                textAlign: "center",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: glow,
                border: `1px solid ${color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <StatValue value={value} label={label} />
                <p style={{ fontSize: 10, color: MUTED, margin: "2px 0 0" }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── 4. ACTIVE TRIPS ─────────────────────────────────────────────────── */}
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2px", color: MUTED, textTransform: "uppercase", marginBottom: 14 }}>
          My Hosted Trips
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {HOSTED_TRIPS.map((trip, i) => {
            const sc = STATUS[trip.status];
            const pct = trip.spotsTotal > 0 ? Math.round((trip.spotsFilled / trip.spotsTotal) * 100) : 0;

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  position: "relative",
                }}
              >
                {/* Gradient left accent bar */}
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: trip.status === "draft"
                    ? "rgba(155,163,183,0.4)"
                    : trip.status === "confirmed"
                    ? "linear-gradient(180deg, #10B981, #059669)"
                    : LOGO_GRAD,
                }} />

                {/* Destination image strip */}
                <div style={{ height: 80, position: "relative", marginLeft: 3 }}>
                  <img src={trip.img} alt={trip.destination} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,11,20,0.2) 0%, rgba(8,11,20,0.7) 100%)" }} />
                  {/* Destination name over image */}
                  <div style={{ position: "absolute", bottom: 10, left: 14, right: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{trip.destination}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: "2px 0 0" }}>{trip.dates}</p>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                      background: sc.bg, color: sc.color,
                    }}>{sc.label}</span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "14px 16px" }}>
                  {/* Filling: progress bar */}
                  {trip.status === "filling" && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: MUTED }}>{trip.spotsFilled}/{trip.spotsTotal} spots filled</span>
                        <span style={{ fontSize: 11, color: MUTED }}>{pct}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: LOGO_GRAD, borderRadius: 999 }} />
                      </div>
                    </div>
                  )}

                  {/* Confirmed: full badge */}
                  {trip.status === "confirmed" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                        ✓ Fully Booked — {trip.spotsTotal} travelers
                      </span>
                    </div>
                  )}

                  {/* Invite code */}
                  {trip.inviteCode && (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 12px", borderRadius: 12, marginBottom: 12,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <span style={{ fontSize: 10, color: MUTED, fontFamily: "monospace" }}>{trip.inviteCode}</span>
                      <button
                        onClick={() => copyCode(trip.inviteCode)}
                        style={{
                          fontSize: 10, fontWeight: 700, background: "none", border: "none", cursor: "pointer",
                          color: copiedCode === trip.inviteCode ? "#10B981" : STEEL,
                        }}
                      >
                        {copiedCode === trip.inviteCode ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {trip.status === "filling" && (
                      <>
                        <button style={{
                          flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 12, fontWeight: 700,
                          background: "rgba(138,160,255,0.12)", border: "1px solid rgba(138,160,255,0.25)",
                          color: STEEL, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
                        }}>
                          <Share2 size={12} /> Share Invite
                        </button>
                        <button style={{
                          flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 12, fontWeight: 600,
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                          color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
                        }}>
                          <Settings size={12} /> Manage
                        </button>
                      </>
                    )}
                    {trip.status === "confirmed" && (
                      <>
                        <button style={{
                          flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 12, fontWeight: 700,
                          background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                          color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
                        }}>
                          <Eye size={12} /> View Group
                        </button>
                        <button style={{
                          flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 12, fontWeight: 600,
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                          color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
                        }}>
                          <Settings size={12} /> Manage
                        </button>
                      </>
                    )}
                    {trip.status === "draft" && (
                      <button style={{
                        flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 800,
                        background: LOGO_GRAD, border: "none",
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
                        boxShadow: "0 4px 20px rgba(123,92,255,0.4)",
                      }}>
                        <Send size={13} /> Publish Trip
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── 5. QUICK ACTIONS ────────────────────────────────────────────────── */}
        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2px", color: MUTED, textTransform: "uppercase", marginBottom: 14 }}>
          Quick Actions
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Invite Travelers",  icon: UserPlus,  color: STEEL,     glow: "rgba(138,160,255,0.15)" },
            { label: "View Bookings",     icon: Calendar,  color: PURPLE,    glow: "rgba(123,92,255,0.15)"  },
            { label: "Manage Documents",  icon: FileText,  color: GOLD,      glow: "rgba(232,184,75,0.15)"  },
            { label: "Host Analytics",    icon: BarChart,  color: "#10B981", glow: "rgba(16,185,129,0.15)"  },
          ].map(({ label, icon: Icon, color, glow }, i) => (
            <motion.button
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "16px",
                borderRadius: 18, textAlign: "left", cursor: "pointer",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: glow, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{label}</span>
            </motion.button>
          ))}
        </div>

        {/* ── 6. HOST CREDIT CARD ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            borderRadius: 22,
            padding: "28px 24px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(232,184,75,0.1) 0%, rgba(212,148,26,0.07) 100%)",
            border: "1px solid rgba(232,184,75,0.22)",
          }}
        >
          {/* Top shimmer line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(232,184,75,0.7), transparent)" }} />

          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "3px", color: GOLD, textTransform: "uppercase", margin: "0 0 10px" }}>
            Host Credit Earned
          </p>
          <p style={{
            fontSize: 48, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.03em",
            background: `linear-gradient(135deg, ${GOLD}, #D4941A)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>$1,100</p>
          <p style={{ fontSize: 13, color: MUTED, margin: "0 0 20px" }}>Apply to your next trip booking</p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "12px 32px", borderRadius: 14, fontSize: 13, fontWeight: 800,
              background: `linear-gradient(135deg, ${GOLD}, #D4941A)`,
              color: "#fff", border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(232,184,75,0.4)",
            }}
          >
            Redeem Credit
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
