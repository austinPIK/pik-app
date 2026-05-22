import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { Trip } from "@/data/mock";
import { cn } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  compact?: boolean;
}

const statusConfig = {
  upcoming: { label: "Upcoming", color: "#4DA3FF", bg: "rgba(77,163,255,0.15)" },
  active: { label: "Live Now", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  completed: { label: "Completed", color: "#9BA3B7", bg: "rgba(155,163,183,0.12)" },
  planning: { label: "Planning", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
};

const memberColors = ["#4DA3FF", "#8B5CFF", "#D946EF", "#10B981", "#F59E0B"];

export function TripCard({ trip, onClick, compact = false }: TripCardProps) {
  const status = statusConfig[trip.status];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn("relative overflow-hidden rounded-2xl cursor-pointer", compact ? "h-32" : "h-44")}
      style={{
        background: `linear-gradient(135deg, ${trip.gradientFrom}, ${trip.gradientVia ?? trip.gradientTo}, ${trip.gradientTo})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute top-3 right-3">
        <span
          className="text-[10px] font-semibold px-2 py-1 rounded-full border border-white/20"
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {trip.daysUntil > 0 && (
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-black/30 text-white/80 border border-white/10">
            {trip.daysUntil}d away
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg leading-tight">{trip.destination}</h3>
        <p className="text-white/60 text-xs mb-2">{trip.country}</p>

        {!compact && (
          <div className="flex items-center gap-3 text-white/70 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {trip.dates.start} – {trip.dates.end}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <div className="flex -space-x-1.5">
            {trip.group.slice(0, 4).map((m, idx) => (
              <div
                key={m.id}
                className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: memberColors[idx % memberColors.length] }}
              >
                {m.avatar[0]}
              </div>
            ))}
            {trip.group.length > 4 && (
              <div className="w-5 h-5 rounded-full border border-white/30 bg-black/40 flex items-center justify-center text-[7px] text-white/70">
                +{trip.group.length - 4}
              </div>
            )}
          </div>
          <span className="text-white font-semibold text-sm">
            ${trip.price.toLocaleString()}<span className="text-white/50 text-xs">/pp</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
