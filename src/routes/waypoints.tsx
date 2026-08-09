import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { MapPin, Pencil, Trash2, Navigation } from "lucide-react";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader } from "@/components/magellan/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCoord, distanceMeters, formatDistance } from "@/lib/magellan/geo";
import type { Waypoint } from "@/lib/magellan/types";

export const Route = createFileRoute("/waypoints")({
  head: () => ({
    meta: [
      { title: "Waypoints — Magellan" },
      {
        name: "description",
        content: "Create, edit, delete and persist Magellan waypoints, then open navigation to them.",
      },
      { property: "og:title", content: "Waypoints — Magellan" },
      { property: "og:description", content: "Offline waypoint management for Magellan." },
    ],
  }),
  component: WaypointsPage,
});

const empty = { name: "", lat: "", lon: "", note: "" };

function WaypointsPage() {
  const { waypoints, addWaypoint, updateWaypoint, deleteWaypoint, setActiveWaypointId, snapshot, t } =
    useMagellan();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lat = Number(form.lat);
    const lon = Number(form.lon);
    if (!form.name.trim()) return toast.error("Name is required");
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return toast.error("Latitude must be −90…90");
    if (!Number.isFinite(lon) || lon < -180 || lon > 180)
      return toast.error("Longitude must be −180…180");
    if (editing) {
      updateWaypoint(editing, { name: form.name.trim(), latitude: lat, longitude: lon, note: form.note });
      toast.success("Waypoint updated");
    } else {
      addWaypoint({ name: form.name.trim(), latitude: lat, longitude: lon, note: form.note });
      toast.success("Waypoint saved to this browser");
    }
    setForm(empty);
    setEditing(null);
  }

  function edit(w: Waypoint) {
    setEditing(w.id);
    setForm({
      name: w.name,
      lat: String(w.latitude),
      lon: String(w.longitude),
      note: w.note ?? "",
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_waypoints")}
        description="Stored in browser localStorage for the prototype; on Android they live in the offline device store."
      />

      <form onSubmit={submit} className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="wname">Name</Label>
          <Input id="wname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wlat">Latitude</Label>
          <Input id="wlat" inputMode="decimal" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wlon">Longitude</Label>
          <Input id="wlon" inputMode="decimal" value={form.lon} onChange={(e) => setForm({ ...form, lon: e.target.value })} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="wnote">Note</Label>
          <Input id="wnote" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit">{editing ? "Save changes" : "Add waypoint"}</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setForm({
                ...form,
                lat: snapshot.latitude?.toFixed(6) ?? "",
                lon: snapshot.longitude?.toFixed(6) ?? "",
              })
            }
          >
            Use current demo position
          </Button>
          {editing ? (
            <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(empty); }}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <ul className="space-y-2">
        {waypoints.map((w) => {
          const d =
            snapshot.latitude !== undefined && snapshot.longitude !== undefined
              ? distanceMeters(snapshot.latitude, snapshot.longitude, w.latitude, w.longitude)
              : undefined;
          return (
            <li
              key={w.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{w.name}</p>
                  <p className="numeric truncate text-xs text-muted-foreground">
                    {formatCoord(w.latitude, w.longitude, 5)}
                    {d !== undefined ? ` · ${formatDistance(d)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Navigate to ${w.name}`}
                  onClick={() => {
                    setActiveWaypointId(w.id);
                    void navigate({ to: "/navigate" });
                  }}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label={`Edit ${w.name}`} onClick={() => edit(w)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${w.name}`}
                  onClick={() => {
                    deleteWaypoint(w.id);
                    toast.success("Waypoint deleted");
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          );
        })}
        {waypoints.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No waypoints yet.
          </li>
        ) : null}
      </ul>
    </div>
  );
}