import { motion } from "framer-motion";
import { Wifi, QrCode, Plane, Hotel, Ticket, Car, ChevronRight } from "lucide-react";

const DOCS = [
  {
    type: "boarding",
    icon: Plane,
    color: "#4DA3FF",
    title: "Boarding Pass",
    subtitle: "LATAM Airlines · LA 524",
    detail1: "Buenos Aires → Santiago",
    detail2: "May 18 · 07:15 AM · Seat 14A",
    meta: "Gate B7 · On Time",
    metaColor: "#10B981",
  },
  {
    type: "hotel",
    icon: Hotel,
    color: "#8B5CFF",
    title: "Hotel Voucher",
    subtitle: "Palacio Duhau — Park Hyatt",
    detail1: "Buenos Aires, Argentina",
    detail2: "May 18–19 · Deluxe King · 1 night",
    meta: "Check-in after 3:00 PM",
    metaColor: "#9BA3B7",
  },
  {
    type: "activity",
    icon: Ticket,
    color: "#D946EF",
    title: "Activity Ticket",
    subtitle: "Perito Moreno Glacier Trek",
    detail1: "El Calafate, Patagonia",
    detail2: "May 20 · 09:00 AM · 4 Participants",
    meta: "Meeting point: Visitor Centre",
    metaColor: "#9BA3B7",
  },
  {
    type: "transport",
    icon: Car,
    color: "#10B981",
    title: "Ground Transfer",
    subtitle: "Private SUV · Viator Fleet",
    detail1: "EZE Airport → Palacio Duhau",
    detail2: "May 18 · 14:30 · 5 passengers",
    meta: "Driver: Carlos M. +54 11 xxxx",
    metaColor: "#9BA3B7",
  },
];

export function WalletTab() {
  return (
    <div className="min-h-full pb-24 lg:pb-8 px-5 lg:px-8 pt-6 lg:pt-8" style={{ background: "#03040A" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Wallet</h1>
          <p className="text-sm text-[#9BA3B7]">All your trip documents, always accessible.</p>
        </div>

        {/* Trip selector */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl mb-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <div>
            <p className="text-xs text-[#9BA3B7]">Active Trip</p>
            <p className="text-sm font-semibold text-[#F5F7FF]">Patagonia 2026 · May 18–25</p>
          </div>
          <ChevronRight size={16} style={{ color: "#9BA3B7" }} />
        </div>

        {/* Offline badge */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-6"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.20)" }}
        >
          <Wifi size={14} style={{ color: "#10B981" }} />
          <p className="text-xs font-medium" style={{ color: "#10B981" }}>All documents available offline</p>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          {DOCS.map((doc, i) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.type}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09 }}
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "rgba(11,16,32,0.9)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                {/* Card top stripe */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${doc.color}, ${doc.color}88)` }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${doc.color}18` }}
                      >
                        <Icon size={18} style={{ color: doc.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-[#9BA3B7] uppercase tracking-wider">{doc.title}</p>
                        <p className="text-sm font-semibold text-[#F5F7FF]">{doc.subtitle}</p>
                      </div>
                    </div>
                    <QrCode size={32} style={{ color: "rgba(255,255,255,0.15)" }} />
                  </div>

                  {/* Dashed separator */}
                  <div
                    className="w-full h-px my-4"
                    style={{ background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.12) 0,rgba(255,255,255,0.12) 6px,transparent 6px,transparent 12px)" }}
                  />

                  <div className="space-y-1.5">
                    <p className="text-sm text-[#F5F7FF]">{doc.detail1}</p>
                    <p className="text-xs text-[#9BA3B7]">{doc.detail2}</p>
                    <p className="text-xs font-medium mt-2" style={{ color: doc.metaColor }}>{doc.meta}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
