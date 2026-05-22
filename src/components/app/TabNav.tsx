import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Compass, MapPin, Mountain, Users, Camera, User,
  Wallet, Package, Map, Star, LayoutGrid, ChevronUp, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type TabId =
  | "varix" | "explore" | "trips" | "adventures" | "host"
  | "groups" | "memories" | "profile" | "wallet" | "gear"
  | "map" | "pricing";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  color: string;
}

const TABS: Tab[] = [
  { id: "varix", label: "Varix", icon: Bot, color: "#8B5CFF" },
  { id: "explore", label: "Explore", icon: Compass, color: "#4DA3FF" },
  { id: "trips", label: "Trips", icon: MapPin, color: "#4DA3FF" },
  { id: "adventures", label: "Adventures", icon: Mountain, color: "#10B981" },
  { id: "host", label: "Host", icon: Star, color: "#F59E0B" },
  { id: "groups", label: "Groups", icon: Users, color: "#4DA3FF" },
  { id: "memories", label: "Memories", icon: Camera, color: "#D946EF" },
  { id: "profile", label: "Profile", icon: User, color: "#4DA3FF" },
  { id: "wallet", label: "Wallet", icon: Wallet, color: "#8B5CFF" },
  { id: "gear", label: "Gear", icon: Package, color: "#F59E0B" },
  { id: "map", label: "Map", icon: Map, color: "#10B981" },
  { id: "pricing", label: "PIK Pass", icon: DollarSign, color: "#D946EF" },
];

const PRIMARY_TABS: TabId[] = ["varix", "explore", "trips", "adventures", "groups"];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const [showMore, setShowMore] = useState(false);

  const isInPrimary = PRIMARY_TABS.includes(activeTab);
  const displayTabs = showMore ? TABS : TABS.filter((t) => PRIMARY_TABS.includes(t.id));

  return (
    <>
      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="border-t border-white/10 grid grid-cols-4 gap-0"
              style={{ background: "rgba(7,10,20,0.97)", backdropFilter: "blur(24px)" }}
            >
              {TABS.filter((t) => !PRIMARY_TABS.includes(t.id)).map((tab) => (
                <MobileTabItem
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onPress={() => { onTabChange(tab.id); setShowMore(false); }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="border-t border-white/10 grid grid-cols-6 gap-0 pb-safe"
          style={{ background: "rgba(7,10,20,0.97)", backdropFilter: "blur(24px)" }}
        >
          {TABS.filter((t) => PRIMARY_TABS.includes(t.id)).map((tab) => (
            <MobileTabItem
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onPress={() => { onTabChange(tab.id); setShowMore(false); }}
            />
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center py-3 gap-1 transition-colors",
              showMore ? "text-[#4DA3FF]" : "text-[#4A5575]"
            )}
          >
            <motion.div animate={{ rotate: showMore ? 180 : 0 }}>
              <LayoutGrid className="w-5 h-5" />
            </motion.div>
            <span className="text-[9px] font-medium">More</span>
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-20 xl:w-56 shrink-0 fixed left-0 top-0 bottom-0 z-40 border-r border-white/10"
        style={{ background: "rgba(7,10,20,0.97)", backdropFilter: "blur(24px)" }}
      >
        {/* Logo */}
        <div className="px-4 py-6 mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white"
              style={{ background: "linear-gradient(135deg, #4DA3FF, #8B5CFF, #D946EF)" }}
            >
              P
            </div>
            <span className="hidden xl:block text-[#F5F7FF] font-bold text-lg tracking-tight">PIK</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {TABS.map((tab) => (
            <DesktopTabItem
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onPress={() => onTabChange(tab.id)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function MobileTabItem({
  tab,
  isActive,
  onPress,
}: {
  tab: Tab;
  isActive: boolean;
  onPress: () => void;
}) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onPress}
      className="relative flex flex-col items-center justify-center py-3 gap-1 transition-colors"
    >
      {isActive && (
        <motion.div
          layoutId="mobile-tab-indicator"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
          style={{ background: tab.color }}
        />
      )}
      <Icon
        className="w-5 h-5 transition-colors"
        style={{ color: isActive ? tab.color : "#4A5575" }}
      />
      <span
        className="text-[9px] font-medium transition-colors"
        style={{ color: isActive ? tab.color : "#4A5575" }}
      >
        {tab.label}
      </span>
      {isActive && (
        <motion.div
          className="w-1 h-1 rounded-full"
          style={{ background: tab.color }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </button>
  );
}

function DesktopTabItem({
  tab,
  isActive,
  onPress,
}: {
  tab: Tab;
  isActive: boolean;
  onPress: () => void;
}) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onPress}
      className={cn(
        "relative flex items-center gap-3 w-full rounded-2xl px-3 py-2.5 transition-all",
        isActive ? "bg-white/10" : "hover:bg-white/5"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="desktop-tab-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
          style={{ background: tab.color }}
        />
      )}
      <Icon
        className="w-5 h-5 shrink-0"
        style={{ color: isActive ? tab.color : "#4A5575" }}
      />
      <span
        className="hidden xl:block text-sm font-medium transition-colors"
        style={{ color: isActive ? "#F5F7FF" : "#4A5575" }}
      >
        {tab.label}
      </span>
    </button>
  );
}
