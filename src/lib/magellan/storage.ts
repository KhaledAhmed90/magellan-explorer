import type { HistoryEntry, Waypoint } from "./types";

const WP_KEY = "magellan.waypoints.v1";
const HIST_KEY = "magellan.history.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — prototype degrades to in-memory */
  }
}

export const SEED_WAYPOINTS: Waypoint[] = [
  {
    id: "wp-kingdom",
    name: "Kingdom Centre",
    latitude: 24.7114,
    longitude: 46.6745,
    altitudeM: 615,
    note: "Demo waypoint",
    createdAt: 1735689600000,
  },
  {
    id: "wp-camp",
    name: "Desert camp",
    latitude: 24.7419,
    longitude: 46.6231,
    note: "Offline meeting point",
    createdAt: 1735776000000,
  },
];

export const loadWaypoints = () => read<Waypoint[]>(WP_KEY, SEED_WAYPOINTS);
export const saveWaypoints = (w: Waypoint[]) => write(WP_KEY, w);
export const loadHistory = () => read<HistoryEntry[]>(HIST_KEY, []);
export const saveHistory = (h: HistoryEntry[]) => write(HIST_KEY, h);

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;