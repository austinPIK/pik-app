import { useState } from "react";

interface Props {
  variant?: "full" | "symbol" | "splash";
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ASSETS = {
  full:    "/brand/pik-logo-transparent.png",
  symbol:  "/brand/pik-symbol-transparent.png",
  splash:  "/brand/pik-logo-splash.png",
} as const;

const DEFAULT_WIDTHS = { full: 180, symbol: 48, splash: 240 };

// SVG fallback rendered when brand PNG files haven't been uploaded yet.
// Matches the PIK chrome gradient style.
function PIKLogoFallback({ variant, width }: { variant: NonNullable<Props["variant"]>; width: number }) {
  const gid = `pik-fg-${variant}`;
  const fid = `pik-ff-${variant}`;

  if (variant === "symbol") {
    const h = Math.round(width * 0.9);
    return (
      <svg width={width} height={h} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#F4F8FF" />
            <stop offset="30%"  stopColor="#A8C6F0" />
            <stop offset="70%"  stopColor="#7890DC" />
            <stop offset="100%" stopColor="#6A72CC" />
          </linearGradient>
          <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" in="SourceGraphic" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <text x="4" y="38" fontFamily="'Exo 2','Rajdhani',system-ui,sans-serif" fontWeight="900" fontSize="38" fill={`url(#${gid})`} filter={`url(#${fid})`}>P</text>
      </svg>
    );
  }

  const lmH = Math.round(width * 0.48);
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 4, userSelect: "none" }}>
      <svg width={width} height={lmH} viewBox="0 0 200 96" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#D4E8FB" />
            <stop offset="28%"  stopColor="#9DC2F6" />
            <stop offset="55%"  stopColor="#6B9FEE" />
            <stop offset="75%"  stopColor="#8C87F4" />
            <stop offset="100%" stopColor="#B99CF9" />
          </linearGradient>
          <filter id={fid} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="2.8" in="SourceGraphic" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="0.2 0 0.6 0 0.1  0.1 0 0.7 0 0.2  0.7 0 1 0 0.3  0 0 0 0.85 0"
              result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <text x="0" y="88" fontFamily="'Exo 2','Rajdhani',system-ui,sans-serif" fontWeight="900" fontSize="96" letterSpacing="-3" fill={`url(#${gid})`} filter={`url(#${fid})`}>PIK</text>
      </svg>
      <span style={{
        fontFamily: "'Exo 2','Rajdhani',system-ui,sans-serif",
        fontSize: Math.round(width * 0.063),
        fontWeight: 300,
        letterSpacing: "0.45em",
        color: "#C0D4F8",
        textTransform: "uppercase" as const,
        lineHeight: 1,
        paddingLeft: 3,
      }}>
        DESTINATIONS
      </span>
    </div>
  );
}

export function PIKLogo({ variant = "full", width, height, className, style }: Props) {
  const [failed, setFailed] = useState(false);
  const w = width ?? DEFAULT_WIDTHS[variant];

  if (failed) {
    return (
      <div className={className} style={style}>
        <PIKLogoFallback variant={variant} width={w} />
      </div>
    );
  }

  return (
    <img
      src={ASSETS[variant]}
      alt="PIK Destinations"
      width={w}
      height={height}
      className={className}
      onError={() => setFailed(true)}
      style={{
        objectFit: "contain",
        display: "block",
        maxWidth: "100%",
        height: "auto",
        background: "transparent",
        ...style,
      }}
      draggable={false}
    />
  );
}
