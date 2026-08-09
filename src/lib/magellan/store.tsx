import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DemoGnssProvider } from "./demo-gnss";
import { demoSnapshot } from "./demo-gnss";
import type { GnssSnapshot, HistoryEntry, Waypoint } from "./types";
import {
  loadHistory,
  loadWaypoints,
  saveHistory,
  saveWaypoints,
  SEED_WAYPOINTS,
  uid,
} from "./storage";
import { translate, type Lang, type TKey } from "./i18n";

export type HeadingSource = "course" | "compass";

interface MagellanState {
  snapshot: GnssSnapshot;
  /** heading actually used for the navigation arrow */
  heading: number | undefined;
  headingSource: HeadingSource | "unavailable";
  waypoints: Waypoint[];
  addWaypoint: (w: Omit<Waypoint, "id" | "createdAt">) => Waypoint;
  updateWaypoint: (id: string, patch: Partial<Waypoint>) => void;
  deleteWaypoint: (id: string) => void;
  activeWaypointId: string | null;
  setActiveWaypointId: (id: string | null) => void;
  history: HistoryEntry[];
  addHistory: (e: Omit<HistoryEntry, "id" | "at">) => void;
  clearHistory: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  t: (k: TKey) => string;
}

const Ctx = createContext<MagellanState | null>(null);

export function MagellanProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<GnssSnapshot>(() => demoSnapshot(0));
  const [waypoints, setWaypoints] = useState<Waypoint[]>(SEED_WAYPOINTS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeWaypointId, setActiveWaypointId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Hydrate persisted prototype state after mount (avoids SSR mismatch).
  useEffect(() => {
    setWaypoints(loadWaypoints());
    setHistory(loadHistory());
    const l = window.localStorage.getItem("magellan.lang");
    if (l === "ar" || l === "en") setLang(l);
    const th = window.localStorage.getItem("magellan.theme");
    if (th === "light" || th === "dark") setTheme(th);
  }, []);

  useEffect(() => {
    const provider = new DemoGnssProvider(1000);
    return provider.subscribe(setSnapshot);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("magellan.theme", theme);
    window.localStorage.setItem("magellan.lang", lang);
  }, [theme, lang]);

  const persistWaypoints = useCallback((next: Waypoint[]) => {
    setWaypoints(next);
    saveWaypoints(next);
  }, []);

  const value = useMemo<MagellanState>(() => {
    // Course bearing while moving; compass while effectively stationary.
    const moving = (snapshot.speedMps ?? 0) > 0.7;
    const heading = moving ? snapshot.courseBearingDeg : snapshot.compassHeadingDeg;
    const headingSource: MagellanState["headingSource"] =
      heading === undefined ? "unavailable" : moving ? "course" : "compass";

    return {
      snapshot,
      heading,
      headingSource,
      waypoints,
      addWaypoint: (w) => {
        const wp: Waypoint = { ...w, id: uid(), createdAt: Date.now() };
        persistWaypoints([wp, ...waypoints]);
        return wp;
      },
      updateWaypoint: (id, patch) =>
        persistWaypoints(waypoints.map((w) => (w.id === id ? { ...w, ...patch } : w))),
      deleteWaypoint: (id) => persistWaypoints(waypoints.filter((w) => w.id !== id)),
      activeWaypointId,
      setActiveWaypointId,
      history,
      addHistory: (e) => {
        const next = [{ ...e, id: uid(), at: Date.now() }, ...history].slice(0, 60);
        setHistory(next);
        saveHistory(next);
      },
      clearHistory: () => {
        setHistory([]);
        saveHistory([]);
      },
      lang,
      setLang,
      theme,
      setTheme,
      t: (k) => translate(lang, k),
    };
  }, [snapshot, waypoints, history, activeWaypointId, lang, theme, persistWaypoints]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMagellan(): MagellanState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMagellan must be used inside MagellanProvider");
  return ctx;
}