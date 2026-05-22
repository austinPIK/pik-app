import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Bot } from "lucide-react";
import { GlassPanel } from "../shared/GlassPanel";
import { TierBadge } from "../shared/TierBadge";
import { chatMessages } from "@/data/mock";
import type { ChatMessage } from "@/data/mock";

const QUICK_CHIPS = [
  { label: "Plan a trip", color: "#4DA3FF", tier: null },
  { label: "Find hotels", color: "#4DA3FF", tier: null },
  { label: "Surprise me", color: "#8B5CFF", tier: null },
  { label: "Golf trips", color: "#D946EF", tier: "elite" as const },
  { label: "Concierge", color: "#D946EF", tier: "elite" as const },
];

const BALI_IMAGE = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=70";

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-2"
    >
      {/* Avatar */}
      <div
        className="w-[22px] h-[22px] rounded-full shrink-0 mt-0.5"
        style={{
          background: "radial-gradient(circle at 35% 35%, #4DA3FF, #8B5CFF, #D946EF)",
          boxShadow: "0 0 10px rgba(139,92,255,0.4)",
        }}
      />
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-[4px]"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#4A5875" }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function TripCardInner({ card }: { card: NonNullable<ChatMessage["tripCard"]> }) {
  const isBali = card.destination.toLowerCase().includes("bali");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-2xl overflow-hidden mt-1"
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background: `linear-gradient(160deg, ${card.gradientFrom}cc, ${card.gradientTo})`,
      }}
    >
      {/* Destination image strip */}
      {isBali && (
        <div className="w-full h-[90px] overflow-hidden">
          <img
            src={BALI_IMAGE}
            alt={card.destination}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.85) saturate(1.1)" }}
          />
        </div>
      )}
      <div className="p-4 pt-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-bold text-sm leading-tight">{card.destination}</h3>
            <p className="text-white/50 text-[11px] font-light mt-0.5">{card.hotel}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold text-2xl leading-none">${card.price.toLocaleString()}</p>
            <p className="text-white/50 text-[11px] mt-0.5">{card.nights} nights</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-xl text-white/80 text-[11px] font-semibold transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            View Details
          </button>
          <button
            className="flex-1 py-2 rounded-xl text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
              border: "1px solid rgba(77,163,255,0.3)",
            }}
          >
            <span>Book with Varix</span>
            <TierBadge tier="explorer" size="sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface MessageGroupProps {
  messages: ChatMessage[];
  showAvatar: boolean;
}

