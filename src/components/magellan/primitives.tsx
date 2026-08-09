import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Stat({
  label,
  value,
  unit,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: string;
  className?: string;
}) {
  const unavailable = value === null || value === undefined || value === "";
  return (
    <div className={cn("min-w-0 rounded-lg border border-border bg-card p-3", className)}>
      <div className="label-eyebrow truncate">{label}</div>
      <div className="mt-1 flex min-w-0 items-baseline gap-1">
        <span
          className={cn(
            "numeric truncate text-lg font-semibold",
            unavailable && "text-muted-foreground",
          )}
        >
          {unavailable ? "Unavailable" : value}
        </span>
        {!unavailable && unit ? (
          <span className="text-xs text-muted-foreground">{unit}</span>
        ) : null}
      </div>
      {hint ? <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Section({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="label-eyebrow truncate">{title}</h2>
        {aside ? <div className="shrink-0">{aside}</div> : <span />}
      </div>
      {children}
    </section>
  );
}

/** C/N0 quality banding used consistently across satellite UI. */
export function cn0Class(cn0: number): string {
  if (cn0 >= 38) return "text-signal-strong";
  if (cn0 >= 27) return "text-signal-medium";
  return "text-signal-weak";
}

export function cn0Bg(cn0: number): string {
  if (cn0 >= 38) return "bg-signal-strong";
  if (cn0 >= 27) return "bg-signal-medium";
  return "bg-signal-weak";
}

export const CONSTELLATION_COLOR: Record<string, string> = {
  GPS: "bg-signal-strong",
  GALILEO: "bg-primary",
  GLONASS: "bg-signal-medium",
  BEIDOU: "bg-signal-weak",
  QZSS: "bg-accent-foreground",
  SBAS: "bg-muted-foreground",
  IRNSS: "bg-foreground",
  UNKNOWN: "bg-muted-foreground",
};