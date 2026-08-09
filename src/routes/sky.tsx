import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader, cn0Class } from "@/components/magellan/primitives";
import { DemoBadge, SimulatedNotice } from "@/components/magellan/DemoBadge";
import { SkyView } from "@/components/magellan/SkyView";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sky")({
  head: () => ({
    meta: [
      { title: "Sky View — Magellan" },
      {
        name: "description",
        content:
          "Interactive polar sky plot of satellite azimuth and elevation with N/E/S/W orientation.",
      },
      { property: "og:title", content: "Sky View — Magellan" },
      { property: "og:description", content: "Polar satellite sky plot from azimuth and elevation." },
    ],
  }),
  component: SkyPage,
});

function SkyPage() {
  const { snapshot, t } = useMagellan();
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const constellations = ["ALL", ...new Set(snapshot.satellites.map((s) => s.constellation))];
  const sats = snapshot.satellites.filter((s) =>
    filter === "ALL" ? true : s.constellation === filter,
  );
  const selected = sats.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_sky")}
        description="Positions are plotted only from azimuth/elevation. No orbital positions are invented."
        actions={<DemoBadge label={t("simulated")} />}
      />
      <SimulatedNotice>
        Sky positions come from DemoGnssProvider. On Android the same plot is fed by real
        GnssStatus azimuth and elevation values.
      </SimulatedNotice>

      <div className="flex flex-wrap gap-2">
        {constellations.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full border border-border px-3 py-1 text-xs",
              filter === c ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <SkyView satellites={sats} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-primary" /> Used in fix
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border border-border bg-muted" /> Visible only
          </span>
          <span>Rings: 90° / 60° / 30° elevation</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="label-eyebrow">Selected satellite</h2>
        {selected ? (
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <div className="label-eyebrow">{t("constellation")}</div>
              <div>{selected.constellation}</div>
            </div>
            <div>
              <div className="label-eyebrow">{t("svid")}</div>
              <div className="numeric">{selected.svid}</div>
            </div>
            <div>
              <div className="label-eyebrow">{t("elevation")} / {t("azimuth")}</div>
              <div className="numeric">
                {selected.elevationDeg.toFixed(0)}° / {selected.azimuthDeg.toFixed(0)}°
              </div>
            </div>
            <div>
              <div className="label-eyebrow">{t("cn0")}</div>
              <div className={cn("numeric font-semibold", cn0Class(selected.cn0DbHz))}>
                {selected.cn0DbHz.toFixed(1)} dB-Hz
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Tap a satellite in the sky plot to inspect its values.
          </p>
        )}
      </div>
    </div>
  );
}