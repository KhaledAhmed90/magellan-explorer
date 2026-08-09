import { useMemo } from "react";
import type { SatelliteInfo } from "@/lib/magellan/types";
import { cn } from "@/lib/utils";

/**
 * Polar sky plot. Positions are derived strictly from azimuth/elevation.
 * In production those come from GnssStatus; here from DemoGnssProvider.
 */
export function SkyView({
  satellites,
  selectedId,
  onSelect,
  size = 320,
}: {
  satellites: SatelliteInfo[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  size?: number;
}) {
  const r = size / 2;
  const pad = 18;
  const radius = r - pad;

  const points = useMemo(
    () =>
      satellites.map((s) => {
        const d = ((90 - s.elevationDeg) / 90) * radius;
        const a = ((s.azimuthDeg - 90) * Math.PI) / 180;
        return { s, x: r + d * Math.cos(a), y: r + d * Math.sin(a) };
      }),
    [satellites, r, radius],
  );

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto h-auto w-full max-w-[420px] touch-manipulation"
      role="img"
      aria-label={`Sky view with ${satellites.length} simulated satellites`}
    >
      {[1, 2 / 3, 1 / 3].map((f) => (
        <circle
          key={f}
          cx={r}
          cy={r}
          r={radius * f}
          className="fill-none stroke-border"
          strokeWidth={1}
        />
      ))}
      <line x1={r} y1={pad} x2={r} y2={size - pad} className="stroke-border" strokeWidth={1} />
      <line x1={pad} y1={r} x2={size - pad} y2={r} className="stroke-border" strokeWidth={1} />
      {[
        { l: "N", x: r, y: pad - 5 },
        { l: "S", x: r, y: size - pad + 13 },
        { l: "E", x: size - pad + 10, y: r + 4 },
        { l: "W", x: pad - 10, y: r + 4 },
      ].map((c) => (
        <text
          key={c.l}
          x={c.x}
          y={c.y}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          {c.l}
        </text>
      ))}
      <text x={r + 4} y={r - 4} className="fill-muted-foreground text-[9px]">
        90°
      </text>

      {points.map(({ s, x, y }) => {
        const selected = selectedId === s.id;
        return (
          <g
            key={s.id}
            onClick={() => onSelect?.(s.id)}
            className={onSelect ? "cursor-pointer" : undefined}
            tabIndex={onSelect ? 0 : -1}
            role={onSelect ? "button" : undefined}
            aria-label={`${s.constellation} ${s.svid}, elevation ${Math.round(s.elevationDeg)} degrees, azimuth ${Math.round(s.azimuthDeg)} degrees, ${s.cn0DbHz.toFixed(0)} dB-Hz`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect?.(s.id);
            }}
          >
            {selected ? (
              <circle cx={x} cy={y} r={13} className="fill-none stroke-primary" strokeWidth={2} />
            ) : null}
            <circle
              cx={x}
              cy={y}
              r={s.usedInFix ? 8 : 6}
              className={cn(
                s.usedInFix ? "fill-primary" : "fill-muted",
                "stroke-border",
              )}
              strokeWidth={1}
            />
            <text
              x={x}
              y={y + 3}
              textAnchor="middle"
              className={cn(
                "pointer-events-none text-[8px] font-semibold",
                s.usedInFix ? "fill-primary-foreground" : "fill-muted-foreground",
              )}
            >
              {s.svid}
            </text>
          </g>
        );
      })}
    </svg>
  );
}