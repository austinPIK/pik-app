import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, MapPin, Camera, Lock, Check, Bell,
  Users, Tag,
} from "lucide-react";
import { CountryPickerField, DestinationPickerField } from "./LocationPickers";

// ─── Types ────────────────────────────────────────────────────────────────────
export type CapsuleStatus = "locked" | "ready" | "opened" | "draft";
export type CapsuleTheme =
  | "midnightGold"
  | "auroraViolet"
  | "coastalBlue"
  | "desertEmber"
  | "alpineMist";

export interface PikCapsule {
  id: string;
  title: string;
  destination: string;
  country?: string;
  associatedTripId?: string;
  unlockDate: string;
  unlockTime?: string;
  caption?: string;
  privacy: "private" | "friends" | "tripGroup" | "publicAfterUnlock";
  status: CapsuleStatus;
  media: {
    id: string;
    type: "image" | "video" | "voice" | "note";
    url?: string;
    text?: string;
  }[];
  people?: string[];
  tags?: string[];
  theme: CapsuleTheme;
  notifyOnUnlock: boolean;
  allowContributions: boolean;
  hideUntilUnlock: boolean;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD = "#D4A847";
const GOLD_GRAD =
  "linear-gradient(135deg, #F0C040 0%, #D4A030 50%, #B8880A 100%)";
const LOGO_GRAD =
  "linear-gradient(135deg, #D4E8FB 0%, #9DC2F6 40%, #8C87F4 85%, #B99CF9 100%)";
const EASE = [0.22, 1, 0.36, 1] as const;

const CAPSULE_THEMES: Record<
  CapsuleTheme,
  { label: string; bg: string; accent: string; glow: string }
> = {
  midnightGold: {
    label: "Midnight Gold",
    bg: "linear-gradient(135deg,#080B14,#1a1030)",
    accent: "#D4A847",
    glow: "rgba(212,168,71,0.4)",
  },
  auroraViolet: {
    label: "Aurora Violet",
    bg: "linear-gradient(135deg,#0d0520,#1a0a40)",
    accent: "#9B6DFF",
    glow: "rgba(155,109,255,0.4)",
  },
  coastalBlue: {
    label: "Coastal Blue",
    bg: "linear-gradient(135deg,#041428,#0a2a4a)",
    accent: "#4DA3FF",
    glow: "rgba(77,163,255,0.4)",
  },
  desertEmber: {
    label: "Desert Ember",
    bg: "linear-gradient(135deg,#1a0a05,#2a1508)",
    accent: "#FF8A65",
    glow: "rgba(255,138,101,0.4)",
  },
  alpineMist: {
    label: "Alpine Mist",
    bg: "linear-gradient(135deg,#0d1420,#1a2535)",
    accent: "#A8C0D0",
    glow: "rgba(168,192,208,0.4)",
  },
};

const STATUS_CONFIG: Record<
  CapsuleStatus,
  { label: string; color: string; bg: string }
> = {
  locked: {
    label: "LOCKED",
    color: "#9DC2F6",
    bg: "rgba(138,160,255,0.12)",
  },
  ready: {
    label: "READY TO OPEN",
    color: "#6BFFAA",
    bg: "rgba(107,255,170,0.12)",
  },
  opened: {
    label: "OPENED",
    color: "rgba(245,247,255,0.4)",
    bg: "rgba(255,255,255,0.06)",
  },
  draft: {
    label: "DRAFT",
    color: "#9BA3B7",
    bg: "rgba(155,163,183,0.10)",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function calcDaysUntil(dateStr: string): number {
  if (!dateStr) return 0;
  return Math.max(
    0,
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  );
}

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── FormState ────────────────────────────────────────────────────────────────
interface CapsuleFormState {
  title: string;
  destination: string;
  country: string;
  unlockDate: string;
  unlockTime: string;
  caption: string;
  privacy: PikCapsule["privacy"];
  notifyOnUnlock: boolean;
  allowContributions: boolean;
  hideUntilUnlock: boolean;
  theme: CapsuleTheme;
  media: PikCapsule["media"];
  noteText: string;
  people: string;
  tags: string;
}

function createEmptyForm(): CapsuleFormState {
  return {
    title: "",
    destination: "",
    country: "",
    unlockDate: "",
    unlockTime: "",
    caption: "",
    privacy: "private",
    notifyOnUnlock: true,
    allowContributions: false,
    hideUntilUnlock: true,
    theme: "midnightGold",
    media: Array(4)
      .fill(null)
      .map(() => ({ id: uid(), type: "image" as const })),
    noteText: "",
    people: "",
    tags: "",
  };
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  padding: "12px 14px",
  color: "#F5F7FF",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(245,247,255,0.5)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  display: "block",
  marginBottom: 8,
};

// ─── FieldGroup ───────────────────────────────────────────────────────────────
function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

// ─── AnimatedToggle ───────────────────────────────────────────────────────────
function AnimatedToggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#F5F7FF",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {label}
        </p>
        {description && (
          <p
            style={{
              fontSize: 11,
              color: "rgba(245,247,255,0.4)",
              margin: "3px 0 0",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        )}
      </div>
      <div
        onClick={onChange}
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          background: value
            ? "linear-gradient(90deg,#9DC2F6,#8C87F4)"
            : "rgba(255,255,255,0.1)",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s ease",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            position: "absolute",
            top: 3,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

// ─── CapsulePreviewCard ───────────────────────────────────────────────────────
function CapsulePreviewCard({ form }: { form: CapsuleFormState }) {
  const thm = CAPSULE_THEMES[form.theme];
  const daysUntil = calcDaysUntil(form.unlockDate);
  const isReady = form.unlockDate !== "" && daysUntil <= 0;
  const statusCfg = isReady ? STATUS_CONFIG.ready : STATUS_CONFIG.locked;
  const coverUrl = form.media.find((m) => m.url)?.url;

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${thm.accent}30`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Cover area */}
      <div
        style={{
          height: 240,
          background: thm.bg,
          position: "relative",
          overflow: "hidden",
          boxShadow: `inset 0 0 60px ${thm.glow}`,
        }}
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
          }}
        />

        {/* PIK CAPSULE badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${thm.accent}40`,
            borderRadius: 999,
            padding: "3px 9px",
          }}
        >
          <span
            style={{
              fontSize: 7,
              fontWeight: 800,
              color: thm.accent,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            PIK CAPSULE
          </span>
        </div>

        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: statusCfg.bg,
            backdropFilter: "blur(8px)",
            border: `1px solid ${statusCfg.color}40`,
            borderRadius: 999,
            padding: "3px 9px",
          }}
        >
          <span
            style={{
              fontSize: 7,
              fontWeight: 800,
              color: statusCfg.color,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Center content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            marginTop: isReady ? 0 : -8,
          }}
        >
          <Lock
            size={40}
            style={{
              color: thm.accent,
              opacity: 0.85,
              filter: `drop-shadow(0 0 12px ${thm.glow})`,
            }}
          />
          {!isReady && form.unlockDate ? (
            <>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#F5F7FF",
                  margin: "8px 0 0",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                {daysUntil}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(245,247,255,0.5)",
                  margin: "4px 0 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                days until unlock
              </p>
            </>
          ) : null}
        </div>

        {/* Bottom overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "14px 16px 14px",
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#F5F7FF",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {form.title || (
              <span style={{ opacity: 0.3 }}>Capsule title</span>
            )}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "rgba(245,247,255,0.5)",
              margin: "4px 0 0",
            }}
          >
            {form.destination || (
              <span style={{ opacity: 0.5 }}>Destination</span>
            )}
            {form.unlockDate && (
              <>
                {" · "}
                <span style={{ color: thm.accent }}>
                  {formatDate(form.unlockDate)}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 0 – Basics ──────────────────────────────────────────────────────────
function StepBasics({
  form,
  setForm,
  errors,
}: {
  form: CapsuleFormState;
  setForm: React.Dispatch<React.SetStateAction<CapsuleFormState>>;
  errors: Record<string, string>;
}) {
  const today = new Date().toISOString().split("T")[0];
  const daysUntil = calcDaysUntil(form.unlockDate);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <FieldGroup label="Capsule Title *">
        <input
          style={INPUT_STYLE}
          placeholder="e.g. Summer in Kyoto"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        {errors.title && (
          <p style={{ fontSize: 11, color: "#FF6B6B", margin: 0 }}>
            {errors.title}
          </p>
        )}
      </FieldGroup>

      {/* Destination */}
      <FieldGroup label="Destination *">
        <DestinationPickerField
          value={form.destination}
          selectedCountry={form.country}
          onChange={(v) => setForm((f) => ({ ...f, destination: v }))}
          onCountryAutoFill={(c) => setForm((f) => f.country ? f : { ...f, country: c })}
          hasError={!!errors.destination}
        />
        {errors.destination && (
          <p style={{ fontSize: 11, color: "#FF6B6B", margin: 0 }}>
            {errors.destination}
          </p>
        )}
      </FieldGroup>

      {/* Country */}
      <FieldGroup label="Country">
        <CountryPickerField
          value={form.country}
          onChange={(v) => setForm((f) => ({ ...f, country: v }))}
        />
      </FieldGroup>

      {/* Unlock Date */}
      <FieldGroup label="Unlock Date *">
        <input
          type="date"
          style={{ ...INPUT_STYLE, colorScheme: "dark" }}
          min={today}
          value={form.unlockDate}
          onChange={(e) =>
            setForm((f) => ({ ...f, unlockDate: e.target.value }))
          }
        />
        {errors.unlockDate && (
          <p style={{ fontSize: 11, color: "#FF6B6B", margin: 0 }}>
            {errors.unlockDate}
          </p>
        )}
        {form.unlockDate && daysUntil > 0 && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(107,255,170,0.1)",
              border: "1px solid rgba(107,255,170,0.25)",
              borderRadius: 999,
              padding: "5px 14px",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "#6BFFAA" }}
            >
              {daysUntil} day{daysUntil !== 1 ? "s" : ""} until reveal
            </span>
          </div>
        )}
      </FieldGroup>