function MessageGroup({ messages, showAvatar }: MessageGroupProps) {
  const isUser = messages[0].role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {/* Varix avatar — only on first message of group */}
      {!isUser && (
        <div className="flex flex-col items-center justify-end shrink-0">
          {showAvatar ? (
            <div
              className="w-[22px] h-[22px] rounded-full shrink-0"
              style={{
                background: "radial-gradient(circle at 35% 35%, #4DA3FF, #8B5CFF, #D946EF)",
                boxShadow: "0 0 10px rgba(139,92,255,0.4)",
              }}
            />
          ) : (
            <div className="w-[22px]" />
          )}
        </div>
      )}

      <div className={`flex flex-col gap-1.5 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-1`}>
            <div
              className={`px-4 py-2.5 text-[13.5px] leading-relaxed ${
                isUser ? "rounded-2xl rounded-br-[4px]" : "rounded-2xl rounded-bl-[4px]"
              }`}
              style={
                isUser
                  ? {
                      background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "#E8EEFF",
                    }
              }
            >
              {msg.content}
            </div>

            {/* Trip card below the message bubble */}
            {msg.tripCard && <TripCardInner card={msg.tripCard} />}

            {/* Timestamp — only on last message of the group */}
            {idx === messages.length - 1 && (
              <span
                className="text-[9px] px-1"
                style={{ color: "#384060" }}
              >
                {msg.time}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Group consecutive messages by the same sender */
function groupMessages(msgs: ChatMessage[]): ChatMessage[][] {
  const groups: ChatMessage[][] = [];
  let current: ChatMessage[] = [];
  for (const msg of msgs) {
    if (current.length === 0 || current[0].role === msg.role) {
      current.push(msg);
    } else {
      groups.push(current);
      current = [msg];
    }
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

export function VarixTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend() {
    const text = isListening ? "Voice input" : input.trim();
    if (!text && !isListening) return;
    if (isListening) setIsListening(false);

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: "user",
      content: text || input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const varixMsg: ChatMessage = {
        id: `v${Date.now()}`,
        role: "varix",
        content:
          "I'm curating the perfect options for you. Give me just a moment to scan the best availability and prices across 2,000+ destinations...",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, varixMsg]);
    }, 1800);
  }

  function handleMicToggle() {
    setIsListening((prev) => !prev);
  }

  function handleChipClick(label: string) {
    setInput(label);
  }

  const messageGroups = groupMessages(messages);
  const lastGroup = messageGroups[messageGroups.length - 1];
  const showTyping = isTyping && lastGroup?.[0]?.role === "user";
  const canSend = input.trim().length > 0 || isListening;

  return (
    <div
      className="flex flex-col h-full lg:pb-4"
      style={{
        background: "#03040A",
        paddingBottom: "max(calc(env(safe-area-inset-bottom) + 68px), 76px)",
      }}
    >
      {/* ── Cinematic Orb Header ─────────────────────────────────── */}
      <div className="flex flex-col items-center pt-6 pb-3 px-4 shrink-0">
        <div className="relative mb-3">
          {/* Outer ambient glow ring */}
          <motion.div
            animate={{ scale: [1.0, 1.18, 1.0], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-10px] rounded-full"
            style={{
              background: "radial-gradient(circle, #8B5CFF55, transparent 70%)",
            }}
          />
          {/* Ping ring */}
          <motion.div
            animate={{ scale: [1.1, 1.35, 1.1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, #8B5CFF, transparent)" }}
          />
          {/* Main orb */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.88, 1, 0.88] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[72px] h-[72px] rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, #4DA3FF, #8B5CFF, #D946EF)",
              boxShadow:
                "0 0 50px rgba(139,92,255,0.55), 0 0 100px rgba(77,163,255,0.18), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          />
        </div>
        <h1
          className="text-xl font-semibold text-[#F5F7FF]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Varix
        </h1>
        <p
          className="text-[11px] text-[#4A5875]"
          style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          AI Travel Concierge
        </p>
      </div>

      {/* ── Message list ─────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messageGroups.map((group) => (
              <motion.div
                key={group[0].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <MessageGroup messages={group} showAvatar={group[0].role === "varix"} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {showTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </div>
        <div ref={bottomRef} />
      </div>

      {/* ── Floating input dock ──────────────────────────────────── */}
      <div className="shrink-0 px-4 pt-1 flex flex-col gap-2">
        {/* Quick chips row */}
        <div className="relative">
          <div
            className="flex gap-2 overflow-x-auto pb-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip.label)}
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium rounded-full transition-all active:scale-95"
                style={{
                  padding: "6px 12px",
                  background: `${chip.color}12`,
                  border: `1px solid ${chip.color}28`,
                  color: chip.color,
                }}
              >
                {chip.label}
                {chip.tier && (
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: chip.color, opacity: 0.7 }}
                  />
                )}
              </button>
            ))}
          </div>
          {/* Right fade */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-8"
            style={{
              background: "linear-gradient(to right, transparent, #03040A)",
            }}
          />
        </div>

        {/* Input composer */}
        <GlassPanel className="flex items-center gap-2.5 px-4 rounded-2xl" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
          {/* Left icon */}
          <Bot className="w-4 h-4 shrink-0" style={{ color: "#4A5875" }} />

          {/* Text input */}
          <input
            value={isListening ? "" : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSend && handleSend()}
            placeholder={isListening ? "Listening..." : "Ask Varix to plan your adventure..."}
            className="flex-1 bg-transparent text-[#F5F7FF] text-[13.5px] outline-none"
            style={{
              caretColor: "#4DA3FF",
              color: isListening ? "#4A5875" : "#F5F7FF",
            }}
          />

          {/* Mic button */}
          <motion.button
            onClick={handleMicToggle}
            animate={isListening ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={isListening ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
            className="transition-colors shrink-0"
            style={{
              color: isListening ? "#D946EF" : "#4A5875",
              filter: isListening ? "drop-shadow(0 0 6px #D946EF88)" : "none",
            }}
          >
            <Mic className="w-[18px] h-[18px]" />
          </motion.button>

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={!canSend}
            whileTap={canSend ? { scale: 0.92 } : {}}
            className="shrink-0 flex items-center justify-center rounded-xl transition-all"
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
              opacity: canSend ? 1 : 0.3,
              boxShadow: canSend ? "0 0 16px rgba(77,163,255,0.35)" : "none",
            }}
          >
            <Send className="w-[15px] h-[15px] text-white" />
          </motion.button>
        </GlassPanel>
      </div>
    </div>
  );
}
