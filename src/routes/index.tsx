import { createFileRoute, Link } from "@tanstack/react-router";
import { Satellite, QrCode, Navigation, Radar } from "lucide-react";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader, Section, Stat, cn0Bg } from "@/components/magellan/primitives";
import { DemoBadge, SimulatedNotice } from "@/components/magellan/DemoBadge";
import { cardinal, formatCoord } from "@/lib/magellan/geo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Magellan — GNSS Dashboard Prototype" },
      {
        name: "description",
        content:
          "Live Magellan dashboard prototype: position, accuracy, altitude, speed, bearing, GNSS fix status and satellite summary.",
      },
      { property: "og:title", content: "Magellan — GNSS Dashboard Prototype" },
      {
        property: "og:description",
        content: "Position, accuracy, GNSS fix state and satellite summary in the Magellan prototype.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { snapshot, t, heading, headingSource } = useMagellan();
  const s = snapshot;
  const byConstellation = new Map<string, { v: number; u: number }>();
  for (const sat of s.satellites) {
    const e = byConstellation.get(sat.constellation) ?? { v: 0, u: 0 };
    e.v += 1;
    if (sat.usedInFix) e.u += 1;
    byConstellation.set(sat.constellation, e);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("app")}
        description={t("tagline")}
        actions={<DemoBadge label={t("simulated")} />}
      />

      <SimulatedNotice />

      <Section
        title={t("section_position")}
        aside={
          <span className="rounded-full border border-border px-2 py-0.5 text-xs">
            {t("fix")}: <span className="numeric font-semibold">{s.fixQuality}</span>
          </span>
        }
      >
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="label-eyebrow">Coordinates (WGS84)</div>
          <p className="numeric mt-1 text-xl font-semibold break-all">
            {s.latitude !== undefined && s.longitude !== undefined
              ? formatCoord(s.latitude, s.longitude)
              : "Unavailable"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Source: {s.source} · updated {new Date(s.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label={t("accuracy")} value={s.accuracyM?.toFixed(1)} unit="m" />
          <Stat label={t("altitude")} value={s.altitudeM?.toFixed(0)} unit="m" />
          <Stat label={t("speed")} value={s.speedMps?.toFixed(1)} unit="m/s" />
          <Stat
            label={t("bearing")}
            value={s.courseBearingDeg?.toFixed(0)}
            unit={`° ${s.courseBearingDeg !== undefined ? cardinal(s.courseBearingDeg) : ""}`}
            hint="Course over ground"
          />
          <Stat
            label={t("heading")}
            value={heading?.toFixed(0)}
            unit="°"
            hint={headingSource === "unavailable" ? "No heading source" : `Source: ${headingSource}`}
          />
          <Stat label={t("fix")} value={s.fixQuality} hint="GNSS fix state" />
        </div>
      </Section>

      <Section title={t("section_signal")}>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t("visible")} value={s.satellitesVisible} hint="satellitesVisible" />
          <Stat label={t("used")} value={s.satellitesUsedInFix} hint="satellitesUsedInFix" />
        </div>
        <ul className="space-y-2 rounded-lg border border-border bg-card p-3">
          {[...byConstellation.entries()].map(([c, e]) => (
            <li key={c} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{c}</div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${cn0Bg(40)}`}
                    style={{ width: `${(e.u / Math.max(1, e.v)) * 100}%` }}
                  />
                </div>
              </div>
              <span className="numeric shrink-0 text-sm text-muted-foreground">
                {e.u}/{e.v}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Quick actions">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction to="/satellites" icon={Satellite} label={t("nav_satellites")} />
          <QuickAction to="/sky" icon={Radar} label={t("nav_sky")} />
          <QuickAction to="/share" icon={QrCode} label={t("nav_share")} />
          <QuickAction to="/navigate" icon={Navigation} label={t("nav_navigate")} />
        </div>
      </Section>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof Satellite;
  label: string;
}) {
  return (
    <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3">
      <Link to={to}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate text-xs">{label}</span>
      </Link>
    </Button>
  );
}