      {/* Caption */}
      <FieldGroup label="Caption">
        <div style={{ position: "relative" }}>
          <textarea
            style={{
              ...INPUT_STYLE,
              resize: "none",
              height: 88,
              lineHeight: 1.6,
            }}
            placeholder="A message to your future self…"
            maxLength={120}
            value={form.caption}
            onChange={(e) =>
              setForm((f) => ({ ...f, caption: e.target.value }))
            }
          />
          <p
            style={{
              position: "absolute",
              bottom: 10,
              right: 12,
              fontSize: 10,
              color: "rgba(245,247,255,0.28)",
              margin: 0,
            }}
          >
            {form.caption.length}/120
          </p>
        </div>
      </FieldGroup>

      {/* Privacy */}
      <FieldGroup label="Privacy">
        <select
          style={{
            ...INPUT_STYLE,
            appearance: "none" as const,
            cursor: "pointer",
          }}
          value={form.privacy}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              privacy: e.target.value as PikCapsule["privacy"],
            }))
          }
        >
          <option value="private">Private</option>
          <option value="friends">Friends</option>
          <option value="tripGroup">Trip Group</option>
          <option value="publicAfterUnlock">Public After Unlock</option>
        </select>
      </FieldGroup>
    </div>
  );
}

// ─── Step 1 – Contents ────────────────────────────────────────────────────────
function StepContents({
  form,
  setForm,
}: {
  form: CapsuleFormState;
  setForm: React.Dispatch<React.SetStateAction<CapsuleFormState>>;
}) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const slots = [...form.media];
  while (slots.length < 4) {
    slots.push({ id: uid(), type: "image" });
  }

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setForm((f) => {
        const newMedia = [...f.media];
        while (newMedia.length <= idx) {
          newMedia.push({ id: uid(), type: "image" });
        }
        newMedia[idx] = { ...newMedia[idx], url };
        return { ...f, media: newMedia };
      });
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = (idx: number) => {
    setForm((f) => {
      const newMedia = [...f.media];
      if (newMedia[idx]) {
        newMedia[idx] = { ...newMedia[idx], url: undefined };
      }
      return { ...f, media: newMedia };
    });
    if (fileInputRefs.current[idx]) {
      fileInputRefs.current[idx]!.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={LABEL_STYLE}>What's inside?</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {slots.map((slot, idx) => {
            const filled = !!slot.url;
            return (
              <div
                key={slot.id}
                style={{
                  aspectRatio: "1",
                  borderRadius: 14,
                  overflow: "hidden",
                  position: "relative",
                  background: "rgba(255,255,255,0.03)",
                  border: filled
                    ? "none"
                    : "1.5px dashed rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 6,
                }}
                onClick={() => !filled && fileInputRefs.current[idx]?.click()}
              >
                <input
                  ref={(el) => {
                    fileInputRefs.current[idx] = el;
                  }}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e, idx)}
                />
                {filled ? (
                  <>
                    <img
                      src={slot.url}
                      alt=""
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(idx);
                      }}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.7)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                      }}
                    >
                      <X size={12} style={{ color: "#fff" }} />
                    </button>
                  </>
                ) : (
                  <>
                    <Camera
                      size={20}
                      style={{ color: "rgba(245,247,255,0.2)" }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        color: "rgba(245,247,255,0.3)",
                        fontWeight: 600,
                      }}
                    >
                      Add Photo
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Written note */}
      <FieldGroup label="Written Note">
        <textarea
          style={{
            ...INPUT_STYLE,
            resize: "none",
            height: 100,
            lineHeight: 1.6,
          }}
          placeholder="Add a written note..."
          value={form.noteText}
          onChange={(e) =>
            setForm((f) => ({ ...f, noteText: e.target.value }))
          }
        />
      </FieldGroup>

      {/* People */}
      <FieldGroup label="People">
        <div style={{ position: "relative" }}>
          <Users
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(245,247,255,0.35)",
              pointerEvents: "none",
            }}
          />
          <input
            style={{ ...INPUT_STYLE, paddingLeft: 34 }}
            placeholder="Who was there? Separate names with commas"
            value={form.people}
            onChange={(e) =>
              setForm((f) => ({ ...f, people: e.target.value }))
            }
          />
        </div>
      </FieldGroup>

      {/* Tags */}
      <FieldGroup label="Tags">
        <div style={{ position: "relative" }}>
          <Tag
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(245,247,255,0.35)",
              pointerEvents: "none",
            }}
          />
          <input
            style={{ ...INPUT_STYLE, paddingLeft: 34 }}
            placeholder="Add tags... Separate with commas"
            value={form.tags}
            onChange={(e) =>
              setForm((f) => ({ ...f, tags: e.target.value }))
            }
          />
        </div>
      </FieldGroup>
    </div>
  );
}

