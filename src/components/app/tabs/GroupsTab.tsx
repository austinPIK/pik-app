import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  MoreHorizontal,
  Search,
  Send,
  Paperclip,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  CreditCard,
  Users,
  FileText,
  Map,
  Plus,
  Pin,
  UserPlus,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Shield,
  Plane,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface GroupTrip {
  id: string;
  name: string;
  destination: string;
  dates: string;
  travelers: number;
  unread: number;
  paymentsPending: number;
  docsComplete: number;
  status: "active" | "confirmed" | "upcoming";
  gradientFrom: string;
  gradientTo: string;
  image: string;
  isHost: boolean;
}

type HomeTab = "trips" | "chats" | "hosts" | "requests";
type WorkspaceTab = "chat" | "itinerary" | "payments" | "travelers" | "docs" | "gear";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const GROUP_TRIPS: GroupTrip[] = [
  {
    id: "g1",
    name: "Patagonia 2026",
    destination: "El Calafate, Argentina",
    dates: "May 18–25, 2026",
    travelers: 5,
    unread: 3,
    paymentsPending: 2,
    docsComplete: 80,
    status: "active",
    gradientFrom: "#1a3a6b",
    gradientTo: "#0a1a40",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    isHost: true,
  },
  {
    id: "g2",
    name: "Greece Summer",
    destination: "Santorini, Greece",
    dates: "Jun 15–22, 2026",
    travelers: 4,
    unread: 0,
    paymentsPending: 0,
    docsComplete: 100,
    status: "confirmed",
    gradientFrom: "#4a2a1a",
    gradientTo: "#2a1a0a",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    isHost: false,
  },
  {
    id: "g3",
    name: "Bali Retreat",
    destination: "Ubud, Bali",
    dates: "May 24–Jun 3, 2026",
    travelers: 5,
    unread: 1,
    paymentsPending: 1,
    docsComplete: 60,
    status: "upcoming",
    gradientFrom: "#1a6b5a",
    gradientTo: "#0d3b4f",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80",
    isHost: false,
  },
];

const MEMBERS = [
  { id: "1", name: "Austin K.",  avatar: "AK", color: "#4DA3FF", role: "Host",   paid: true,  amount: 2890, due: 2890, location: "Austin, TX",    docStatus: "complete" as const,  payStatus: "paid" as const },
  { id: "2", name: "Maya R.",    avatar: "MR", color: "#8B5CFF", role: "Member", paid: true,  amount: 2890, due: 2890, location: "Denver, CO",    docStatus: "complete" as const,  payStatus: "paid" as const },
  { id: "3", name: "Jake T.",    avatar: "JT", color: "#D946EF", role: "Member", paid: false, amount: 0,    due: 2890, location: "New York, NY",  docStatus: "missing"  as const,  payStatus: "pending" as const },
  { id: "4", name: "Sofia L.",   avatar: "SL", color: "#10B981", role: "Member", paid: true,  amount: 2890, due: 2890, location: "Miami, FL",     docStatus: "complete" as const,  payStatus: "paid" as const },
  { id: "5", name: "Ethan B.",   avatar: "EB", color: "#F59E0B", role: "Member", paid: false, amount: 1200, due: 2890, location: "Seattle, WA",   docStatus: "partial"  as const,  payStatus: "partial" as const },
];

const MESSAGES = [
  { id: "1", sender: "Maya R.",  avatar: "MR", color: "#8B5CFF", text: "Can't wait for Patagonia! 🏔️", time: "2:14 PM", me: false },
  { id: "2", sender: "Me",       avatar: "AK", color: "#4DA3FF", text: "Same! Varix optimized Day 3 — check the itinerary update.", time: "2:16 PM", me: true },
  { id: "3", sender: "Jake T.",  avatar: "JT", color: "#D946EF", text: "Just submitted my docs. Do we need travel insurance?", time: "2:20 PM", me: false },
  { id: "4", sender: "Sofia L.", avatar: "SL", color: "#10B981", text: "Yes! I'll share the policy Varix recommended.", time: "2:22 PM", me: false },
  { id: "5", sender: "Me",       avatar: "AK", color: "#4DA3FF", text: "Good call. Also — gear list is in the Gear tab, everyone check it.", time: "2:24 PM", me: true },
];

const ITINERARY = [
  {
    day: "Day 1",
    title: "Buenos Aires Arrival",
    date: "May 18",
    events: [
      { time: "14:30", label: "Land EZE — Ministro Pistarini", icon: Plane },
      { time: "16:00", label: "Hotel Palacio Duhau check-in", icon: Shield },
      { time: "20:00", label: "Group dinner — El Preferido de Palermo", icon: Users },
    ],
  },
  {
    day: "Day 2",
    title: "Fly to El Calafate",
    date: "May 19",
    events: [
      { time: "07:15", label: "Morning flight AR 1860 to Calafate", icon: Plane },
      { time: "11:00", label: "Perito Moreno Glacier guided tour", icon: Map },
      { time: "17:00", label: "Trek briefing with guide team", icon: Users },
    ],
  },
  {
    day: "Day 3",
    title: "Patagonia Trek Day 1",
    date: "May 20",
    events: [
      { time: "06:00", label: "Early start — packed breakfast", icon: Clock },
      { time: "07:30", label: "Torres del Paine W Circuit trailhead", icon: Map },
      { time: "18:00", label: "Camp at Mirador (pre-reserved)", icon: Shield },
    ],
  },
];

