import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, Star, MapPin, Users,
  Camera, Trash2, Check,
} from "lucide-react";
import { CountryPickerField, DestinationPickerField } from "./LocationPickers";

// ─── Types ────────────────────────────────────────────────────────────────────
export type TripTheme =
  | "midnightGold"
  | "coastalBlue"
  | "desertEmber"
  | "alpineMist"
  | "santoriniWhite";

export type TripCardStyle = "editorial" | "passport" | "yearbook" | "cinematic";

export interface TripHighlight {
  id: string;
  label: string;
  value: string;
}

export interface TripMedia {
  id: string;
  url?: string;
  type: "image" | "video";
}

export interface TripCard {
  id: string;
  title: string;
  destination: string;
  country: string;
  cities: string[];
  startDate: string;
  endDate: string;
  daysAway: number;
  nights: number;
  travelers: number;
  tripType: string;
  caption: string;
  travelStyles: string[];
  highlights: TripHighlight[];
  media: TripMedia[];
  theme: TripTheme;
  style: TripCardStyle;
  visibility: {
    showDates: boolean;
    showTravelerCount: boolean;
    showCountryBadge: boolean;
    showHighlights: boolean;
    showStats: boolean;
  };
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD = "#D4A847";
const GOLD_GRAD =
  "linear-gradient(135deg, #F0C040 0%, #D4A030 50%, #B8880A 100%)";
const LOGO_GRAD =
  "linear-gradient(135deg, #D4E8FB 0%, #9DC2F6 40%, #8C87F4 85%, #B99CF9 100%)";
const EASE = [0.22, 1, 0.36, 1] as const;

const THEMES: Record<
  TripTheme,
  { label: string; bg: string; accent: string; previewColors: string[] }
> = {
  midnightGold: {
    label: "Midnight Gold",
    bg: "linear-gradient(135deg,#080B14,#1a1030)",
    accent: "#D4A847",
    previewColors: ["#080B14", "#D4A847"],
  },
  coastalBlue: {
    label: "Coastal Blue",
    bg: "linear-gradient(135deg,#041428,#0a2a4a)",
    accent: "#4DA3FF",
    previewColors: ["#041428", "#4DA3FF"],
  },
  desertEmber: {
    label: "Desert Ember",
    bg: "linear-gradient(135deg,#1a0a05,#2a1508)",
    accent: "#FF8A65",
    previewColors: ["#1a0a05", "#FF8A65"],
  },
  alpineMist: {
    label: "Alpine Mist",
    bg: "linear-gradient(135deg,#0d1420,#1a2535)",
    accent: "#A8C0D0",
    previewColors: ["#0d1420", "#A8C0D0"],
  },
  santoriniWhite: {
    label: "Santorini White",
    bg: "linear-gradient(135deg,#1a1a2e,#0f1535)",
    accent: "#E0E8FF",
    previewColors: ["#1a1a2e", "#E0E8FF"],
  },
};

const CARD_STYLES: Record<TripCardStyle, string> = {
  editorial: "Editorial",
  passport: "Passport",
  yearbook: "Yearbook",
  cinematic: "Cinematic",
};

const TRAVEL_STYLE_OPTIONS = [
  "Luxury", "Adventure", "Backpacking", "Couple", "Solo", "Group",
  "Beach", "Mountain", "City", "Wellness", "Food", "Culture",
];

const HIGHLIGHT_PRESET_LABELS = [
  "Favorite activity",
  "Best meal",
  "Best view",
  "Favorite stay",
  "Most unforgettable moment",
  "Hidden gem",
];

const TRIP_TYPE_OPTIONS = [
  "Leisure", "Adventure", "Business", "Honeymoon", "Solo", "Family", "Group Tour",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcDays(start: string, end: string): number {
  if (!start || !end) return 0;
  return Math.max(
    0,
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86400000
    )
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

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── FormState ────────────────────────────────────────────────────────────────
interface FormState {
  title: string;
  destination: string;
  country: string;
  citiesRaw: string;
  startDate: string;
  endDate: string;
  travelers: number;
  tripType: string;
  caption: string;
  travelStyles: string[];
  highlights: TripHighlight[];
  media: TripMedia[];
  theme: TripTheme;
  style: TripCardStyle;
  visibility: TripCard["visibility"];
}

function createEmptyForm(): FormState {
  return {
    title: "",
    destination: "",
    country: "",
    citiesRaw: "",
    startDate: "",
    endDate: "",
    travelers: 2,
    tripType: "",
    caption: "",
    travelStyles: [],
    highlights: [
      { id: uid(), label: "Favorite activity", value: "" },
      { id: uid(), label: "Best meal", value: "" },
      { id: uid(), label: "Best view", value: "" },
    ],
    media: Array(4)
      .fill(null)
      .map(() => ({ id: uid(), type: "image" as const })),
    theme: "midnightGold",
    style: "editorial",
    visibility: {
      showDates: true,
      showTravelerCount: true,
      showCountryBadge: true,
      showHighlights: true,
      showStats: true,
    },
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

// ─── TripCardPreview ──────────────────────────────────────────────────────────
function TripCardPreview({ form }: { form: FormState }) {
  const thm = THEMES[form.theme];
  const days = calcDays(form.startDate, form.endDate);
  const cities = form.citiesRaw
    ? form.citiesRaw.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${thm.accent}30`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: 180,
          background: thm.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
          }}
        />
        {/* PIK CARD badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${thm.accent}50`,
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
            PIK CARD
          </span>
        </div>
        {/* Destination */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            right: 14,
          }}
        >
          {form.visibility.showCountryBadge && form.country && (
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: thm.accent,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                margin: "0 0 4px",
              }}
            >
              {form.country}
            </p>
          )}
          <p
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#F5F7FF",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {form.destination || (
              <span style={{ opacity: 0.3 }}>Destination</span>
            )}
          </p>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          background: "#0D1018",
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Title */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#F5F7FF",
            margin: 0,
          }}
        >
          {form.title || form.destination || (
            <span style={{ opacity: 0.3 }}>Trip title</span>
          )}
        </p>

        {/* Date range */}
        {form.visibility.showDates && form.startDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "rgba(245,247,255,0.5)",
            }}
          >
            <span>📅</span>
            <span>
              {formatDate(form.startDate)}
              {form.endDate ? ` – ${formatDate(form.endDate)}` : ""}
            </span>
          </div>
        )}

        {/* Stats row */}
        {form.visibility.showStats && days > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {[
              { label: `${days}`, sub: "days" },
              ...(form.visibility.showTravelerCount
                ? [{ label: `${form.travelers}`, sub: "travelers" }]
                : []),
              ...(cities.length > 0
                ? [{ label: `${cities.length}`, sub: "cities" }]
                : []),
            ].map(({ label, sub }, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  padding: "5px 10px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: thm.accent,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 8,
                    color: "rgba(245,247,255,0.38)",
                    margin: "2px 0 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Caption */}
        {form.caption && (
          <p
            style={{
              fontSize: 12,
              color: "rgba(245,247,255,0.5)",
              fontStyle: "italic",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            "{form.caption}"
          </p>
        )}

        {/* Highlights */}
        {form.visibility.showHighlights && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {form.highlights.slice(0, 3).map((h) =>
              h.value ? (
                <div key={h.id} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: thm.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      flexShrink: 0,
                    }}
                  >
                    {h.label}:
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(245,247,255,0.65)",
                    }}
                  >
                    {h.value}
                  </span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Travel style tags */}
        {form.travelStyles.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {form.travelStyles.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: thm.accent,
                  background: `${thm.accent}18`,
                  border: `1px solid ${thm.accent}30`,
                  borderRadius: 999,
                  padding: "3px 8px",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── StepCover ────────────────────────────────────────────────────────────────
function StepCover({
  form,
  setForm,
  errors,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}) {
  const days = calcDays(form.startDate, form.endDate);

  const toggleStyle = (style: string) => {
    setForm((f) => ({
      ...f,
      travelStyles: f.travelStyles.includes(style)
        ? f.travelStyles.filter((s) => s !== style)
        : [...f.travelStyles, style],
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
      <FieldGroup label="Country *">
        <CountryPickerField
          value={form.country}
          onChange={(v) => setForm((f) => ({ ...f, country: v }))}
          hasError={!!errors.country}
        />
        {errors.country && (
          <p style={{ fontSize: 11, color: "#FF6B6B", margin: 0 }}>
            {errors.country}
          </p>
        )}
      </FieldGroup>

      {/* Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FieldGroup label="Start Date *">
          <input
            type="date"
            style={INPUT_STYLE}
            value={form.startDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, startDate: e.target.value }))
            }
          />
          {errors.startDate && (
            <p style={{ fontSize: 11, color: "#FF6B6B", margin: 0 }}>
              {errors.startDate}
            </p>
          )}
        </FieldGroup>
        <FieldGroup label="End Date *">
          <input
            type="date"
            style={INPUT_STYLE}
            value={form.endDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, endDate: e.target.value }))
            }
          />
          {errors.endDate && (
            <p style={{ fontSize: 11, color: "#FF6B6B", margin: 0 }}>
              {errors.endDate}
            </p>
          )}
        </FieldGroup>
      </div>

      {/* Nights badge */}
      {days > 0 && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `${GOLD}18`,
            border: `1px solid ${GOLD}30`,
            borderRadius: 999,
            padding: "5px 14px",
            alignSelf: "flex-start",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>
            {days} night{days !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Travel styles */}
      <FieldGroup label="Travel Style">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {TRAVEL_STYLE_OPTIONS.map((style) => {
            const active = form.travelStyles.includes(style);
            return (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 999,
                  padding: "6px 12px",
                  cursor: "pointer",
                  border: active
                    ? `1px solid ${GOLD}60`
                    : "1px solid rgba(255,255,255,0.12)",
                  background: active ? `${GOLD}18` : "rgba(255,255,255,0.04)",
                  color: active ? GOLD : "rgba(245,247,255,0.55)",
                  transition: "all 0.15s ease",
                }}
              >
                {style}
              </button>
            );
          })}
        </div>
      </FieldGroup>
    </div>
  );
}

// ─── StepDetails ──────────────────────────────────────────────────────────────
function StepDetails({
  form,
  setForm,
  errors,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <FieldGroup label="Trip Title *">
        <input
          style={INPUT_STYLE}
          placeholder="e.g. Bali Spiritual Journey"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        {errors.title && (
          <p style={{ fontSize: 11, color: "#FF6B6B", margin: 0 }}>
            {errors.title}
          </p>
        )}
      </FieldGroup>

      {/* Cities */}
      <FieldGroup label="Cities Visited">
        <input
          style={INPUT_STYLE}
          placeholder="e.g. Ubud, Seminyak, Canggu"
          value={form.citiesRaw}
          onChange={(e) =>
            setForm((f) => ({ ...f, citiesRaw: e.target.value }))
          }
        />
        <p
          style={{
            fontSize: 10,
            color: "rgba(245,247,255,0.3)",
            margin: "4px 0 0",
          }}
        >
          Separate cities with commas
        </p>
      </FieldGroup>

      {/* Travelers + Trip Type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FieldGroup label="Travelers">
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
              type="number"
              min={1}
              max={99}
              style={{ ...INPUT_STYLE, paddingLeft: 34 }}
              value={form.travelers}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  travelers: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
            />
          </div>
        </FieldGroup>
        <FieldGroup label="Trip Type">
          <select
            style={{
              ...INPUT_STYLE,
              appearance: "none" as const,
              cursor: "pointer",
            }}
            value={form.tripType}
            onChange={(e) =>
              setForm((f) => ({ ...f, tripType: e.target.value }))
            }
          >
            <option value="">Select…</option>
            {TRIP_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FieldGroup>
      </div>

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
            placeholder="A short caption for your trip card…"
            maxLength={160}
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
            {form.caption.length}/160
          </p>
        </div>
      </FieldGroup>
    </div>
  );
}

// ─── StepHighlights ───────────────────────────────────────────────────────────
function StepHighlights({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const updateHighlight = (
    id: string,
    field: keyof TripHighlight,
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      highlights: f.highlights.map((h) =>
        h.id === id ? { ...h, [field]: value } : h
      ),
    }));
  };

  const removeHighlight = (id: string) => {
    setForm((f) => ({
      ...f,
      highlights: f.highlights.filter((h) => h.id !== id),
    }));
  };

  const addHighlight = () => {
    if (form.highlights.length >= 8) return;
    setForm((f) => ({
      ...f,
      highlights: [
        ...f.highlights,
        { id: uid(), label: "Favorite activity", value: "" },
      ],
    }));
  };

  const labelOptions = [...HIGHLIGHT_PRESET_LABELS, "Custom"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {form.highlights.map((h) => (
        <div
          key={h.id}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
            >
              <Star size={13} style={{ color: GOLD, flexShrink: 0 }} />
              <select
                style={{
                  ...INPUT_STYLE,
                  padding: "7px 10px",
                  fontSize: 12,
                  appearance: "none" as const,
                }}
                value={h.label}
                onChange={(e) => updateHighlight(h.id, "label", e.target.value)}
              >
                {labelOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => removeHighlight(h.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                marginLeft: 8,
                flexShrink: 0,
              }}
            >
              <Trash2 size={13} style={{ color: "rgba(245,247,255,0.3)" }} />
            </button>
          </div>
          <input
            style={{ ...INPUT_STYLE, fontSize: 13 }}
            placeholder="Describe this highlight…"
            value={h.value}
            onChange={(e) => updateHighlight(h.id, "value", e.target.value)}
          />
        </div>
      ))}

      {form.highlights.length < 8 && (
        <button
          onClick={addHighlight}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 14,
            border: "1.5px dashed rgba(255,255,255,0.15)",
            background: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(245,247,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Star size={12} />
          Add Highlight
        </button>
      )}
    </div>
  );
}

// ─── StepMedia ────────────────────────────────────────────────────────────────
function StepMedia({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Ensure at least 4 slots
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
  );
}

// ─── StepDesign ───────────────────────────────────────────────────────────────
function StepDesign({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const TOGGLE_LABELS: Array<{
    key: keyof TripCard["visibility"];
    label: string;
  }> = [
    { key: "showDates", label: "Show dates" },
    { key: "showTravelerCount", label: "Traveler count" },
    { key: "showCountryBadge", label: "Country badge" },
    { key: "showHighlights", label: "Highlights" },
    { key: "showStats", label: "Trip stats" },
  ];

  const toggleVisibility = (key: keyof TripCard["visibility"]) => {
    setForm((f) => ({
      ...f,
      visibility: { ...f.visibility, [key]: !f.visibility[key] },
    }));
  };

  const styleEntries = Object.entries(CARD_STYLES) as [TripCardStyle, string][];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Theme picker */}
      <div>
        <label style={LABEL_STYLE}>Card Theme</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(Object.entries(THEMES) as [TripTheme, (typeof THEMES)[TripTheme]][]).map(
            ([key, thm]) => {
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
                      background: `linear-gradient(135deg, ${thm.previewColors[0]}, ${thm.previewColors[1]})`,
                      flexShrink: 0,
                      border: "1px solid rgba(255,255,255,0.1)",
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
                    <Check size={14} style={{ color: thm.accent, flexShrink: 0 }} />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Card style */}
      <div>
        <label style={LABEL_STYLE}>Card Style</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {styleEntries.map(([key, label]) => {
            const active = form.style === key;
            return (
              <button
                key={key}
                onClick={() => setForm((f) => ({ ...f, style: key }))}
                style={{
                  padding: "12px",
                  borderRadius: 12,
                  border: active
                    ? `1.5px solid ${LOGO_GRAD}`
                    : "1px solid rgba(255,255,255,0.08)",
                  background: active
                    ? "rgba(138,160,255,0.1)"
                    : "rgba(255,255,255,0.03)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: active ? "#9DC2F6" : "rgba(245,247,255,0.5)",
                  borderImage: active ? LOGO_GRAD + " 1" : undefined,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visibility toggles */}
      <div>
        <label style={LABEL_STYLE}>Visibility</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TOGGLE_LABELS.map(({ key, label }) => {
            const on = form.visibility[key];
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(245,247,255,0.7)",
                  }}
                >
                  {label}
                </span>
                {/* Toggle */}
                <div
                  onClick={() => toggleVisibility(key)}
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 999,
                    background: on
                      ? "linear-gradient(90deg,#9DC2F6,#8C87F4)"
                      : "rgba(255,255,255,0.1)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    animate={{ x: on ? 20 : 2 }}
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
          })}
        </div>
      </div>
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
          Discard this Trip Card?
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

// ─── TripCardBuilder ──────────────────────────────────────────────────────────
const STEPS = ["Location", "Details", "Highlights", "Photos", "Design", "Preview"];

export function TripCardBuilder({
  onSave,
  onClose,
}: {
  onSave: (card: TripCard) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(createEmptyForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isDirty =
    form.destination !== "" || form.title !== "" || form.country !== "";

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
      if (!form.destination.trim()) e.destination = "Destination is required";
      if (!form.country.trim()) e.country = "Country is required";
      if (!form.startDate) e.startDate = "Start date is required";
      if (!form.endDate) e.endDate = "End date is required";
      else if (form.startDate && form.endDate && form.endDate < form.startDate) {
        e.endDate = "End date must be on or after start date";
      }
    }

    if (targetStep >= 1) {
      if (!form.title.trim()) e.title = "Trip title is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!form.destination.trim()) e.destination = "Destination is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    else if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = "End date must be on or after start date";
    }
    if (!form.title.trim()) e.title = "Trip title is required";

    if (Object.keys(e).length > 0) {
      setErrors(e);
      const step0Keys = ["destination", "country", "startDate", "endDate"];
      const hasStep0Error = step0Keys.some((k) => e[k]);
      setStep(hasStep0Error ? 0 : 1);
      return;
    }

    const days = calcDays(form.startDate, form.endDate);
    const cities = form.citiesRaw
      ? form.citiesRaw.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    const card: TripCard = {
      id: uid(),
      title: form.title,
      destination: form.destination,
      country: form.country,
      cities,
      startDate: form.startDate,
      endDate: form.endDate,
      daysAway: days,
      nights: days,
      travelers: form.travelers,
      tripType: form.tripType,
      caption: form.caption,
      travelStyles: form.travelStyles,
      highlights: form.highlights,
      media: form.media,
      theme: form.theme,
      style: form.style,
      visibility: form.visibility,
      createdAt: new Date().toISOString(),
    };

    onSave(card);
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  const stepContent = () => {
    switch (step) {
      case 0:
        return <StepCover form={form} setForm={setForm} errors={errors} />;
      case 1:
        return <StepDetails form={form} setForm={setForm} errors={errors} />;
      case 2:
        return <StepHighlights form={form} setForm={setForm} />;
      case 3:
        return <StepMedia form={form} setForm={setForm} />;
      case 4:
        return <StepDesign form={form} setForm={setForm} />;
      case 5:
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
                Your Trip Card
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(245,247,255,0.45)",
                  margin: 0,
                }}
              >
                Here's how your card will look. Tap "Create Trip Card" to save it.
              </p>
            </div>
            <TripCardPreview form={form} />
          </div>
        );
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
                New Trip Card
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
          {isDirty && step < 5 && (
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
            gridTemplateColumns: "1fr 400px",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Form side */}
          <div
            style={{
              overflowY: "auto",
              padding: "32px 32px 120px",
            }}
          >
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
            <TripCardPreview form={form} />
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

        {step < 5 ? (
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
            <Star size={16} />
            Create Trip Card
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

// ─── CreatedTripCard ──────────────────────────────────────────────────────────
export function CreatedTripCard({ card }: { card: TripCard }) {
  const thm = THEMES[card.theme];
  const cities = card.cities ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      whileTap={{ scale: 0.99 }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${thm.accent}30`,
        marginBottom: 12,
        cursor: "pointer",
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: card.media[0]?.url ? 200 : 140,
          background: thm.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {card.media[0]?.url && (
          <img
            src={card.media[0].url}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
          }}
        />
        {/* PIK CARD badge */}
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
            PIK CARD
          </span>
        </div>
        {/* Style badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "3px 9px",
          }}
        >
          <span
            style={{
              fontSize: 7,
              fontWeight: 700,
              color: "rgba(245,247,255,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {CARD_STYLES[card.style]}
          </span>
        </div>
        {/* Destination */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            right: 14,
          }}
        >
          {card.visibility.showCountryBadge && (
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: thm.accent,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                margin: "0 0 4px",
              }}
            >
              {card.country}
            </p>
          )}
          <p
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#F5F7FF",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {card.destination}
          </p>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          background: "#0D1018",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Title */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#F5F7FF",
            margin: 0,
          }}
        >
          {card.title}
        </p>

        {/* Dates */}
        {card.visibility.showDates && (
          <p
            style={{
              fontSize: 11,
              color: "rgba(245,247,255,0.45)",
              margin: 0,
            }}
          >
            {formatDate(card.startDate)}
            {card.endDate ? ` – ${formatDate(card.endDate)}` : ""}
          </p>
        )}

        {/* Stats */}
        {card.visibility.showStats && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[
              { label: `${card.daysAway}`, sub: "days" },
              ...(card.visibility.showTravelerCount
                ? [{ label: `${card.travelers}`, sub: "travelers" }]
                : []),
              ...(cities.length > 0
                ? [{ label: `${cities.length}`, sub: "cities" }]
                : []),
            ].map(({ label, sub }, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  padding: "4px 9px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: thm.accent,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 8,
                    color: "rgba(245,247,255,0.35)",
                    margin: "1px 0 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Caption */}
        {card.caption && (
          <p
            style={{
              fontSize: 12,
              color: "rgba(245,247,255,0.45)",
              fontStyle: "italic",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            "{card.caption}"
          </p>
        )}

        {/* Highlights */}
        {card.visibility.showHighlights && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {card.highlights.slice(0, 2).map((h) =>
              h.value ? (
                <div key={h.id} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: thm.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      flexShrink: 0,
                    }}
                  >
                    {h.label}:
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(245,247,255,0.6)",
                    }}
                  >
                    {h.value}
                  </span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Travel style tags */}
        {card.travelStyles.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {card.travelStyles.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: thm.accent,
                  background: `${thm.accent}18`,
                  border: `1px solid ${thm.accent}30`,
                  borderRadius: 999,
                  padding: "3px 8px",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
