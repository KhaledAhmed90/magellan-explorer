import { createFileRoute } from "@tanstack/react-router";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader, Stat, cn0Bg, cn0Class } from "@/components/magellan/primitives";
import { DemoBadge, SimulatedNotice } from "@/components/magellan/DemoBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signal")({
  head: () => ({
    meta: [
      { title: "Signal & C/N0 — Magellan" },
      {
        name: "description",
        content: "Carrier-to-noise density (C/N0) bars per satellite and per constellation.",
      },
      { property: "og:title", content: "Signal & C/N0 — Magellan" },
      { property: "og:description", content: "Per-satellite C/N0 signal strength view." },
    ],
  }),
  component: SignalPage,
});

function SignalPage() {
  const { snapshot, t } = useMagellan();
  const sats = [...snapshot.satellites].sort((a, b) => b.cn0DbHz - a.cn0DbHz);
  const used = sats.filter((s) => s.usedInFix);
  const avg = used.length
    ? used.reduce((sum, s) => sum + s.cn0DbHz, 0) / used.length
    : undefined;
  const best = sats[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_signal")}
        description="C/N0 in dB-Hz as reported per satellite. No signal value is synthesised from position."
        actions={<DemoBadge label={t("simulated")} />}
      />
      <SimulatedNotice />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Mean C/N0 (used)" value={avg?.toFixed(1)} unit="dB-Hz" />
        <Stat label="Best satellite" value={best ? `${best.constellation} ${best.svid}` : undefined} />
        <Stat label="Best C/N0" value={best?.cn0DbHz.toFixed(1)} unit="dB-Hz" />
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-card p-4">
        <h2 className="label-eyebrow">Per-satellite C/N0</h2>
        <ul className="space-y-2">
          {sats.map((s) => (
            <li key={s.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2">
              <span className="numeric truncate text-xs text-muted-foreground">
                {s.constellation.slice(0, 3)} {s.svid}
              </span>
              <span className="h-3 w-full overflow-hidden rounded-sm bg-muted">
                <span
                  className={cn("block h-full", cn0Bg(s.cn0DbHz), !s.usedInFix && "opacity-45")}
                  style={{ width: `${Math.min(100, (s.cn0DbHz / 55) * 100)}%` }}
                />
              </span>
              <span className={cn("numeric text-right text-xs font-semibold", cn0Class(s.cn0DbHz))}>
                {s.cn0DbHz.toFixed(0)}
              </span>
            </li>
          ))}
        </ul>
        <p className="pt-2 text-xs text-muted-foreground">
          Solid bars are used in fix. Bands: ≥38 strong, 27–38 medium, &lt;27 weak.
        </p>
      </div>
    </div>
  );
}