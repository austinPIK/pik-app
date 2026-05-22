import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, CreditCard, Hotel, Plane, Zap, Car, Flag, Clock } from "lucide-react";
import { GlassPanel } from "../shared/GlassPanel";
import { LockedFeature } from "../shared/LockedFeature";
import { CTAButton } from "../shared/CTAButton";
import { TierBadge } from "../shared/TierBadge";
import { trips } from "@/data/mock";

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS = ["Details", "Customize", "Review", "Pay", "Confirm"];

const trip = trips[0];

const HOTELS = [
  { name: "Alaya Resort Ubud", stars: 5, price: 320, tag: "Recommended" },
  { name: "Komaneka at Bisma", stars: 5, price: 480, tag: "Luxury" },
  { name: "Bisma Eight", stars: 4, price: 220, tag: "Best Value" },
];

const FLIGHTS = [
  { airline: "Garuda Indonesia", from: "LAX", to: "DPS", price: 980, duration: "17h 45m" },
  { airline: "Cathay Pacific", from: "LAX", to: "DPS", price: 860, duration: "20h 10m" },
];

const ACTIVITIES = [
  { name: "Rice Terrace Trek", price: 45, duration: "4h", locked: false },
  { name: "Sunset Temple Circuit", price: 65, duration: "6h", locked: false },
  { name: "Private Cooking Class", price: 80, duration: "3h", locked: false },
  { name: "Volcano Sunrise Hike", price: 95, duration: "8h", locked: true },
];

