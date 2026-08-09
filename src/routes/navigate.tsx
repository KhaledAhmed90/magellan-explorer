import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation2 } from "lucide-react";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader, Stat } from "@/components/magellan/primitives";
import { DemoBadge, SimulatedNotice } from "@/components/magellan/DemoBadge";
import {
  bearingDeg,
  cardinal,
  distanceMeters,
  formatCoord,
  formatDistance,
  isArrived,
  normalizeRelativeBearing,
} from "@/lib/magellan/geo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/navigate")({
  head: () => ({
    meta: [
      { title: "Navigation — Magellan" },
      {
        name: "description",
        content:
          "In-app waypoint navigation: distance, target bearing, heading, relative bearing arrow and arrival detection.",
      },
      { property: "og:title", content: "Navigation — Magellan" },
      { property: "og:description", content: "Waypoint navigation with a real relative-bearing arrow." },
    ],
  }),
  component: NavigatePage,
});

function NavigatePage() {
  const {
    snapshot,
    waypoints,
    activeWaypointId,
    setActiveWaypointId,
    heading,
    headingSource,
    t,
  } = useMagellan();

  const target = waypoints.find((w) => w.id === activeWaypointId) ?? null;
  const hasFix = snapshot.latitude !== undefined && snapshot.longitude !== undefined;

  const distance =
    target && hasFix
      ? distanceMeters(snapshot.latitude!, snapshot.longitude!, target.latitude, target.longitude)
      : undefined;
  const targetBearing =
    target && hasFix
      ? bearingDeg(snapshot.latitude!, snapshot.longitude!, target.latitude, target.longitude)
      : undefined;
  const relative =
    targetBearing !== undefined && heading !== undefined
      ? normalizeRelativeBearing(targetBearing, heading)
      : undefined;
  const arrived = distance !== undefined && isArrived(distance, snapshot.accuracyM);
  const state = !target ? t("idle") : arrived ? t("arrived") : t("navigating");

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_navigate")}
        description="Arrow rotation = normalize(targetBearing − currentHeading) to −180…180."
        actions={<DemoBadge label={t("simulated")} />}
      />
      <SimulatedNotice>
        Heading is sensor-dependent and <strong>simulated</strong> here. Production uses course
        bearing while moving and the magnetometer while stationary; if neither is available the
        arrow is hidden rather than guessed.
      </SimulatedNotice>

      <div className="space-y-2 rounded-lg border border-border bg-card p-4">
        <h2 className="label-eyebrow">Target waypoint</h2>
        <div className="flex flex-wrap gap-2">
          {waypoints.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWaypointId(w.id)}
              className={cn(
                "rounded-full border border-border px-3 py-1 text-xs",
                activeWaypointId === w.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary",
              )}
            >
              {w.name}
            </button>
          ))}
          {activeWaypointId ? (
            <button
              onClick={() => setActiveWaypointId(null)}
              className="rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
            >
              Clear
            </button>
          ) : null}
          {waypoints.length === 0 ? (
            <Button asChild size="sm" variant="outline">
              <Link to="/waypoints">Create a waypoint</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="grid place-items-center rounded-lg border border-border bg-card p-6">
          <div className="relative grid h-56 w-56 place-items-center rounded-full border border-border">
            {["N", "E", "S", "W"].map((c, i) => (
              <span
                key={c}
                className="absolute text-xs font-semibold text-muted-foreground"
                style={{
                  transform: `rotate(${i * 90}deg) translateY(-6.6rem) rotate(${-i * 90}deg)`,
                }}
              >
                {c}
              </span>
            ))}
            {relative !== undefined ? (
              <Navigation2
                aria-label={`Direction arrow, ${relative.toFixed(0)} degrees relative`}
                className={cn(
                  "h-24 w-24 transition-transform duration-500",
                  arrived ? "text-signal-strong" : "text-primary",
                )}
                style={{ transform: `rotate(${relative}deg)` }}
                strokeWidth={1.5}
              />
            ) : (
              <span className="max-w-[10rem] text-center text-xs text-muted-foreground">
                {target
                  ? "Heading unavailable — arrow hidden instead of fabricated."
                  : t("idle")}
              </span>
            )}
          </div>
          <p
            className={cn(
              "mt-4 rounded-full px-3 py-1 text-sm font-medium",
              arrived ? "bg-signal-strong/15 text-signal-strong" : "bg-secondary",
            )}
          >
            {state}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label={t("distance")} value={distance !== undefined ? formatDistance(distance) : undefined} />
          <Stat
            label={t("targetBearing")}
            value={targetBearing?.toFixed(0)}
            unit={`° ${targetBearing !== undefined ? cardinal(targetBearing) : ""}`}
          />
          <Stat
            label={t("heading")}
            value={heading?.toFixed(0)}
            unit="°"
            hint={headingSource === "unavailable" ? "No source" : `Source: ${headingSource}`}
          />
          <Stat
            label={t("relativeBearing")}
            value={relative !== undefined ? `${relative > 0 ? "+" : ""}${relative.toFixed(0)}` : undefined}
            unit="°"
            hint="−180…180"
          />
          <Stat label={t("accuracy")} value={snapshot.accuracyM?.toFixed(1)} unit="m" />
          <Stat
            label="Arrival tolerance"
            value={Math.max(15, (snapshot.accuracyM ?? 15) * 1.5).toFixed(0)}
            unit="m"
            hint="max(15 m, accuracy × 1.5)"
          />
          <Stat
            className="col-span-2 sm:col-span-3"
            label="Waypoint coordinates"
            value={target ? formatCoord(target.latitude, target.longitude) : undefined}
            hint={target?.note ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}