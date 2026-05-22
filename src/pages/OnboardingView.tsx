import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  Bot,
  MapPin,
  Users,
  ShieldCheck,
  Camera,
  LucideIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Feature {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    icon: Compass,
    color: "#4DA3FF",
    title: "Explore",
    description:
      "Discover curated destinations, trending escapes, and real completed trips from the PIK community. Browse by style, budget, and adventure type.",
  },
  {
    icon: Bot,
    color: "#8B5CFF",
    title: "Varix+ AI Concierge",
    description:
      "Your personal AI travel concierge. Tell Varix your budget, dates, group size, and travel style — then let it help design your perfect itinerary.",
  },
  {
    icon: MapPin,
    color: "#D946EF",
    title: "Trips",
    description:
      "Organize upcoming trips, view itineraries, manage travel documents, track bookings, and prepare your gear — all in one place.",
  },
  {
    icon: Users,
    color: "#10B981",
    title: "Groups",
    description:
      "Coordinate hosted trips, group chats, payment splitting, traveler documents, and shared itinerary plans in a single travel workspace.",
  },
  {
    icon: ShieldCheck,
    color: "#F59E0B",
    title: "Trip Cards",
    description:
      "Capture proof-based memories from completed trips with photos, videos, verified stays, and cinematic itinerary recaps.",
  },
  {
    icon: Camera,
    color: "#D946EF",
    title: "Memories",
    description:
      "Preserve your journey with private capsules, shared group memories, completed adventure cards, and AI-generated trip recaps.",
  },
];

// ─── Varix Tier Row ───────────────────────────────────────────────────────────

interface TierRowProps {
  tier: string;
  description: string;
  highlighted?: boolean;
}

function TierRow({ tier, description, highlighted = false }: TierRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "12px",
        background: highlighted ? "rgba(77,163,255,0.08)" : "transparent",
        border: highlighted
          ? "1px solid rgba(77,163,255,0.2)"
          : "1px solid transparent",
      }}
    >
      <div style={{ flex: 1 }}>
        <span
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 600,
            color: highlighted ? "#4DA3FF" : "#9BA3B7",
            marginBottom: "2px",
          }}
        >
          {tier}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: highlighted ? "#F5F7FF" : "#4A5575",
            lineHeight: "1.5",
          }}
        >
          {description}
        </span>
      </div>
      {highlighted && (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#4DA3FF",
            background: "rgba(77,163,255,0.15)",
            border: "1px solid rgba(77,163,255,0.3)",
            borderRadius: "20px",
            padding: "2px 10px",
            whiteSpace: "nowrap",
          }}
        >
          INCLUDED
        </span>
      )}
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const IconComponent = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: `${feature.color}26`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IconComponent size={20} color={feature.color} />
      </div>

      {/* Title */}
      <span
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#F5F7FF",
          letterSpacing: "-0.01em",
        }}
      >
        {feature.title}
      </span>

      {/* Description */}
      <p
        style={{
          fontSize: "13px",
          color: "#9BA3B7",
          lineHeight: "1.6",
          margin: 0,
        }}
      >
        {feature.description}
      </p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingView() {
  const navigate = useNavigate();

  const goToApp = () => navigate("/app");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#03040A",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowX: "hidden",
        color: "#F5F7FF",
      }}
    >
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-200px",
            left: "-200px",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(77,163,255,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "-200px",
            right: "-200px",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,255,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            maxWidth: "640px",
          }}
        >
          {/* Logo badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
              boxShadow: "0 0 40px rgba(77,163,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            PIK
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            style={{
              margin: 0,
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 700,
              color: "#F5F7FF",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Welcome to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4DA3FF, #8B5CFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PIK
            </span>{" "}
            Destinations
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#9BA3B7",
              lineHeight: "1.65",
              maxWidth: "480px",
            }}
          >
            Your AI-powered travel concierge for discovering, designing,
            coordinating, booking, and preserving unforgettable trips.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button
              onClick={goToApp}
              style={{
                height: "52px",
                padding: "0 32px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #4DA3FF, #3B88E0)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 24px rgba(77,163,255,0.35)",
                transition: "opacity 0.2s, transform 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              Start Exploring
            </button>

            <button
              onClick={goToApp}
              style={{
                height: "52px",
                padding: "0 32px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                background: "rgba(255,255,255,0.06)",
                color: "#F5F7FF",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                backdropFilter: "blur(12px)",
                transition: "background 0.2s, transform 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.10)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              Let Varix Build My First Trip
            </button>
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#4A5575",
              letterSpacing: "0.01em",
            }}
          >
            No account required to explore. Sign up free to save trips and
            access Varix.
          </motion.p>
        </div>
      </section>

      {/* ─── Feature Walkthrough ──────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: "1080px", margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 600,
              color: "#F5F7FF",
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need to travel better
          </h2>
        </motion.div>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "16px",
          }}
        >
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* ─── Varix+ Section ───────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            maxWidth: "672px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "28px",
            padding: "40px 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gradient accent border glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, #4DA3FF, #8B5CFF, #D946EF)",
              borderRadius: "28px 28px 0 0",
            }}
          />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <Bot size={20} color="#8B5CFF" />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#F5F7FF",
                  letterSpacing: "-0.02em",
                }}
              >
                Varix+ — Your AI Travel Concierge
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#9BA3B7",
              }}
            >
              Choose the level of intelligence that fits your travel style.
            </p>
          </div>

          {/* Tier rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
            <TierRow
              tier="Starter"
              description="Basic destination inspiration · Limited planning prompts"
            />
            <TierRow
              tier="Explorer ✓"
              description="Varix+ trip planning · AI itinerary builder · Booking support through integrated partners · Group planning"
              highlighted
            />
            <TierRow
              tier="Elite"
              description="Advanced personalization · Golf intelligence · Host trip tools · Priority optimization"
            />
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={goToApp}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #4DA3FF, #3B88E0)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 20px rgba(77,163,255,0.3)",
                transition: "opacity 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              Start with Varix +
            </button>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#4A5575",
                lineHeight: "1.5",
              }}
            >
              Booking availability depends on supported partners, destination
              coverage, and supplier inventory.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ─── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(20px, 3.5vw, 32px)",
              fontWeight: 700,
              color: "#F5F7FF",
              letterSpacing: "-0.03em",
            }}
          >
            Ready to plan your next adventure?
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#9BA3B7",
            }}
          >
            PIK is free to start. No credit card required.
          </p>
          <button
            onClick={goToApp}
            style={{
              marginTop: "8px",
              height: "54px",
              padding: "0 40px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #4DA3FF, #3B88E0)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 28px rgba(77,163,255,0.4)",
              transition: "opacity 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            Create Your First Trip
          </button>
        </motion.div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: "32px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#9BA3B7",
            fontWeight: 500,
          }}
        >
          PIK Technologies · PIK Destinations · 2026
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#4A5575",
            fontStyle: "italic",
          }}
        >
          Where every journey begins with intelligence.
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginTop: "4px",
          }}
        >
          {["Privacy Policy", "Terms", "Support"].map((link) => (
            <button
              key={link}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                color: "#4A5575",
                padding: 0,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#9BA3B7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#4A5575";
              }}
            >
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
