import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, MapPin, Map, ChevronRight, Plane, Users, Star, Megaphone, Lock } from "lucide-react";
import { LockedFeature } from "../shared/LockedFeature";

type SubTab = "map" | "notifications";

const NOTIFICATIONS = [
  { id:"1", cat:"trips",  icon: Plane,     color:"#4DA3FF", title:"Flight confirmed",             msg:"LATAM LA 524 · May 18 · Buenos Aires 07:15", time:"2m ago",  read:false },
  { id:"2", cat:"groups", icon: Users,     color:"#8B5CFF", title:"Maya R. sent a message",       msg:"Can't wait for Patagonia! 🏔️",                time:"14m ago", read:false },
  { id:"3", cat:"hosts",  icon: Star,      color:"#F59E0B", title:"New booking — Kyoto trip",     msg:"Jake T. joined your Kyoto Cultural trip.",   time:"1h ago",  read:false },
  { id:"4", cat:"pik",    icon: Megaphone, color:"#D946EF", title:"Elite Adventures now live",    msg:"Unlock Golf Intelligence + Concierge access.", time:"3h ago",  read:true  },
  { id:"5", cat:"trips",  icon: Plane,     color:"#4DA3FF", title:"Hotel check-in reminder",      msg:"Palacio Duhau check-in tomorrow at 3 PM.",   time:"5h ago",  read:true  },
  { id:"6", cat:"groups", icon: Users,     color:"#8B5CFF", title:"Ethan B. joined the group",   msg:"Patagonia 2026 now has 5 members.",            time:"1d ago",  read:true  },
  { id:"7", cat:"pik",    icon: Megaphone, color:"#D946EF", title:"New destinations added",       msg:"Explore 12 new adventure destinations.",       time:"2d ago",  read:true  },
];

const MAP_STOPS = [
  { n:1, name:"Hotel Check-in",            sub:"Palacio Duhau",            color:"#4DA3FF" },
  { n:2, name:"Perito Moreno Glacier",     sub:"Day hike · 6hr",           color:"#8B5CFF" },
  { n:3, name:"El Calafate Airport",       sub:"Fly to Punta Arenas",      color:"#4DA3FF" },
  { n:4, name:"Torres del Paine Entrance", sub:"Trek begins",               color:"#10B981" },
  { n:5, name:"Mirador Base Camp",         sub:"Overnight · Night 3",      color:"#D946EF" },
];

type NotifCat = "all" | "trips" | "groups" | "hosts" | "pik";

export function MapTab() {
  const [sub, setSub] = useState<SubTab>("notifications");
  const [notifCat, setNotifCat] = useState<NotifCat>("all");

  const filtered = notifCat === "all"
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter((n) => n.cat === notifCat);

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="min-h-full pb-24 lg:pb-8 px-5 lg:px-8 pt-6 lg:pt-8" style={{ background: "#03040A" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#F5F7FF]">Map & Notifications</h1>
            <p className="text-sm text-[#9BA3B7]">Track your trip and stay informed.</p>
          </div>
          {unread > 0 && (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#D946EF" }}>
              {unread}
            </div>
          )}
        </div>

        {/* Sub tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["notifications","map"] as SubTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setSub(t)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
              style={{ background: sub === t ? "rgba(77,163,255,0.15)" : "transparent", color: sub === t ? "#4DA3FF" : "#9BA3B7" }}
            >
              {t === "notifications" ? "🔔 Notifications" : "🗺 Trip Map"}
            </button>
          ))}
        </div>

        {sub === "notifications" && (
          <>
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
              {(["all","trips","groups","hosts","pik"] as NotifCat[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setNotifCat(c)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 capitalize transition-all"
                  style={{
                    background: notifCat === c ? "rgba(77,163,255,0.15)" : "rgba(255,255,255,0.04)",
                    border: notifCat === c ? "1px solid rgba(77,163,255,0.35)" : "1px solid rgba(255,255,255,0.08)",
                    color: notifCat === c ? "#4DA3FF" : "#9BA3B7",
                  }}
                >
                  {c === "pik" ? "PIK" : c}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="space-y-2">
              {filtered.map((n, i) => {
                const Icon = n.icon;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3.5 rounded-2xl transition-all"
                    style={{
                      background: n.read ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                      border: n.read ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${n.color}18` }}>
                      <Icon size={16} style={{ color: n.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#F5F7FF]">{n.title}</p>
                        <span className="text-[9px] text-[#4A5575] flex-shrink-0 mt-0.5">{n.time}</span>
                      </div>
                      <p className="text-xs text-[#9BA3B7] mt-0.5 leading-relaxed">{n.msg}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: n.color }} />}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {sub === "map" && (
          <LockedFeature tier="explorer">
            <div>
              {/* Mock map visual */}
              <div
                className="relative rounded-3xl overflow-hidden mb-4"
                style={{ height: 280, background: "linear-gradient(135deg,#0a1628,#0d1f3c)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                {/* Fake map grid */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "linear-gradient(rgba(77,163,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(77,163,255,0.5) 1px,transparent 1px)",
                  backgroundSize: "40px 40px",
                }} />
                {/* Route line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280">
                  <polyline points="60,220 120,180 200,140 280,100 340,70" stroke="#4DA3FF" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.6" />
                  {[[60,220],[120,180],[200,140],[280,100],[340,70]].map(([x,y],i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="10" fill="rgba(77,163,255,0.2)" stroke="#4DA3FF" strokeWidth="1.5" />
                      <text x={x} y={y+4} textAnchor="middle" fontSize="8" fill="#4DA3FF" fontWeight="bold">{i+1}</text>
                    </g>
                  ))}
                </svg>
                <div className="absolute top-3 left-3 text-[10px] font-semibold text-[#4DA3FF] bg-[#0B1020]/80 px-2 py-1 rounded-lg">Patagonia Route · 5 Stops</div>
              </div>

              {/* Stop cards */}
              <div className="space-y-2">
                {MAP_STOPS.map((stop, i) => (
                  <div
                    key={stop.n}
                    className="flex items-center gap-3 p-3.5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: stop.color }}>
                      {stop.n}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#F5F7FF]">{stop.name}</p>
                      <p className="text-xs text-[#9BA3B7]">{stop.sub}</p>
                    </div>
                    <ChevronRight size={14} style={{ color: "#4A5575" }} />
                  </div>
                ))}
              </div>
            </div>
          </LockedFeature>
        )}
      </div>
    </div>
  );
}