// ─── Step 2 – Time Lock ───────────────────────────────────────────────────────
function StepTimeLock({
  form,
  setForm,
}: {
  form: CapsuleFormState;
  setForm: React.Dispatch<React.SetStateAction<CapsuleFormState>>;
}) {
  const today = new Date().toISOString().split("T")[0];
  const daysUntil = calcDaysUntil(form.unlockDate);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={LABEL_STYLE}>Set the time lock</label>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label
              style={{ ...LABEL_STYLE, marginBottom: 6, fontSize: 10 }}
            >
              Unlock Date
            </label>
            <input
              type="date"
              style={{ ...INPUT_STYLE, colorScheme: "dark" }}
              min={today}
              value={form.unlockDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, unlockDate: e.target.value }))
              }
            />
          </div>
          <div>
            <label
              style={{ ...LABEL_STYLE, marginBottom: 6, fontSize: 10 }}
            >
              Unlock Time (optional)
            </label>
            <input
              type="time"
              style={{ ...INPUT_STYLE, colorScheme: "dark" }}
              value={form.unlockTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, unlockTime: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Countdown preview */}
      {form.unlockDate && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            background: "rgba(138,160,255,0.08)",
            border: "1px solid rgba(138,160,255,0.2)",
            borderRadius: 14,
          }}
        >
          <Lock size={16} style={{ color: "#9DC2F6", flexShrink: 0 }} />
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#9DC2F6",
              margin: 0,
            }}
          >
            {daysUntil > 0
              ? `Opens in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`
              : "Ready to open"}
          </p>
        </div>
      )}

      {/* Toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatedToggle
          label="Notify me when unlocked"
          description="Receive a notification when the capsule's unlock date arrives"
          value={form.notifyOnUnlock}
          onChange={() =>
            setForm((f) => ({ ...f, notifyOnUnlock: !f.notifyOnUnlock }))
          }
        />
        <AnimatedToggle
          label="Allow friends to contribute before sealing"
          description="Let trip companions add memories to this capsule"
          value={form.allowContributions}
          onChange={() =>
            setForm((f) => ({
              ...f,
              allowContributions: !f.allowContributions,
            }))
          }
        />
        <AnimatedToggle
          label="Hide contents until unlock date"
          description="Contents remain hidden until the capsule is opened"
          value={form.hideUntilUnlock}
          onChange={() =>
            setForm((f) => ({ ...f, hideUntilUnlock: !f.hideUntilUnlock }))
          }
        />
      </div>

      {/* Seal note */}
      <p
        style={{
          fontSize: 11,
          color: "rgba(245,247,255,0.3)",
          margin: 0,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        Once sealed, this capsule cannot be edited.
      </p>
    </div>
  );
}

