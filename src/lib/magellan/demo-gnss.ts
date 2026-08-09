import type { Constellation, GnssSnapshot, SatelliteInfo } from "./types";

/**
 * DemoGnssProvider — BROWSER PROTOTYPE ONLY.
 *
 * In production the identical `GnssSnapshot` shape is emitted by the Android
 * native module bridging LocationManager + GnssStatus.Callback. This provider
 * exists solely so native-only screens can be visualised in a browser, and
 * everything it emits is labelled SIMULATED in the UI.
 */

export interface GnssProvider {
  readonly isNative: boolean;
  subscribe(cb: (s: GnssSnapshot) => void): () => void;
}

const CONSTELLATION_PLAN: { c: Constellation; count: number; svidBase: number }[] = [
  { c: "GPS", count: 9, svidBase: 1 },
  { c: "GALILEO", count: 7, svidBase: 201 },
  { c: "GLONASS", count: 6, svidBase: 65 },
  { c: "BEIDOU", count: 6, svidBase: 201 },
  { c: "QZSS", count: 2, svidBase: 193 },
  { c: "SBAS", count: 2, svidBase: 120 },
];

const CARRIER_HZ: Partial<Record<Constellation, number>> = {
  GPS: 1575420000,
  GALILEO: 1575420000,
  GLONASS: 1602000000,
  BEIDOU: 1561098000,
  QZSS: 1575420000,
};

// Deterministic pseudo-random so the demo is stable between renders.
function rnd(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const DEMO_ORIGIN = { lat: 24.7136, lon: 46.6753 }; // Riyadh

function buildSatellites(t: number): SatelliteInfo[] {
  const out: SatelliteInfo[] = [];
  let i = 0;
  for (const plan of CONSTELLATION_PLAN) {
    for (let n = 0; n < plan.count; n++) {
      i++;
      const base = rnd(i);
      const elevation = Math.max(
        2,
        Math.min(88, 8 + base * 78 + Math.sin(t / 40000 + i) * 4),
      );
      const azimuth = (base * 360 + (t / 1000) * 0.12 * (1 + (i % 3))) % 360;
      const cn0 = Math.max(
        14,
        Math.min(52, 20 + elevation * 0.32 + Math.sin(t / 7000 + i * 2) * 4),
      );
      const used = cn0 > 27 && elevation > 12 && plan.c !== "SBAS";
      const carrier = CARRIER_HZ[plan.c];
      out.push({
        id: `${plan.c}-${plan.svidBase + n}`,
        constellation: plan.c,
        svid: plan.svidBase + n,
        azimuthDeg: azimuth,
        elevationDeg: elevation,
        cn0DbHz: cn0,
        usedInFix: used,
        // Fields Android may not report stay undefined for some satellites,
        // exactly as GnssStatus.has*() would indicate.
        ...(carrier !== undefined ? { carrierFrequencyHz: carrier } : {}),
        ...(i % 3 === 0 ? { basebandCn0DbHz: Math.max(10, cn0 - 4.5) } : {}),
        ...(i % 4 !== 0 ? { hasAlmanac: true, hasEphemeris: cn0 > 25 } : {}),
      });
    }
  }
  return out;
}

export function demoSnapshot(t = Date.now()): GnssSnapshot {
  const satellites = buildSatellites(t);
  const used = satellites.filter((s) => s.usedInFix);
  const drift = Math.sin(t / 30000) * 0.00035;
  return {
    isNative: false,
    source: "DemoGnssProvider",
    timestamp: t,
    latitude: DEMO_ORIGIN.lat + drift,
    longitude: DEMO_ORIGIN.lon + drift * 0.6,
    altitudeM: 612 + Math.sin(t / 21000) * 3,
    accuracyM: 3.2 + Math.abs(Math.sin(t / 17000)) * 2.4,
    speedMps: Math.max(0, 1.1 + Math.sin(t / 9000) * 1.1),
    courseBearingDeg: (68 + Math.sin(t / 23000) * 25 + 360) % 360,
    compassHeadingDeg: (72 + Math.sin(t / 11000) * 30 + 360) % 360,
    fixQuality: used.length >= 4 ? "3D" : used.length > 0 ? "2D" : "ACQUIRING",
    satellitesVisible: satellites.length,
    satellitesUsedInFix: used.length,
    satellites,
  };
}

export class DemoGnssProvider implements GnssProvider {
  readonly isNative = false;
  private intervalMs: number;

  constructor(intervalMs = 1000) {
    this.intervalMs = intervalMs;
  }

  subscribe(cb: (s: GnssSnapshot) => void) {
    cb(demoSnapshot());
    const id = setInterval(() => cb(demoSnapshot()), this.intervalMs);
    return () => clearInterval(id);
  }
}