const DOCS_PER_MEMBER: Record<string, { passport: boolean; insurance: boolean; visa: boolean }> = {
  "1": { passport: true,  insurance: true,  visa: true  },
  "2": { passport: true,  insurance: true,  visa: true  },
  "3": { passport: true,  insurance: false, visa: false },
  "4": { passport: true,  insurance: true,  visa: true  },
  "5": { passport: true,  insurance: false, visa: false },
};

type GearStatus = "own" | "buy" | "rent";

interface GearItem {
  id: string;
  name: string;
  member: string;
  status: GearStatus;
}

interface GearCategory {
  label: string;
  items: GearItem[];
}

const GEAR_CATEGORIES: GearCategory[] = [
  {
    label: "Apparel",
    items: [
      { id: "a1", name: "Waterproof hiking jacket", member: "me",   status: "own"  },
      { id: "a2", name: "Thermal base layers",      member: "Maya", status: "own"  },
      { id: "a3", name: "Hiking boots",             member: "Jake", status: "buy"  },
    ],
  },
  {
    label: "Gear",
    items: [
      { id: "g1", name: "First aid kit",    member: "me",    status: "own"  },
      { id: "g2", name: "Trekking poles",   member: "Sofia", status: "own"  },
      { id: "g3", name: "Headlamp",         member: "Ethan", status: "buy"  },
      { id: "g4", name: "Water filter",     member: "Marcus",status: "rent" },
    ],
  },
  {
    label: "Documents",
    items: [
      { id: "d1", name: "Travel insurance", member: "me",   status: "own" },
      { id: "d2", name: "Visa copy",        member: "Jake", status: "buy" },
    ],
  },
  {
    label: "Tech",
    items: [
      { id: "t1", name: "Portable battery", member: "me",    status: "own" },
      { id: "t2", name: "GoPro",            member: "Sofia", status: "own" },
    ],
  },
];

interface PendingInvitation {
  id: string;
  tripName: string;
  destination: string;
  dates: string;
  pricePerPerson: number;
  host: string;
}

const PENDING_INVITATIONS: PendingInvitation[] = [
  {
    id: "inv1",
    tripName: "Kyoto Adventure 2026",
    destination: "Kyoto, Japan",
    dates: "May 10–18, 2026",
    pricePerPerson: 3200,
    host: "Elena V.",
  },
];