// ─── Step 3 – Design ──────────────────────────────────────────────────────────
function StepDesign({
  form,
  setForm,
}: {
  form: CapsuleFormState;
  setForm: React.Dispatch<React.SetStateAction<CapsuleFormState>>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label style={LABEL_STYLE}>Capsule Theme</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(
          Object.entries(CAPSULE_THEMES) as [
            CapsuleTheme,
            (typeof CAPSULE_THEMES)[CapsuleTheme]
          ][]
        ).map(([key, thm]) => {
          const active = form.theme === key;
          return (
            <button
              key={key}
              onClick={() => setForm((f) => ({ ...f, theme: key }))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                border: active
                  ? `1.5px solid ${thm.accent}60`
                  : "1px solid rgba(255,255,255,0.08)",
                background: active
                  ? `${thm.accent}12`
                  : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              {/* Swatch */}
              <div
                style={{
                  width: 40,
                  height: 28,
                  borderRadius: 8,
                  background: thm.bg,
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: active
                    ? `0 0 12px ${thm.glow}`
                    : "none",
                  transition: "box-shadow 0.2s ease",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: active ? thm.accent : "rgba(245,247,255,0.6)",
                  flex: 1,
                }}
              >
                {thm.label}
              </span>
              {active && (
                <Check
                  size={14}
                  style={{ color: thm.accent, flexShrink: 0 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4 – Preview ─────────────────────────────────────────────────────────
function StepPreview({ form }: { form: CapsuleFormState }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#F5F7FF",
            margin: "0 0 6px",
            letterSpacing: "-0.03em",
          }}
        >
          Your Capsule
        </p>
        <p
          style={{
            fontSize: 13,
            color: "rgba(245,247,255,0.45)",
            margin: 0,
          }}
        >
          Here's how your capsule will look. Tap "Seal Capsule" to save it.
        </p>
      </div>
      <CapsulePreviewCard form={form} />
    </div>
  );
}

// ─── UnsavedChangesDialog ─────────────────────────────────────────────────────
function UnsavedChangesDialog({
  onKeep,
  onDiscard,
}: {
  onKeep: () => void;
  onDiscard: () => void;
}) {
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onKeep}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
        }}
      />
      {/* Bottom sheet */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 480,
          background: "#12151E",
          borderRadius: "20px 20px 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "28px 24px 40px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.15)",
            margin: "0 auto 20px",
          }}
        />
        <p
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#F5F7FF",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          Discard this Capsule?
        </p>
        <p
          style={{
            fontSize: 13,
            color: "rgba(245,247,255,0.45)",
            margin: "0 0 24px",
            textAlign: "center",
          }}
        >
          All unsaved changes will be lost.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onKeep}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              color: "#F5F7FF",
            }}
          >
            Keep Editing
          </button>
          <button
            onClick={onDiscard}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 14,
              background: "rgba(255,80,80,0.12)",
              border: "1px solid rgba(255,80,80,0.3)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              color: "#FF6B6B",
            }}
          >
            Discard
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─── CapsuleCard (exported) ───────────────────────────────────────────────────
export function CapsuleCard({ capsule }: { capsule: PikCapsule }) {
  const thm = CAPSULE_THEMES[capsule.theme];
  const statusCfg = STATUS_CONFIG[capsule.status];
  const coverUrl = capsule.media.find((m) => m.url)?.url;
  const mediaCount = capsule.media.filter((m) => m.url).length;
  const daysUntil = calcDaysUntil(capsule.unlockDate);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      style={{
        width: 180,
        height: 230,
        borderRadius: 20,
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        background: thm.bg,
        border: `1px solid ${thm.accent}30`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2)`,
        cursor: "pointer",
      }}
    >
      {/* Cover image */}
      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.4,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />

      {/* Status badge */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: statusCfg.bg,
          backdropFilter: "blur(8px)",
          border: `1px solid ${statusCfg.color}40`,
          borderRadius: 999,
          padding: "2px 7px",
        }}
      >
        <span
          style={{
            fontSize: 6,
            fontWeight: 800,
            color: statusCfg.color,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* Media count badge */}
      {mediaCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            borderRadius: 999,
            padding: "2px 7px",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Camera size={8} style={{ color: "rgba(245,247,255,0.6)" }} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(245,247,255,0.6)",
            }}
          >
            {mediaCount}
          </span>
        </div>
      )}

      {/* Lock icon + countdown */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          textAlign: "center",
        }}
      >
        <Lock
          size={28}
          style={{
            color: thm.accent,
            opacity: 0.8,
            filter: `drop-shadow(0 0 8px ${thm.glow})`,
          }}
        />
        {capsule.status === "locked" && daysUntil > 0 && (
          <p
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#F5F7FF",
              margin: "6px 0 0",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            {daysUntil}
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(245,247,255,0.5)",
                display: "block",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              days
            </span>
          </p>
        )}
      </div>

      {/* Bottom info */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 12px 14px",
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "#F5F7FF",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {capsule.title}
        </p>
        <p
          style={{
            fontSize: 10,
            color: "rgba(245,247,255,0.45)",
            margin: "3px 0 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {capsule.destination}
          {capsule.unlockDate && (
            <span style={{ color: thm.accent }}>
              {" · "}
              {formatDate(capsule.unlockDate)}
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

// ─── CapsuleBuilder (exported) ────────────────────────────────────────────────
const STEPS = ["Basics", "Contents", "Time Lock", "Design", "Preview"];

export function CapsuleBuilder({
  onSave,
  onClose,
}: {
  onSave: (c: PikCapsule) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CapsuleFormState>(createEmptyForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= 768
  );

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isDirty = form.title !== "" || form.destination !== "";

  const handleClose = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };

  const validate = (targetStep: number): boolean => {
    const e: Record<string, string> = {};

    if (targetStep >= 0) {
      if (!form.title.trim()) e.title = "Capsule title is required";
      if (!form.destination.trim())
        e.destination = "Destination is required";
      if (!form.unlockDate) {
        e.unlockDate = "Unlock date is required";
      } else {
        const today = new Date().toISOString().split("T")[0];
        if (form.unlockDate < today) {
          e.unlockDate = "Unlock date cannot be in the past";
        }
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validate(0)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Capsule title is required";
    if (!form.destination.trim()) e.destination = "Destination is required";
    if (!form.unlockDate) {
      e.unlockDate = "Unlock date is required";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (form.unlockDate < today) {
        e.unlockDate = "Unlock date cannot be in the past";
      }
    }

    if (Object.keys(e).length > 0) {
      setErrors(e);
      setStep(0);
      return;
    }

    const capsule: PikCapsule = {
      id: uid(),
      title: form.title,
      destination: form.destination,
      country: form.country || undefined,
      unlockDate: form.unlockDate,
      unlockTime: form.unlockTime || undefined,
      caption: form.caption || undefined,
      privacy: form.privacy,
      status: calcDaysUntil(form.unlockDate) <= 0 ? "ready" : "locked",
      media: form.media.filter((m) => m.url),
      people: form.people
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      theme: form.theme,
      notifyOnUnlock: form.notifyOnUnlock,
      allowContributions: form.allowContributions,
      hideUntilUnlock: form.hideUntilUnlock,
      createdAt: new Date().toISOString(),
    };

    onSave(capsule);
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  const stepContent = () => {
    switch (step) {
      case 0:
        return <StepBasics form={form} setForm={setForm} errors={errors} />;
      case 1:
        return <StepContents form={form} setForm={setForm} />;
      case 2:
        return <StepTimeLock form={form} setForm={setForm} />;
      case 3:
        return <StepDesign form={form} setForm={setForm} />;
      case 4:
        return <StepPreview form={form} />;
      default:
        return null;
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "#080B14",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "52px 20px 16px",
          background: "rgba(8,11,20,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Row 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={16} style={{ color: "rgba(245,247,255,0.7)" }} />
            </button>
            <div>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#F5F7FF",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                New PIK Capsule
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(245,247,255,0.4)",
                  margin: "2px 0 0",
                }}
              >
                Step {step + 1} of {STEPS.length} · {STEPS[step]}
              </p>
            </div>
          </div>
          {isDirty && step < STEPS.length - 1 && (
            <button
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(245,247,255,0.45)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 10px",
              }}
            >
              Save Draft
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              height: "100%",
              background: LOGO_GRAD,
              borderRadius: 999,
            }}
          />
        </div>
      </div>

      {/* Content */}
      {isDesktop ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Form side */}
          <div style={{ overflowY: "auto", padding: "32px 32px 120px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {stepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Preview side */}
          <div
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.015)",
              padding: "32px 24px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "rgba(245,247,255,0.3)",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              LIVE PREVIEW
            </p>
            <CapsulePreviewCard form={form} />
          </div>
        </div>
      ) : (
        <div style={{ padding: "24px 20px 100px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {stepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Bottom nav */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "16px 20px",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          background: "rgba(8,11,20,0.95)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={back}
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={20} style={{ color: "rgba(245,247,255,0.7)" }} />
          </motion.button>
        )}

        {step < STEPS.length - 1 ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={next}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 14,
              background: LOGO_GRAD,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Continue
            <ChevronRight size={16} />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 14,
              background: GOLD_GRAD,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              color: "#1A1200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Lock size={16} />
            Seal Capsule
          </motion.button>
        )}
      </div>

      {/* Discard dialog */}
      <AnimatePresence>
        {showDiscardDialog && (
          <UnsavedChangesDialog
            key="discard"
            onKeep={() => setShowDiscardDialog(false)}
            onDiscard={() => {
              setShowDiscardDialog(false);
              onClose();
            }}
          />
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
