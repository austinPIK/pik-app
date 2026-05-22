import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, MapPin, Globe, Users, User, Sparkles } from "lucide-react";
import { PIKLogo } from "@/components/brand/PIKLogo";
import { ExploreTab } from "@/components/app/tabs/ExploreTab";
import { TripsTab } from "@/components/app/tabs/TripsTab";
import { SocialTab } from "@/components/app/tabs/SocialTab";
import { GroupsTab } from "@/components/app/tabs/GroupsTab";
import { ProfileTab } from "@/components/app/tabs/ProfileTab";
import { VarixSheet } from "@/components/app/VarixSheet";
import { currentUser } from "@/data/mock";

export type TabId = "explore" | "trips" | "social" | "groups" | "profile";

const TABS = [
  { id: "explore" as TabId, label: "Explore",  icon: Compass },
  { id: "trips"   as TabId, label: "Trips",    icon: MapPin  },
  { id: "social"  as TabId, label: "Social",   icon: Globe   },
  { id: "groups"  as TabId, label: "Groups",   icon: Users   },
  { id: "profile" as TabId, label: "Profile",  icon: User    },
];

type TabComp = React.ComponentType<{ onTabChange?: (t: TabId) => void; onVarixOpen?: () => void }>;

const TAB_COMPONENTS: Record<TabId, TabComp> = {
  explore: ExploreTab,
  trips:   TripsTab,
  social:  SocialTab,
  groups:  GroupsTab,
  profile: ProfileTab,
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG        = "#06080F";
const SIDEBAR   = "rgba(4,6,16,0.98)";
const BORDER    = "rgba(255,255,255,0.06)";
const PURPLE    = "#8C87F4";
const STEEL     = "#9DC2F6";   // logo mid-blue (matches PIK letter gradient)
const ICE       = "#D4E8FB";   // logo top highlight
const INACTIVE  = "#3A4870";
// Logo-accurate gradient: metallic icy-blue → steel-blue → purple (matches PIK letters exactly)
// 120deg = top-right to bottom-left, matching the logo's light-sweep direction
const LOGO_GRAD = `linear-gradient(135deg, ${ICE} 0%, ${STEEL} 40%, ${PURPLE} 85%, #B99CF9 100%)`;

export default function AppView() {
  const [activeTab, setActiveTab]   = useState<TabId>("explore");
  const [varixOpen, setVarixOpen]   = useState(false);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: BG }}>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col h-full flex-shrink-0"
        style={{ width: 88, background: SIDEBAR, borderRight: `1px solid ${BORDER}` }}
      >
        {/* PIK logo mark */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <PIKLogo variant="symbol" width={48} />
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col items-center gap-0.5 px-2 py-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon   = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative w-full flex flex-col items-center gap-1 px-1 py-3 rounded-xl transition-all duration-200"
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(196,218,255,0.1) 0%, rgba(138,160,255,0.12) 45%, rgba(123,92,255,0.18) 100%)",
                      boxShadow: "0 0 24px rgba(123,92,255,0.3), 0 0 48px rgba(138,160,255,0.12), inset 0 0 12px rgba(123,92,255,0.08)",
                      outline: "1px solid rgba(138,160,255,0.35)",
                      outlineOffset: -1,
                    }}
                    transition={{ type: "spring", damping: 26, stiffness: 300 }}
                  />
                )}
                <Icon
                  size={19}
                  strokeWidth={active ? 2 : 1.6}
                  className="relative z-10 transition-all duration-200"
                  style={{
                    color: active ? STEEL : INACTIVE,
                    filter: active ? `drop-shadow(0 0 6px ${PURPLE}) drop-shadow(0 0 12px ${STEEL})` : "none",
                  }}
                />
                <span
                  className="relative z-10 text-[8.5px] font-medium leading-tight text-center transition-colors duration-200"
                  style={{ color: active ? STEEL : INACTIVE, maxWidth: 72, wordBreak: "break-word" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Varix sidebar button */}
        <div className="px-2 pb-6">
          <motion.button
            onClick={() => setVarixOpen(true)}
            className="w-full rounded-2xl p-3 flex flex-col items-center gap-2"
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ["0 0 20px rgba(123,92,255,0.15), 0 0 0px rgba(0,212,255,0)", "0 0 28px rgba(123,92,255,0.35), 0 0 40px rgba(0,212,255,0.15)", "0 0 20px rgba(123,92,255,0.15), 0 0 0px rgba(0,212,255,0)"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(135deg, rgba(123,92,255,0.16), rgba(0,212,255,0.08))",
              border: "1px solid rgba(123,92,255,0.4)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: LOGO_GRAD,
                boxShadow: `0 0 20px rgba(123,92,255,0.7), 0 0 40px rgba(138,160,255,0.3)`,
              }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <p className="text-[9px] font-bold text-[#F0F4FF]">Ask Varix</p>
            <p className="text-[8px]" style={{ color: "#8B95B5" }}>AI Concierge</p>
          </motion.button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Desktop top bar */}
        <header
          className="hidden lg:flex items-center justify-between gap-4 px-6 py-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <button
            onClick={() => setVarixOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/[0.05]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${BORDER}`,
              color: "#8B95B5",
            }}
          >
            <Sparkles size={13} style={{ color: PURPLE }} />
            <span>Ask Varix anything…</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "#8B95B5" }}>
              {greeting},{" "}
              <span className="font-semibold" style={{ color: "#F0F4FF" }}>
                {currentUser.name.split(" ")[0]}
              </span>
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("profile")}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, #9DC2F6, #8C87F4)`,
                boxShadow: `0 0 16px rgba(123,92,255,0.5), 0 0 28px rgba(138,160,255,0.2)`,
              }}
            >
              {currentUser.avatar}
            </motion.button>
          </div>
        </header>

        {/* Active tab content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ActiveComponent onTabChange={setActiveTab} onVarixOpen={() => setVarixOpen(true)} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile bottom dock ── */}
      <nav
        className="lg:hidden fixed z-40"
        style={{
          left: 10,
          right: 10,
          bottom: "max(env(safe-area-inset-bottom), 6px)",
          background: "rgba(4,6,16,0.95)",
          backdropFilter: "saturate(180%) blur(40px)",
          WebkitBackdropFilter: "saturate(180%) blur(40px)",
          border: `1px solid ${BORDER}`,
          borderRadius: 26,
          boxShadow: "0 8px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center px-2 py-1.5">
          {TABS.map((tab) => {
            const Icon   = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-[3px] rounded-2xl relative transition-all duration-200"
                style={{ padding: "5px 2px" }}
              >
                {active && (
                  <motion.div
                    layoutId="dock-pill"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(196,218,255,0.12) 0%, rgba(138,160,255,0.15) 45%, rgba(123,92,255,0.22) 100%)",
                      boxShadow: "0 0 20px rgba(123,92,255,0.35), inset 0 0 12px rgba(138,160,255,0.12)",
                      outline: "1px solid rgba(138,160,255,0.3)",
                      outlineOffset: -1,
                    }}
                    transition={{ type: "spring", damping: 28, stiffness: 340 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon
                    size={19}
                    strokeWidth={active ? 2 : 1.5}
                    style={{
                      color: active ? STEEL : INACTIVE,
                      filter: active ? `drop-shadow(0 0 7px ${PURPLE}) drop-shadow(0 0 14px ${STEEL})` : "none",
                      transition: "color 0.2s, filter 0.2s",
                    }}
                  />
                </div>
                <span
                  className="relative z-10 text-[7.5px] font-medium whitespace-nowrap transition-colors duration-200"
                  style={{ color: active ? STEEL : INACTIVE }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Floating Varix button ── */}
      <motion.button
        className="lg:hidden fixed z-50 flex flex-col items-center justify-center gap-0.5"
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          right: 16,
          bottom: "calc(max(env(safe-area-inset-bottom), 6px) + 102px)",
          background: LOGO_GRAD,
        }}
        onClick={() => setVarixOpen(true)}
        whileTap={{ scale: 0.88 }}
        animate={{
          boxShadow: [
            "0 0 24px rgba(123,92,255,0.65), 0 0 48px rgba(123,92,255,0.3), 0 0 80px rgba(138,160,255,0.15)",
            "0 0 40px rgba(123,92,255,0.9), 0 0 72px rgba(138,160,255,0.5), 0 0 100px rgba(138,160,255,0.25)",
            "0 0 28px rgba(123,92,255,0.7), 0 0 56px rgba(123,92,255,0.35), 0 0 88px rgba(138,160,255,0.18)",
            "0 0 40px rgba(123,92,255,0.9), 0 0 72px rgba(138,160,255,0.5), 0 0 100px rgba(138,160,255,0.25)",
            "0 0 24px rgba(123,92,255,0.65), 0 0 48px rgba(123,92,255,0.3), 0 0 80px rgba(138,160,255,0.15)",
          ],
          scale: [1, 1.03, 1, 1.03, 1],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: [0, 15, -8, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={22} className="text-white" />
        </motion.div>
        <span className="text-[8px] font-bold text-white/90 leading-none">Varix</span>
      </motion.button>

      {/* ── Varix sheet modal ── */}
      <AnimatePresence>
        {varixOpen && (
          <VarixSheet
            onClose={() => setVarixOpen(false)}
            onTabChange={(t) => { setActiveTab(t); setVarixOpen(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