const DM_CONTACTS = [
  { id: "dm1", name: "Maya R.",    avatar: "MR", color: "#8B5CFF", last: "Sent the insurance doc 📄", time: "2:22 PM", unread: 0 },
  { id: "dm2", name: "Jake T.",    avatar: "JT", color: "#D946EF", last: "When do I need to pay by?",  time: "1:45 PM", unread: 1 },
  { id: "dm3", name: "Ethan B.",   avatar: "EB", color: "#F59E0B", last: "Can we switch Day 2 order?", time: "Yesterday", unread: 0 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const STATUS_CONFIG = {
  paid:    { icon: CheckCircle, color: "#10B981", label: "Paid",    bg: "rgba(16,185,129,0.12)"  },
  partial: { icon: Clock,       color: "#F59E0B", label: "Partial", bg: "rgba(245,158,11,0.12)"  },
  pending: { icon: AlertCircle, color: "#EF4444", label: "Due",     bg: "rgba(239,68,68,0.12)"   },
};

function StatusPill({ type }: { type: "paid" | "partial" | "pending" }) {
  const cfg = STATUS_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: cfg.bg }}>
      <Icon size={11} style={{ color: cfg.color }} />
      <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

function MemberAvatars({ members, max = 5 }: { members: typeof MEMBERS; max?: number }) {
  const shown = members.slice(0, max);
  return (
    <div className="flex -space-x-2">
      {shown.map((m) => (
        <div
          key={m.id}
          className="w-7 h-7 rounded-full border-2 border-[#03040A] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          style={{ background: m.color }}
        >
          {m.avatar}
        </div>
      ))}
      {members.length > max && (
        <div className="w-7 h-7 rounded-full border-2 border-[#03040A] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: "#4A5575" }}>
          +{members.length - max}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChatTab() {
  const [msg, setMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative h-full">
      {/* Scrollable messages — pb clears fixed composer + bottom nav */}
      <div
        className="absolute inset-0 overflow-y-auto px-4 pt-2 space-y-3"
        style={{ paddingBottom: "calc(max(env(safe-area-inset-bottom), 6px) + 138px)" }}
      >
        {/* Pinned host announcement */}
        <div
          className="flex items-start gap-3 p-3 rounded-2xl"
          style={{ background: "rgba(245,158,11,0.09)", border: "1px solid rgba(245,158,11,0.22)" }}
        >
          <Pin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
          <div>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#F59E0B" }}>Host Update</p>
            <p className="text-xs text-[#9BA3B7] leading-relaxed">
              Check-in for all members is confirmed. Docs still needed from <span className="text-[#F5F7FF] font-medium">Jake T.</span>
            </p>
          </div>
        </div>

        {/* Messages */}
        {MESSAGES.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`flex gap-2.5 ${m.me ? "flex-row-reverse" : ""}`}
          >
            {!m.me && (
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
                style={{ background: m.color }}
              >
                {m.avatar}
              </div>
            )}
            <div className={`max-w-[75%] flex flex-col gap-0.5 ${m.me ? "items-end" : "items-start"}`}>
              {!m.me && <span className="text-[10px] text-[#9BA3B7] ml-1">{m.sender}</span>}
              <div
                className="px-3.5 py-2.5 rounded-2xl text-sm leading-snug"
                style={{
                  background: m.me ? "linear-gradient(135deg,#4DA3FF,#8B5CFF)" : "rgba(255,255,255,0.06)",
                  color: m.me ? "#fff" : "#F5F7FF",
                  borderBottomRightRadius: m.me ? 4 : undefined,
                  borderBottomLeftRadius: !m.me ? 4 : undefined,
                }}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-[#4A5575] mx-1">{m.time}</span>
            </div>
          </motion.div>
        ))}

        {/* Varix update in feed */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-start gap-3 p-3.5 rounded-2xl"
          style={{ background: "rgba(139,92,255,0.07)", border: "1px solid rgba(139,92,255,0.22)" }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#4DA3FF,#8B5CFF)" }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#8B5CFF" }}>Varix Update</p>
            <p className="text-xs text-[#9BA3B7] leading-snug">
              Day 3 weather looks optimal. Pre-reserved <span className="text-[#F5F7FF]">Mirador campsite</span> and adjusted departure to 06:15 to beat crowds.
            </p>
          </div>
        </motion.div>

        {/* Payment reminder */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}
        >
          <CreditCard size={13} className="flex-shrink-0" style={{ color: "#EF4444" }} />
          <p className="text-xs text-[#9BA3B7]">
            <span className="text-[#F5F7FF] font-medium">Jake T.</span> payment reminder sent — <span className="text-[#F5F7FF] font-medium">$2,890</span> due in 3 days
          </p>
        </motion.div>

        <div ref={bottomRef} />
      </div>

      {/* Composer — fixed above the bottom nav, premium glass */}
      <div
        className="fixed left-0 right-0 z-[45] px-4 lg:hidden"
        style={{ bottom: "calc(max(env(safe-area-inset-bottom), 6px) + 70px)" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
          style={{
            background: "rgba(6,8,15,0.88)",
            border: "1px solid rgba(255,255,255,0.11)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 -2px 20px rgba(0,0,0,0.45), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <button className="p-1.5 rounded-lg flex-shrink-0 hover:bg-white/5 transition-colors">
            <Paperclip size={15} style={{ color: "#9BA3B7" }} />
          </button>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Message the group…"
            className="flex-1 bg-transparent text-sm text-[#F5F7FF] outline-none placeholder:text-[#4A5575] min-w-0"
          />
          <button className="p-1.5 rounded-lg flex-shrink-0 hover:bg-white/5 transition-colors">
            <Sparkles size={15} style={{ color: "#8B5CFF" }} />
          </button>
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#4DA3FF,#8B5CFF)" }}
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
      {/* Desktop composer — stays in normal flow */}
      <div className="hidden lg:block px-4 pb-4 pt-2 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <button className="p-1.5 rounded-lg flex-shrink-0 hover:bg-white/5 transition-colors">
            <Paperclip size={15} style={{ color: "#9BA3B7" }} />
          </button>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Message the group…"
            className="flex-1 bg-transparent text-sm text-[#F5F7FF] outline-none placeholder:text-[#4A5575] min-w-0"
          />
          <button className="p-1.5 rounded-lg flex-shrink-0 hover:bg-white/5 transition-colors">
            <Sparkles size={15} style={{ color: "#8B5CFF" }} />
          </button>
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#4DA3FF,#8B5CFF)" }}
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ItineraryTab() {
  const [expanded, setExpanded] = useState<string | null>("Day 1");

  return (
    <div className="flex flex-col gap-3 px-4 py-3 overflow-y-auto">
      {ITINERARY.map((day, i) => {
        const isOpen = expanded === day.day;
        return (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl overflow-hidden"
            style={cardStyle}
          >
            <button
              className="w-full flex items-center gap-3 p-4"
              onClick={() => setExpanded(isOpen ? null : day.day)}
            >
              <div
                className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                style={{ background: "rgba(77,163,255,0.12)" }}
              >
                <span className="text-[8px] font-bold text-[#4DA3FF] leading-none uppercase">May</span>
                <span className="text-sm font-bold text-[#4DA3FF] leading-none">{day.date.split(" ")[1]}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] font-semibold text-[#4DA3FF] uppercase tracking-wider">{day.day}</p>
                <p className="text-sm font-semibold text-[#F5F7FF]">{day.title}</p>
              </div>
              {isOpen ? (
                <ChevronDown size={16} style={{ color: "#9BA3B7" }} />
              ) : (
                <ChevronRight size={16} style={{ color: "#9BA3B7" }} />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2.5">
                    <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    {day.events.map((evt) => {
                      const Icon = evt.icon;
                      return (
                        <div key={evt.label} className="flex items-center gap-3">
                          <span className="text-[10px] text-[#4A5575] w-10 flex-shrink-0 font-mono">{evt.time}</span>
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(77,163,255,0.10)" }}>
                            <Icon size={11} style={{ color: "#4DA3FF" }} />
                          </div>
                          <span className="text-xs text-[#9BA3B7] leading-snug">{evt.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Varix Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "rgba(139,92,255,0.07)", border: "1px solid rgba(139,92,255,0.20)" }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#4DA3FF,#8B5CFF)" }}>
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "#8B5CFF" }}>Varix Insight</p>
          <p className="text-xs text-[#9BA3B7] leading-relaxed">
            Day 3 weather window is optimal (8–14°C, no precipitation). I've pre-reserved the Mirador campsite and adjusted departure to 06:15 to beat crowds at the lookout. Gear packs confirmed for 5 hikers.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function PaymentsTab() {
  const totalPaid = MEMBERS.reduce((acc, m) => acc + m.amount, 0);
  const totalDue = MEMBERS.reduce((acc, m) => acc + m.due, 0);
  const paidCount = MEMBERS.filter((m) => m.paid).length;

  return (
    <div className="flex flex-col gap-4 px-4 py-3 overflow-y-auto">
      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4"
        style={cardStyle}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-[#9BA3B7] mb-0.5">Group Total</p>
            <p className="text-xl font-bold text-[#F5F7FF]">${totalPaid.toLocaleString()} <span className="text-sm font-normal text-[#4A5575]">/ ${totalDue.toLocaleString()}</span></p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#10B981]">{paidCount} of {MEMBERS.length}</p>
            <p className="text-xs text-[#9BA3B7]">members paid</p>
          </div>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalPaid / totalDue) * 100}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#4DA3FF,#10B981)" }}
          />
        </div>
        <p className="text-[10px] text-[#4A5575] mt-1.5 text-right">{Math.round((totalPaid / totalDue) * 100)}% collected</p>
      </motion.div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(77,163,255,0.12)", color: "#4DA3FF", border: "1px solid rgba(77,163,255,0.20)" }}
        >
          <RefreshCw size={12} />
          Split Equally
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(16,185,129,0.10)", color: "#10B981", border: "1px solid rgba(16,185,129,0.20)" }}
        >
          <Download size={12} />
          Export Report
        </button>
      </div>

      {/* Member list */}
      <div className="space-y-2.5">
        {MEMBERS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={cardStyle}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: m.color }}>
              {m.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-[#F5F7FF] truncate">{m.name}</span>
                <span className="text-[9px] text-[#4A5575] bg-white/5 px-1.5 py-0.5 rounded-full">{m.role}</span>
              </div>
              <p className="text-xs text-[#9BA3B7]">${m.amount.toLocaleString()} <span className="text-[#4A5575]">/ ${m.due.toLocaleString()}</span></p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <StatusPill type={m.payStatus} />
              {m.payStatus !== "paid" && (
                <button className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(77,163,255,0.12)", color: "#4DA3FF" }}>
                  Request
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TravelersTab() {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 overflow-y-auto">
      {MEMBERS.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-2xl p-4"
          style={cardStyle}
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: m.color }}>
              {m.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-sm font-semibold text-[#F5F7FF]">{m.name}</span>
                {m.role === "Host" && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(77,163,255,0.15)", color: "#4DA3FF" }}>HOST</span>
                )}
              </div>
              <p className="text-xs text-[#4A5575] mb-2">{m.location}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Doc status */}
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={
                    m.docStatus === "complete"
                      ? { background: "rgba(16,185,129,0.12)", color: "#10B981" }
                      : m.docStatus === "partial"
                      ? { background: "rgba(245,158,11,0.12)", color: "#F59E0B" }
                      : { background: "rgba(239,68,68,0.12)", color: "#EF4444" }
                  }
                >
                  <FileText size={9} />
                  {m.docStatus === "complete" ? "Docs complete" : m.docStatus === "partial" ? "Docs partial" : "Docs missing"}
                </div>
                {/* Payment status */}
                <StatusPill type={m.payStatus} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Invite button */}
      <button
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold mt-1"
        style={{ background: "rgba(77,163,255,0.08)", border: "1px dashed rgba(77,163,255,0.30)", color: "#4DA3FF" }}
      >
        <UserPlus size={15} />
        Invite Traveler
      </button>
    </div>
  );
}

function DocsTab() {
  const DOC_TYPES = [
    { key: "passport" as const, label: "Passport", icon: Shield },
    { key: "insurance" as const, label: "Travel Insurance", icon: Shield },
    { key: "visa" as const, label: "Visa Copy", icon: FileText },
  ];

  const allComplete = MEMBERS.every((m) => {
    const d = DOCS_PER_MEMBER[m.id];
    return d.passport && d.insurance && d.visa;
  });

  return (
    <div className="flex flex-col gap-3 px-4 py-3 overflow-y-auto">
      {/* Overall progress */}
      <div className="rounded-2xl p-4" style={cardStyle}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[#F5F7FF]">Documents Progress</p>
          <p className="text-sm font-bold text-[#4DA3FF]">80%</p>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#4DA3FF,#10B981)" }}
          />
        </div>
      </div>

      {/* Per-member docs */}
      {MEMBERS.map((m, i) => {
        const docs = DOCS_PER_MEMBER[m.id];
        const allDone = docs.passport && docs.insurance && docs.visa;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-4"
            style={cardStyle}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: m.color }}>
                {m.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#F5F7FF]">{m.name}</p>
                <p className="text-[10px] text-[#4A5575]">{m.role}</p>
              </div>
              <div
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={allDone
                  ? { background: "rgba(16,185,129,0.12)", color: "#10B981" }
                  : { background: "rgba(245,158,11,0.12)", color: "#F59E0B" }
                }
              >
                {allDone ? "Complete" : "Incomplete"}
              </div>
            </div>
            <div className="space-y-2">
              {DOC_TYPES.map(({ key, label, icon: Icon }) => {
                const checked = docs[key];
                return (
                  <div key={key} className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={checked
                        ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.40)" }
                        : { background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)" }
                      }
                    >
                      {checked && <CheckCircle size={10} style={{ color: "#10B981" }} />}
                    </div>
                    <Icon size={11} style={{ color: checked ? "#10B981" : "#4A5575" }} />
                    <span className="text-xs" style={{ color: checked ? "#9BA3B7" : "#EF4444" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Request all button */}
      {!allComplete && (
        <button
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg,rgba(77,163,255,0.15),rgba(139,92,255,0.15))", border: "1px solid rgba(77,163,255,0.25)", color: "#4DA3FF" }}
        >
          <Send size={13} />
          Request All Missing Docs
        </button>
      )}
    </div>
  );
}

function GearTab() {
  const [itemStatuses, setItemStatuses] = useState<Record<string, GearStatus>>(() => {
    const init: Record<string, GearStatus> = {};
    GEAR_CATEGORIES.forEach((cat) => cat.items.forEach((item) => { init[item.id] = item.status; }));
    return init;
  });

  const STATUS_CYCLE: GearStatus[] = ["own", "buy", "rent"];
  const STATUS_STYLES: Record<GearStatus, { color: string; bg: string; border: string; label: string }> = {
    own:  { color: "#10B981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.40)", label: "Bringing my own" },
    buy:  { color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.40)", label: "Need to buy"     },
    rent: { color: "#8B5CFF", bg: "rgba(139,92,255,0.15)",  border: "rgba(139,92,255,0.40)", label: "Renting"         },
  };

  const allItems = GEAR_CATEGORIES.flatMap((c) => c.items);
  const readyCount  = allItems.filter((i) => itemStatuses[i.id] === "own").length;
  const buyCount    = allItems.filter((i) => itemStatuses[i.id] === "buy").length;
  const rentCount   = allItems.filter((i) => itemStatuses[i.id] === "rent").length;

  const cycleStatus = (id: string) => {
    setItemStatuses((prev) => {
      const cur = prev[id];
      const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-3 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <p className="text-sm font-bold text-[#F5F7FF]">Gear List</p>
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(139,92,255,0.15)", color: "#8B5CFF", border: "1px solid rgba(139,92,255,0.25)" }}
        >
          Varix-generated
        </span>
      </div>

      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
          <span className="text-xs text-[#9BA3B7]"><span className="text-[#F5F7FF] font-semibold">{readyCount}</span> ready</span>
        </div>
        <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.10)" }} />
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
          <span className="text-xs text-[#9BA3B7]"><span className="text-[#F5F7FF] font-semibold">{buyCount}</span> to buy</span>
        </div>
        <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.10)" }} />
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "#8B5CFF" }} />
          <span className="text-xs text-[#9BA3B7]"><span className="text-[#F5F7FF] font-semibold">{rentCount}</span> to rent</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {(Object.entries(STATUS_STYLES) as [GearStatus, typeof STATUS_STYLES[GearStatus]][]).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
            <span className="text-[10px] text-[#4A5575]">{s.label}</span>
          </div>
        ))}
        <span className="text-[10px] text-[#4A5575] italic ml-auto">Tap to change</span>
      </div>

      {/* Categories */}
      {GEAR_CATEGORIES.map((cat, ci) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ci * 0.08 }}
          className="rounded-2xl overflow-hidden"
          style={cardStyle}
        >
          <div className="px-4 pt-3.5 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A5575]">{cat.label}</p>
          </div>
          <div className="px-4 pb-3.5 space-y-2.5 mt-1">
            {cat.items.map((item) => {
              const st = itemStatuses[item.id];
              const sty = STATUS_STYLES[st];
              return (
                <button
                  key={item.id}
                  onClick={() => cycleStatus(item.id)}
                  className="w-full flex items-center gap-3 text-left transition-opacity hover:opacity-80 active:opacity-60"
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: sty.bg, border: `1px solid ${sty.border}` }}
                  >
                    <CheckCircle size={11} style={{ color: sty.color }} />
                  </div>
                  <span className="flex-1 text-sm text-[#F5F7FF] leading-snug">{item.name}</span>
                  <span className="text-[10px] text-[#4A5575] flex-shrink-0">{item.member}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Group Workspace ──────────────────────────────────────────────────────────

function GroupWorkspace({ tripId, onBack }: { tripId: string; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("chat");
  const trip = GROUP_TRIPS.find((t) => t.id === tripId)!;

  const WORKSPACE_TABS: { id: WorkspaceTab; label: string; icon: React.ElementType }[] = [
    { id: "chat",      label: "Chat",      icon: MessageSquare },
    { id: "itinerary", label: "Itinerary", icon: Map           },
    { id: "payments",  label: "Payments",  icon: CreditCard    },
    { id: "travelers", label: "Travelers", icon: Users         },
    { id: "docs",      label: "Docs",      icon: FileText      },
    { id: "gear",      label: "Gear",      icon: Shield        },
  ];

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full"
      style={{ background: "#03040A" }}
    >
      {/* Sticky header */}
      <div
        className="flex-shrink-0 px-4 pt-5 pb-3"
        style={{ background: "rgba(6,8,15,0.95)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-white/5 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ChevronLeft size={18} style={{ color: "#9BA3B7" }} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-[#F5F7FF] truncate">{trip.name}</h2>
              {trip.isHost && (
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(77,163,255,0.15)", color: "#4DA3FF" }}
                >
                  HOST
                </span>
              )}
            </div>
            <p className="text-xs text-[#9BA3B7] truncate">{trip.destination} · {trip.dates}</p>
          </div>
          <MemberAvatars members={MEMBERS} max={4} />
          <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-white/5 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>
            <MoreHorizontal size={16} style={{ color: "#9BA3B7" }} />
          </button>
        </div>

        {/* Sub-tab pills (horizontal scroll) */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {WORKSPACE_TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive ? "rgba(77,163,255,0.15)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#4DA3FF" : "#9BA3B7",
                  border: isActive ? "1px solid rgba(77,163,255,0.25)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Icon size={12} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content — flex-1 so it fills remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full flex flex-col"
            >
              <ChatTab />
            </motion.div>
          )}
          {activeTab === "itinerary" && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full overflow-y-auto"
            >
              <ItineraryTab />
            </motion.div>
          )}
          {activeTab === "payments" && (
            <motion.div
              key="payments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full overflow-y-auto"
            >
              <PaymentsTab />
            </motion.div>
          )}
          {activeTab === "travelers" && (
            <motion.div
              key="travelers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full overflow-y-auto"
            >
              <TravelersTab />
            </motion.div>
          )}
          {activeTab === "docs" && (
            <motion.div
              key="docs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full overflow-y-auto"
            >
              <DocsTab />
            </motion.div>
          )}
          {activeTab === "gear" && (
            <motion.div
              key="gear"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full overflow-y-auto"
            >
              <GearTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function InvitationCard({ invitation }: { invitation: PendingInvitation }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl p-3"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}
    >
      <div className="flex items-start gap-3 mb-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
          style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}
        >
          {invitation.host.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#F5F7FF] truncate">{invitation.tripName}</p>
          <p className="text-xs text-[#9BA3B7] truncate">{invitation.destination}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] text-[#4A5575]">{invitation.dates}</span>
            <span className="text-[10px] text-[#4A5575]">·</span>
            <span className="text-[10px] font-semibold" style={{ color: "#F59E0B" }}>${invitation.pricePerPerson.toLocaleString()} / person</span>
          </div>
          <p className="text-[10px] text-[#4A5575] mt-0.5">From <span className="text-[#9BA3B7] font-medium">{invitation.host}</span></p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", color: "#9BA3B7", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          Decline
        </button>
        <button
          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
          style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}
        >
          Accept
        </button>
      </div>
    </motion.div>
  );
}

// ─── Groups Home ──────────────────────────────────────────────────────────────

function GroupsHome({ onSelectGroup }: { onSelectGroup: (id: string) => void }) {
  const [homeTab, setHomeTab] = useState<HomeTab>("trips");
  const [search, setSearch] = useState("");

  const HOME_TABS: { id: HomeTab; label: string }[] = [
    { id: "trips",    label: "Trips"    },
    { id: "chats",    label: "Chats"    },
    { id: "hosts",    label: "Hosts"    },
    { id: "requests", label: "Requests" },
  ];

  const STATUS_LABELS: Record<GroupTrip["status"], { label: string; color: string; bg: string }> = {
    active:    { label: "Active",     color: "#4DA3FF", bg: "rgba(77,163,255,0.12)"  },
    confirmed: { label: "Confirmed",  color: "#10B981", bg: "rgba(16,185,129,0.12)" },
    upcoming:  { label: "Upcoming",   color: "#F59E0B", bg: "rgba(245,158,11,0.12)"  },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-full pb-28 lg:pb-8 px-4 lg:px-8 pt-6 lg:pt-8"
    >
      <div className="max-w-5xl mx-auto lg:max-w-none">
        {/* Header — no border, no seam, blends into #06080F page BG */}
        <div style={{ position: "relative", overflow: "hidden", margin: "-24px -16px 0", borderRadius: 0 }} className="lg:-mx-8 lg:-mt-8">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=60"
            alt="" aria-hidden="true"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.18, filter: "blur(28px)",
              transform: "scale(1.1)", pointerEvents: "none",
            }}
          />
          {/* Dark overlay — using exact page BG rgb so bottom fade is seamless */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(165deg, rgba(6,8,15,0.92) 0%, rgba(6,8,15,0.72) 55%, rgba(6,8,15,0.96) 100%)",
            pointerEvents: "none",
          }} />
          {/* Blue orb accent */}
          <div style={{
            position: "absolute", bottom: -16, left: -16, width: 260, height: 180,
            background: "radial-gradient(ellipse, rgba(77,163,255,0.12) 0%, transparent 65%)",
            filter: "blur(40px)", pointerEvents: "none",
          }} />
          {/* Bottom fade — must match #06080F exactly so no seam appears */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
            background: "linear-gradient(to bottom, transparent 0%, #06080F 100%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", padding: "62px 20px 36px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.34em", color: "#4DA3FF", textTransform: "uppercase", margin: "0 0 10px" }}>
              YOUR CREW
            </p>
            <h1 style={{ fontSize: 42, fontWeight: 900, color: "#F5F7FF", letterSpacing: "-0.045em", margin: "0 0 10px", lineHeight: 0.95 }}>
              Groups
            </h1>
            <p style={{ fontSize: 13, color: "rgba(245,247,255,0.52)", margin: 0, fontStyle: "italic", letterSpacing: "0.01em" }}>
              Coordinate trips, travelers, payments, and plans.
            </p>
          </div>
        </div>

        {/* Join Request Notification Banner */}
        {PENDING_INVITATIONS.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-4 rounded-2xl overflow-hidden"
            style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.28)" }}
          >
            {/* Banner header */}
            <div className="flex items-center gap-2 px-4 pt-3.5 pb-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.20)" }}
              >
                <UserPlus size={12} style={{ color: "#F59E0B" }} />
              </div>
              <p className="text-xs font-bold" style={{ color: "#F59E0B" }}>
                You have {PENDING_INVITATIONS.length} trip invitation{PENDING_INVITATIONS.length > 1 ? "s" : ""} waiting
              </p>
            </div>

            {/* Invitation cards */}
            <div className="px-3 pb-3 space-y-2.5">
              {PENDING_INVITATIONS.map((inv) => (
                <InvitationCard key={inv.id} invitation={inv} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={15} style={{ color: "#4A5575" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trips, travelers, or messages…"
            className="flex-1 bg-transparent text-sm text-[#F5F7FF] outline-none placeholder:text-[#4A5575]"
          />
        </div>

        {/* Segmented home tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl mb-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {HOME_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setHomeTab(t.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200"
              style={{
                background: homeTab === t.id ? "rgba(77,163,255,0.15)" : "transparent",
                color: homeTab === t.id ? "#4DA3FF" : "#9BA3B7",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Trips tab content */}
        {homeTab === "trips" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Group trip cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
              {GROUP_TRIPS.filter((t) =>
                search === "" ||
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.destination.toLowerCase().includes(search.toLowerCase())
              ).map((trip, i) => {
                const s = STATUS_LABELS[trip.status];
                return (
                  <motion.button
                    key={trip.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => onSelectGroup(trip.id)}
                    className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                    style={cardStyle}
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Thumbnail */}
                      <div
                        className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden relative"
                        style={{ background: `linear-gradient(135deg,${trip.gradientFrom},${trip.gradientTo})` }}
                      >
                        <img
                          src={trip.image}
                          alt={trip.name}
                          className="w-full h-full object-cover opacity-70"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="text-sm font-bold text-[#F5F7FF] truncate">{trip.name}</h3>
                          {trip.isHost && (
                            <span
                              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={{ background: "rgba(77,163,255,0.15)", color: "#4DA3FF" }}
                            >
                              HOST
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9BA3B7] truncate mb-0.5">{trip.destination}</p>
                        <p className="text-xs text-[#4A5575] mb-2">{trip.dates}</p>

                        {/* Status pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Status */}
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                            {s.label}
                          </span>
                          {/* Unread */}
                          {trip.unread > 0 && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(77,163,255,0.12)", color: "#4DA3FF" }}>
                              {trip.unread} new
                            </span>
                          )}
                          {/* Payments */}
                          {trip.paymentsPending > 0 && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>
                              {trip.paymentsPending} payment{trip.paymentsPending > 1 ? "s" : ""} due
                            </span>
                          )}
                          {/* Docs */}
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={
                              trip.docsComplete === 100
                                ? { background: "rgba(16,185,129,0.12)", color: "#10B981" }
                                : { background: "rgba(245,158,11,0.12)", color: "#F59E0B" }
                            }
                          >
                            Docs {trip.docsComplete}%
                          </span>
                        </div>
                      </div>

                      {/* Right: travelers + chevron */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <ChevronRight size={15} style={{ color: "#4A5575" }} />
                        <div className="flex items-center gap-1">
                          <Users size={10} style={{ color: "#4A5575" }} />
                          <span className="text-[10px] text-[#4A5575]">{trip.travelers}</span>
                        </div>
                        <MemberAvatars members={MEMBERS.slice(0, trip.travelers)} max={3} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Direct Messages */}
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-[#9BA3B7] uppercase tracking-wider mb-3">Direct Messages</h2>
              <div className="space-y-2">
                {DM_CONTACTS.map((dm, i) => (
                  <motion.div
                    key={dm.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer hover:bg-white/[0.03] transition-colors"
                    style={cardStyle}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: dm.color }}>
                        {dm.avatar}
                      </div>
                      {/* Online dot */}
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#03040A] absolute bottom-0 right-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F5F7FF] truncate">{dm.name}</p>
                      <p className="text-xs text-[#4A5575] truncate">{dm.last}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] text-[#4A5575]">{dm.time}</span>
                      {dm.unread > 0 && (
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#4DA3FF" }}>
                          {dm.unread}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* New Group Trip CTA */}
            <button
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-sm font-bold"
              style={{
                background: "linear-gradient(135deg,rgba(77,163,255,0.15),rgba(139,92,255,0.15))",
                border: "1px solid rgba(77,163,255,0.25)",
                color: "#4DA3FF",
              }}
            >
              <Plus size={16} />
              Start New Group Trip
            </button>
          </motion.div>
        )}

        {/* Polished empty states for non-Trips tabs */}
        {homeTab === "chats" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center px-6 py-16 gap-5"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(77,163,255,0.10)", border: "1px solid rgba(77,163,255,0.20)" }}
            >
              <MessageSquare size={26} style={{ color: "#4DA3FF" }} />
            </div>
            <div>
              <p className="text-base font-semibold text-[#F5F7FF] mb-1">No direct messages yet</p>
              <p className="text-sm text-[#9BA3B7] max-w-[260px] leading-relaxed">
                Trip chats unlock when you join or create a group trip. Message individual travelers directly from any group workspace.
              </p>
            </div>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#4DA3FF,#8B5CFF)" }}
            >
              Start a Group Trip
            </button>
            <div
              className="w-full rounded-2xl p-4 mt-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-[10px] uppercase tracking-wider text-[#4A5575] font-semibold mb-3">How group chats work</p>
              {[
                "Create or join a group trip",
                "Invite your travel companions",
                "Chat, share updates, and coordinate plans",
                "Varix sends smart trip reminders",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-2.5 py-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ background: `rgba(77,163,255,${0.3 + i * 0.18})` }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-xs text-[#9BA3B7]">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {homeTab === "hosts" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 px-0 py-4"
          >
            {/* Summary stats — Feature 54 */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Active Trips",      value: "2",  color: "#4DA3FF", bg: "rgba(77,163,255,0.12)"  },
                { label: "Total Travelers",   value: "47", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
                { label: "Trips Hosted",      value: "8",  color: "#8B5CFF", bg: "rgba(139,92,255,0.12)" },
              ].map(({ label, value, color, bg }) => (
                <div
                  key={label}
                  className="rounded-2xl p-3.5 flex flex-col items-center text-center gap-1"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-[10px] text-[#9BA3B7] leading-snug">{label}</p>
                </div>
              ))}
            </div>

            {/* Host Credit Earnings Card — Feature 55 */}
            <div
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(217,119,6,0.12))",
                border: "1px solid rgba(245,158,11,0.35)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.20)" }}
              >
                <CreditCard size={20} style={{ color: "#F59E0B" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold" style={{ color: "#F59E0B" }}>$1,240 earned</p>
                <p className="text-[11px] italic text-[#D97706] leading-snug">Apply to your next trip</p>
              </div>
              <button
                className="px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}
              >
                Redeem
              </button>
            </div>

            {/* Design a New Trip CTA — Feature 56 */}
            <button
              className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(217,119,6,0.06))",
                border: "1px dashed rgba(245,158,11,0.40)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.30)" }}
              >
                <Plus size={22} style={{ color: "#F59E0B" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#F5F7FF] mb-0.5">Design a New Trip</p>
                <p className="text-xs text-[#9BA3B7] leading-snug">
                  Pick a destination, invite your people, and let PIK handle the rest
                </p>
              </div>
              <ChevronRight size={16} style={{ color: "#F59E0B" }} />
            </button>

            {/* Active hosted trips quick list */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#4A5575] font-semibold mb-3">Your Hosted Trips</p>
              <div className="space-y-2">
                {GROUP_TRIPS.filter((t) => t.isHost).map((trip) => {
                  const s = STATUS_LABELS[trip.status];
                  return (
                    <div
                      key={trip.id}
                      className="flex items-center gap-3 p-3.5 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden"
                        style={{ background: `linear-gradient(135deg,${trip.gradientFrom},${trip.gradientTo})` }}
                      >
                        <img src={trip.image} alt={trip.name} className="w-full h-full object-cover opacity-70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#F5F7FF] truncate">{trip.name}</p>
                        <p className="text-[10px] text-[#4A5575] truncate">{trip.destination} · {trip.dates}</p>
                      </div>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {homeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center px-6 py-16 gap-5"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.20)" }}
            >
              <UserPlus size={26} style={{ color: "#10B981" }} />
            </div>
            <div>
              <p className="text-base font-semibold text-[#F5F7FF] mb-1">No pending requests</p>
              <p className="text-sm text-[#9BA3B7] max-w-[260px] leading-relaxed">
                When travelers ask to join your hosted trips, requests will appear here. Start by creating your first hosted trip.
              </p>
            </div>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#10B981,#4DA3FF)" }}
            >
              + Create Host Trip
            </button>

            {/* Sample request card (beta preview) */}
            <div className="w-full mt-2">
              <p className="text-[10px] uppercase tracking-wider text-[#4A5575] font-semibold mb-3 text-left">How requests work</p>
              <div
                className="rounded-2xl p-4 opacity-40 pointer-events-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#D946EF" }}>MR</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#F5F7FF]">Maya R.</p>
                    <p className="text-xs text-[#9BA3B7]">Requesting to join · Kyoto 2026</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>Pending</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-1.5 rounded-lg text-xs text-[#9BA3B7]" style={{ background: "rgba(255,255,255,0.05)" }}>Decline</button>
                  <button className="py-1.5 rounded-lg text-xs text-white" style={{ background: "linear-gradient(135deg,#4DA3FF,#8B5CFF)" }}>Accept</button>
                </div>
              </div>
              <p className="text-[10px] text-[#4A5575] mt-2 text-center">Preview of what a request looks like</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface Props {
  onTabChange?: (t: "explore" | "trips" | "groups" | "memories" | "profile") => void;
}

export function GroupsTab({ onTabChange: _onTabChange }: Props) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "#03040A" }}
    >
      <AnimatePresence mode="wait">
        {selectedGroupId === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 overflow-y-auto"
          >
            <GroupsHome onSelectGroup={(id) => setSelectedGroupId(id)} />
          </motion.div>
        ) : (
          <motion.div
            key={`workspace-${selectedGroupId}`}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col min-h-0"
          >
            <GroupWorkspace
              tripId={selectedGroupId}
              onBack={() => setSelectedGroupId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
