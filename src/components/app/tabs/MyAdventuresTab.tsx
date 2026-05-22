import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Package, FileText, Map, ChevronDown, ChevronUp, Globe2, Plane, Footprints } from "lucide-react";
import { GlassPanel } from "../shared/GlassPanel";
import { TierBadge } from "../shared/TierBadge";
import { trips, currentUser, groupMembers } from "@/data/mock";

const upcoming = trips.filter((t) => t.status === "upcoming")[0] || trips[0];
const past = trips.filter((t) => t.status === "completed");

const ITINERARY = [
  {
    day: "Day 1",
    date: "May 25",
    events: ["Arrive DPS, transfer to Ubud (2.5h)", "Alaya Resort check-in", "Welcome dinner at Locavore"],
  },
  {
    day: "Day 2",
    date: "May 26",
    events: ["Sunrise yoga", "Tegallalang Rice Terrace Trek", "Cooking class — Balinese cuisine"],
  },
  {
    day: "Day 3",
    date: "May 27",
    events: ["Temple circuit — Tirta Empul, Goa Gajah", "Ubud market shopping", "Sunset at Tanah Lot"],
  },
];

const QUICK_ACTIONS = [
  { icon: MessageCircle, label: "Chat", color: "#4DA3FF" },
  { icon: Package, label: "Gear", color: "#F59E0B" },
  { icon: FileText, label: "Docs", color: "#8B5CFF" },
  { icon: Map, label: "Map", color: "#10B981" },
];

const memberColors = ["#4DA3FF", "#8B5CFF", "#D946EF", "#10B981", "#F59E0B"];

export function MyAdventuresTab() {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#03040A" }}>
      <div className="px-4 pt-6 pb-24 space-y-5">
        {/* Countdown hero */}
        <div
          className="relative rounded-3xl overflow-hidden h-52 border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${upcoming.gradientFrom}, ${upcoming.gradientVia ?? upcoming.gradientTo})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Live badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <TierBadge tier="explorer" size="sm" />
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981]">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
              />
              Live Status
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Next Adventure</p>
            <h2 className="text-white font-bold text-2xl leading-tight">
              {upcoming.destination} in {upcoming.daysUntil} days
            </h2>
            <div className="flex items-center gap-2 mt-2">
              {upcoming.group.slice(0, 5).map((m, idx) => (
                <div
                  key={m.id}
                  className="w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background: memberColors[idx % memberColors.length],
                    marginLeft: idx > 0 ? "-10px" : 0,
                  }}
                >
                  {m.avatar}
                </div>
              ))}
              <span className="text-white/60 text-xs ml-2">{upcoming.group.length} travelers</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10"
                style={{ background: `${action.color}10` }}
              >
                <Icon className="w-5 h-5" style={{ color: action.color }} />
                <span className="text-[#9BA3B7] text-xs font-medium">{action.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Itinerary */}
        <div>
          <h2 className="text-[#F5F7FF] font-semibold text-lg mb-3">Itinerary Preview</h2>
          <div className="space-y-2">
            {ITINERARY.map((day, idx) => (
              <GlassPanel key={day.day} className="overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)" }}
                    >
                      {idx + 1}
                    </div>
                    <div className="text-left">
                      <p className="text-[#F5F7FF] font-medium text-sm">{day.day}</p>
                      <p className="text-[#4A5575] text-xs">{day.date}</p>
                    </div>
                  </div>
                  {expandedDay === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#4A5575]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#4A5575]" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedDay === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {day.events.map((event) => (
                          <div key={event} className="flex items-start gap-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                              style={{ background: "#4DA3FF" }}
                            />
                            <p className="text-[#9BA3B7] text-sm">{event}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Adventure Legacy stats */}
        <GlassPanel className="p-5" glow="blue">
          <h2 className="text-[#F5F7FF] font-semibold mb-4">Adventure Legacy</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Plane, label: "Trips", value: currentUser.stats.trips, color: "#4DA3FF" },
              { icon: Globe2, label: "Countries", value: currentUser.stats.countries, color: "#8B5CFF" },
              { icon: Footprints, label: "Miles", value: `${(currentUser.stats.miles / 1000).toFixed(1)}k`, color: "#D946EF" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 mb-1" style={{ color: stat.color }} />
                  <span className="text-[#F5F7FF] font-bold text-xl">{stat.value}</span>
                  <span className="text-[#4A5575] text-xs">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Past trips */}
        <div>
          <h2 className="text-[#F5F7FF] font-semibold text-lg mb-3">Past Adventures</h2>
          <div className="space-y-3">
            {past.map((trip) => {
              const DEST_IMAGES: Record<string, string> = {
                Santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=75",
                Marrakech: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=75",
              };
              const img = DEST_IMAGES[trip.destination];
              return (
                <motion.div
                  key={trip.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative h-24 rounded-2xl overflow-hidden cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {img ? (
                    <img src={img} alt={trip.destination} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${trip.gradientFrom}, ${trip.gradientTo})` }} />
                  )}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.35) 100%)" }} />
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/45 mb-0.5">{trip.country}</p>
                      <p className="text-white font-semibold text-[15px] tracking-[-0.01em]">{trip.destination}</p>
                      <p className="text-white/45 text-[11px] mt-0.5">{trip.dates.start}</p>
                    </div>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}
                    >
                      Completed
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
