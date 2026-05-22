import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Check, ShoppingBag, RotateCcw, Package } from "lucide-react";
import { LockedFeature } from "../shared/LockedFeature";

type GearStatus = "own" | "buy" | "rent";
type Cat = "All" | "Apparel" | "Gear" | "Documents" | "Tech" | "Health";

interface GearItem {
  id: string; name: string; category: Cat; status: GearStatus;
  packed: boolean; assignedTo?: string;
}

const INITIAL_GEAR: GearItem[] = [
  { id:"1",  name:"Merino base layer",      category:"Apparel",   status:"own",  packed:true,  assignedTo:"Austin K." },
  { id:"2",  name:"Waterproof jacket",      category:"Apparel",   status:"own",  packed:true  },
  { id:"3",  name:"Hiking boots",           category:"Apparel",   status:"own",  packed:false },
  { id:"4",  name:"Trekking poles",         category:"Gear",      status:"rent", packed:false, assignedTo:"Group" },
  { id:"5",  name:"Sleeping bag (−10°C)",   category:"Gear",      status:"rent", packed:false, assignedTo:"Jake T." },
  { id:"6",  name:"Headlamp + batteries",   category:"Gear",      status:"own",  packed:true  },
  { id:"7",  name:"First aid kit",          category:"Health",    status:"own",  packed:true  },
  { id:"8",  name:"Altitude sickness meds", category:"Health",    status:"buy",  packed:false },
  { id:"9",  name:"Sunscreen SPF 60+",      category:"Health",    status:"buy",  packed:false },
  { id:"10", name:"Passport",               category:"Documents", status:"own",  packed:true  },
  { id:"11", name:"Travel insurance docs",  category:"Documents", status:"own",  packed:false },
  { id:"12", name:"Satellite communicator", category:"Tech",      status:"rent", packed:false, assignedTo:"Austin K." },
  { id:"13", name:"Portable charger",       category:"Tech",      status:"own",  packed:true  },
  { id:"14", name:"Camera + extra battery", category:"Tech",      status:"own",  packed:true  },
];

const STATUS_CONFIG: Record<GearStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  own:  { label: "Own",  color: "#10B981", bg: "rgba(16,185,129,0.12)",  icon: Check       },
  buy:  { label: "Buy",  color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  icon: ShoppingBag },
  rent: { label: "Rent", color: "#4DA3FF", bg: "rgba(77,163,255,0.12)",  icon: RotateCcw   },
};

const CATS: Cat[] = ["All","Apparel","Gear","Documents","Tech","Health"];

export function GearTab() {
  const [gear, setGear] = useState<GearItem[]>(INITIAL_GEAR);
  const [cat, setCat] = useState<Cat>("All");

  function togglePacked(id: string) {
    setGear((prev) => prev.map((g) => g.id === id ? { ...g, packed: !g.packed } : g));
  }

  function cycleStatus(id: string) {
    const order: GearStatus[] = ["own", "buy", "rent"];
    setGear((prev) => prev.map((g) => {
      if (g.id !== id) return g;
      const next = order[(order.indexOf(g.status) + 1) % 3];
      return { ...g, status: next };
    }));
  }

  const filtered = cat === "All" ? gear : gear.filter((g) => g.category === cat);
  const packed = gear.filter((g) => g.packed).length;

  return (
    <div className="min-h-full pb-24 lg:pb-8 px-5 lg:px-8 pt-6 lg:pt-8" style={{ background: "#03040A" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#F5F7FF]">Gear</h1>
          <p className="text-sm text-[#9BA3B7]">Everything you need, perfectly packed.</p>
        </div>

        {/* Progress */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#F5F7FF]">{packed} / {gear.length} packed</span>
            <span className="text-xs text-[#9BA3B7]">{Math.round((packed / gear.length) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#4DA3FF,#8B5CFF)" }}
              initial={{ width: 0 }}
              animate={{ width: `${(packed / gear.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* AI + Group buttons */}
        <div className="flex gap-3 mb-5">
          <LockedFeature tier="explorer" locked={true}>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#4DA3FF,#8B5CFF)" }}
            >
              <Sparkles size={14} /> AI Generate List
            </button>
          </LockedFeature>
          <LockedFeature tier="explorer" locked={true}>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#9BA3B7" }}
            >
              <Users size={14} /> Assign to Group
            </button>
          </LockedFeature>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
              style={{
                background: cat === c ? "rgba(77,163,255,0.15)" : "rgba(255,255,255,0.04)",
                border: cat === c ? "1px solid rgba(77,163,255,0.35)" : "1px solid rgba(255,255,255,0.08)",
                color: cat === c ? "#4DA3FF" : "#9BA3B7",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Gear list */}
        <div className="space-y-2">
          {filtered.map((item, i) => {
            const sc = STATUS_CONFIG[item.status];
            const StatusIcon = sc.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-opacity"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: item.packed ? 0.6 : 1,
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => togglePacked(item.id)}
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: item.packed ? "#4DA3FF" : "transparent",
                    border: item.packed ? "none" : "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  {item.packed && <Check size={11} className="text-white" strokeWidth={3} />}
                </button>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.packed ? "line-through text-[#4A5575]" : "text-[#F5F7FF]"}`}>{item.name}</p>
                  {item.assignedTo && (
                    <p className="text-[10px] text-[#9BA3B7]">→ {item.assignedTo}</p>
                  )}
                </div>

                {/* Status badge */}
                <button
                  onClick={() => cycleStatus(item.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-all flex-shrink-0"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  <StatusIcon size={10} strokeWidth={2.5} />
                  <span className="text-[9px] font-semibold">{sc.label}</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