export function TripDesignTab() {
  const [step, setStep] = useState<Step>(1);
  const [selectedHotel, setSelectedHotel] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState(0);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([0, 1]);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  function toggleActivity(idx: number) {
    setSelectedActivities((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

  const totalPrice =
    HOTELS[selectedHotel].price * trip.nights +
    FLIGHTS[selectedFlight].price +
    selectedActivities.reduce((sum, i) => sum + ACTIVITIES[i].price, 0);

  return (
    <div className="flex flex-col h-full" style={{ background: "#03040A" }}>
      {/* Step indicator */}
      <div className="px-4 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-1 mb-4">
          {STEPS.map((s, idx) => {
            const stepNum = (idx + 1) as Step;
            const active = step === stepNum;
            const done = step > stepNum;
            return (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border"
                    style={{
                      background: done ? "#4DA3FF" : active ? "rgba(77,163,255,0.2)" : "rgba(255,255,255,0.05)",
                      borderColor: done || active ? "#4DA3FF" : "rgba(255,255,255,0.1)",
                      color: done || active ? "#fff" : "#4A5575",
                    }}
                  >
                    {done ? <Check className="w-3 h-3" /> : stepNum}
                  </div>
                  <span className="text-[9px] font-medium truncate w-full text-center"
                    style={{ color: active ? "#4DA3FF" : done ? "#9BA3B7" : "#4A5575" }}>
                    {s}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className="h-0.5 flex-1 rounded-full mb-4 transition-all"
                    style={{ background: done ? "#4DA3FF" : "rgba(255,255,255,0.08)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-32">
              <div className="relative rounded-3xl overflow-hidden" style={{ height: "clamp(220px, 56vw, 300px)" }}>
                <img
                  src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=80"
                  alt="Bali"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }}
                />
                <div className="absolute top-3 left-3">
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(77,163,255,0.22)", border: "1px solid rgba(77,163,255,0.4)", color: "#4DA3FF" }}
                  >
                    {trip.status === "upcoming" ? `In ${trip.daysUntil} days` : trip.status}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-0.5">{trip.country}</p>
                  <h2 className="text-white font-semibold text-2xl tracking-[-0.02em]">{trip.destination}</h2>
                  <p className="text-white/55 text-xs mt-0.5">{trip.nights} nights · {trip.dates.start}</p>
                </div>
              </div>

              <GlassPanel className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Dates</span>
                  <span className="text-[#F5F7FF]">{trip.dates.start} – {trip.dates.end}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Hotel</span>
                  <span className="text-[#F5F7FF]">{trip.hotel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Group size</span>
                  <span className="text-[#F5F7FF]">{trip.group.length} travelers</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Starting from</span>
                  <span className="text-[#4DA3FF] font-bold text-base">${trip.price.toLocaleString()}/pp</span>
                </div>
              </GlassPanel>

              <p className="text-[#9BA3B7] text-sm leading-relaxed">{trip.description}</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 pb-32">
              {/* Hotel */}
              <div>
                <h3 className="text-[#F5F7FF] font-semibold mb-3 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-[#4DA3FF]" /> Hotel
                </h3>
                <div className="space-y-2">
                  {HOTELS.map((h, idx) => (
                    <GlassPanel
                      key={h.name}
                      className="p-3 cursor-pointer transition-all"
                      glow={selectedHotel === idx ? "blue" : undefined}
                      onClick={() => setSelectedHotel(idx)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#F5F7FF] font-medium text-sm">{h.name}</p>
                          <p className="text-[#9BA3B7] text-xs">{"★".repeat(h.stars)} · {h.tag}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#4DA3FF] font-semibold text-sm">${h.price}/night</span>
                          {selectedHotel === idx && <Check className="w-4 h-4 text-[#4DA3FF]" />}
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>

              {/* Flights */}
              <div>
                <h3 className="text-[#F5F7FF] font-semibold mb-3 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#8B5CFF]" /> Flights
                </h3>
                <div className="space-y-2">
                  {FLIGHTS.map((f, idx) => (
                    <GlassPanel
                      key={f.airline}
                      className="p-3 cursor-pointer transition-all"
                      glow={selectedFlight === idx ? "violet" : undefined}
                      onClick={() => setSelectedFlight(idx)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#F5F7FF] font-medium text-sm">{f.airline}</p>
                          <p className="text-[#9BA3B7] text-xs">{f.from} → {f.to} · {f.duration}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#8B5CFF] font-semibold text-sm">${f.price}</span>
                          {selectedFlight === idx && <Check className="w-4 h-4 text-[#8B5CFF]" />}
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div>
                <h3 className="text-[#F5F7FF] font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D946EF]" /> Activities
                </h3>
                <div className="space-y-2">
                  {ACTIVITIES.map((a, idx) => (
                    a.locked ? (
                      <LockedFeature key={a.name} tier="explorer">
                        <GlassPanel className="p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[#F5F7FF] text-sm">{a.name}</p>
                            <span className="text-[#9BA3B7] text-sm">${a.price}</span>
                          </div>
                        </GlassPanel>
                      </LockedFeature>
                    ) : (
                      <GlassPanel
                        key={a.name}
                        className="p-3 cursor-pointer"
                        glow={selectedActivities.includes(idx) ? "magenta" : undefined}
                        onClick={() => toggleActivity(idx)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#F5F7FF] font-medium text-sm">{a.name}</p>
                            <p className="text-[#9BA3B7] text-xs">{a.duration}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#D946EF] font-semibold text-sm">${a.price}</span>
                            {selectedActivities.includes(idx) && <Check className="w-4 h-4 text-[#D946EF]" />}
                          </div>
                        </div>
                      </GlassPanel>
                    )
                  ))}
                </div>
              </div>

              {/* Tee Time - Elite locked */}
              <div>
                <h3 className="text-[#F5F7FF] font-semibold mb-3 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#F59E0B]" /> Tee Time
                </h3>
                <LockedFeature tier="elite">
                  <GlassPanel className="p-4">
                    <p className="text-[#F5F7FF] text-sm font-medium">New Kuta Golf Club</p>
                    <p className="text-[#9BA3B7] text-xs">May 28 · 9:00 AM · Clifftop Ocean Views</p>
                    <p className="text-[#F59E0B] font-semibold mt-1">$180/person</p>
                  </GlassPanel>
                </LockedFeature>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-32">
              <h2 className="text-[#F5F7FF] font-bold text-xl">Price Breakdown</h2>
              <GlassPanel className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Hotel ({trip.nights} nights)</span>
                  <span className="text-[#F5F7FF]">${(HOTELS[selectedHotel].price * trip.nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Flights (round trip)</span>
                  <span className="text-[#F5F7FF]">${FLIGHTS[selectedFlight].price.toLocaleString()}</span>
                </div>
                {selectedActivities.map((i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#9BA3B7]">{ACTIVITIES[i].name}</span>
                    <span className="text-[#F5F7FF]">${ACTIVITIES[i].price}</span>
                  </div>
                ))}
                <div className="h-px bg-white/10" />
                <div className="flex justify-between">
                  <span className="text-[#F5F7FF] font-semibold">Total per person</span>
                  <span className="text-[#4DA3FF] font-bold text-lg">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Group total ({trip.group.length} people)</span>
                  <span className="text-[#F5F7FF] font-semibold">${(totalPrice * trip.group.length).toLocaleString()}</span>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-32">
              <h2 className="text-[#F5F7FF] font-bold text-xl">Payment</h2>
              <GlassPanel className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-[#4DA3FF]" />
                  <span className="text-[#9BA3B7] text-sm">Card details</span>
                </div>
                <input
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F5F7FF] placeholder:text-[#4A5575] text-sm outline-none focus:border-[#4DA3FF]/50"
                />
                <div className="flex gap-3">
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F5F7FF] placeholder:text-[#4A5575] text-sm outline-none focus:border-[#4DA3FF]/50"
                  />
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="CVV"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F5F7FF] placeholder:text-[#4A5575] text-sm outline-none focus:border-[#4DA3FF]/50"
                  />
                </div>
                <p className="text-[#4A5575] text-xs text-center">256-bit SSL encrypted · Powered by Stripe</p>
              </GlassPanel>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center space-y-6 pb-32 pt-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)" }}
              >
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>

              <div>
                <h2 className="text-[#F5F7FF] font-bold text-2xl mb-2">You're going to Bali!</h2>
                <p className="text-[#9BA3B7] text-sm max-w-64">Your trip has been confirmed. Check your wallet for documents and your group has been notified.</p>
              </div>

              <GlassPanel className="p-5 w-full text-left space-y-3">
                <h3 className="text-[#F5F7FF] font-semibold mb-1">Trip Summary</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Destination</span>
                  <span className="text-[#F5F7FF]">Bali, Indonesia</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Hotel</span>
                  <span className="text-[#F5F7FF]">{HOTELS[selectedHotel].name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Total paid</span>
                  <span className="text-[#4DA3FF] font-bold">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9BA3B7]">Confirmation</span>
                  <span className="text-[#F5F7FF]">PIK-2026-48291</span>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom booking bar */}
      <div
        className="shrink-0 px-4 py-4 border-t border-white/10"
        style={{ background: "rgba(7,10,20,0.95)", backdropFilter: "blur(24px)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#9BA3B7] text-xs">Per person</p>
            <p className="text-[#4DA3FF] font-bold text-xl">${totalPrice.toLocaleString()}</p>
          </div>
          <CTAButton
            variant="primary"
            onClick={() => step < 5 ? setStep((step + 1) as Step) : undefined}
          >
            {step === 5 ? "View Wallet" : step === 4 ? "Confirm & Pay" : step === 3 ? "Proceed to Pay" : "Continue"}
            {step < 5 && <ChevronRight className="w-4 h-4" />}
          </CTAButton>
        </div>
        {step > 1 && step < 5 && (
          <button
            onClick={() => setStep((step - 1) as Step)}
            className="text-[#4A5575] text-sm hover:text-[#9BA3B7] transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
