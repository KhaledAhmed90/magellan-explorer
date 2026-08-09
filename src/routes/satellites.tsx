import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader, Stat, cn0Class } from "@/components/magellan/primitives";
import { DemoBadge, SimulatedNotice } from "@/components/magellan/DemoBadge";
import type { SatelliteInfo } from "@/lib/magellan/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/satellites")({
  head: () => ({
    meta: [
      { title: "Satellites — Magellan" },
      {
        name: "description",
        content:
          "Per-satellite GNSS list with constellation, SVID, elevation, azimuth, C/N0 and used-in-fix flags.",
      },
      { property: "og:title", content: "Satellites — Magellan" },
      {
        property: "og:description",
        content: "GPS, Galileo, GLONASS, BeiDou, QZSS and SBAS satellite detail.",
      },
    ],
  }),
  component: SatellitesPage,
});

function fmt(v: number | undefined, digits = 1, unit = "") {
  return v === undefined ? "Unavailable" : `${v.toFixed(digits)}${unit}`;
}

function SatellitesPage() {
  const { snapshot, t } = useMagellan();
  const [filter, setFilter] = useState<string>("ALL");
  const [usedOnly, setUsedOnly] = useState(false);
  const [selected, setSelected] = useState<SatelliteInfo | null>(null);

  const constellations = useMemo(
    () => ["ALL", ...new Set(snapshot.satellites.map((s) => s.constellation))],
    [snapshot.satellites],
  );

  const rows = snapshot.satellites
    .filter((s) => (filter === "ALL" ? true : s.constellation === filter))
    .filter((s) => (usedOnly ? s.usedInFix : true))
    .sort((a, b) => b.cn0DbHz - a.cn0DbHz);

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_satellites")}
        description="Every field mirrors android.location.GnssStatus. Unsupported fields render as Unavailable."
        actions={<DemoBadge label={t("simulated")} />}
      />
      <SimulatedNotice />

      <div className="grid grid-cols-2 gap-3">
        <Stat label={t("visible")} value={snapshot.satellitesVisible} />
        <Stat label={t("used")} value={snapshot.satellitesUsedInFix} />
      </div>

      <div className="flex flex-wrap gap-2">
        {constellations.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full border border-border px-3 py-1 text-xs transition-colors",
              filter === c ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => setUsedOnly((v) => !v)}
          className={cn(
            "rounded-full border border-border px-3 py-1 text-xs transition-colors",
            usedOnly ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
          )}
        >
          Used in fix only
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[520px] text-sm">
          <caption className="sr-only">Simulated satellite list</caption>
          <thead>
            <tr className="border-b border-border text-left">
              <th className="label-eyebrow px-3 py-2">{t("constellation")}</th>
              <th className="label-eyebrow px-3 py-2">{t("svid")}</th>
              <th className="label-eyebrow px-3 py-2">{t("elevation")}</th>
              <th className="label-eyebrow px-3 py-2">{t("azimuth")}</th>
              <th className="label-eyebrow px-3 py-2">{t("cn0")}</th>
              <th className="label-eyebrow px-3 py-2">{t("used")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr
                key={s.id}
                onClick={() => setSelected(s)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(s)}
                className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-secondary/60"
              >
                <td className="px-3 py-2">{s.constellation}</td>
                <td className="numeric px-3 py-2">{s.svid}</td>
                <td className="numeric px-3 py-2">{s.elevationDeg.toFixed(0)}°</td>
                <td className="numeric px-3 py-2">{s.azimuthDeg.toFixed(0)}°</td>
                <td className={cn("numeric px-3 py-2 font-semibold", cn0Class(s.cn0DbHz))}>
                  {s.cn0DbHz.toFixed(1)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px]",
                      s.usedInFix
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {s.usedInFix ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected?.constellation} · SVID {selected?.svid}
              <DemoBadge label="SIMULATED" />
            </DialogTitle>
          </DialogHeader>
          {selected ? (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Elevation" value={fmt(selected.elevationDeg, 1, "°")} />
              <Field label="Azimuth" value={fmt(selected.azimuthDeg, 1, "°")} />
              <Field label="C/N0" value={fmt(selected.cn0DbHz, 1, " dB-Hz")} />
              <Field label="Used in fix" value={selected.usedInFix ? "Yes" : "No"} />
              <Field
                label="Carrier frequency"
                value={
                  selected.carrierFrequencyHz
                    ? `${(selected.carrierFrequencyHz / 1e6).toFixed(3)} MHz`
                    : "Unavailable"
                }
              />
              <Field
                label="Baseband C/N0"
                value={fmt(selected.basebandCn0DbHz, 1, " dB-Hz")}
              />
              <Field
                label="Almanac"
                value={selected.hasAlmanac === undefined ? "Unavailable" : selected.hasAlmanac ? "Yes" : "No"}
              />
              <Field
                label="Ephemeris"
                value={selected.hasEphemeris === undefined ? "Unavailable" : selected.hasEphemeris ? "Yes" : "No"}
              />
            </dl>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Production reads these from GnssStatus.Callback; optional fields depend on
            hasCarrierFrequencyHz() / hasBasebandCn0DbHz() and the device API level.
          </p>
          <Button variant="outline" onClick={() => setSelected(null)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-2">
      <dt className="label-eyebrow">{label}</dt>
      <dd className="numeric mt-0.5">{value}</dd>
    </div>
  );
}