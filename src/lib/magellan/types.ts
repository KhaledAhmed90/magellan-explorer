export type Constellation =
  | "GPS"
  | "GALILEO"
  | "GLONASS"
  | "BEIDOU"
  | "QZSS"
  | "SBAS"
  | "IRNSS"
  | "UNKNOWN";

/** Mirrors android.location.GnssStatus per-satellite fields.
 *  Fields that Android may not report are optional and must stay
 *  `undefined` (rendered as "unavailable") — never fabricated. */
export interface SatelliteInfo {
  id: string;
  constellation: Constellation;
  svid: number;
  /** degrees 0..360, from GnssStatus.getAzimuthDegrees */
  azimuthDeg: number;
  /** degrees 0..90, from GnssStatus.getElevationDegrees */
  elevationDeg: number;
  /** dB-Hz, from GnssStatus.getCn0DbHz */
  cn0DbHz: number;
  usedInFix: boolean;
  /** Hz — API 26+, hasCarrierFrequencyHz() */
  carrierFrequencyHz?: number | undefined;
  /** API 30+, hasBasebandCn0DbHz() */
  basebandCn0DbHz?: number | undefined;
  hasAlmanac?: boolean | undefined;
  hasEphemeris?: boolean | undefined;
}

export type FixQuality = "NO_FIX" | "ACQUIRING" | "2D" | "3D" | "DGNSS";

export interface GnssSnapshot {
  /** true only when values come from a real Android GnssStatus bridge */
  isNative: boolean;
  source: "DemoGnssProvider" | "AndroidGnssStatus";
  timestamp: number;
  latitude?: number | undefined;
  longitude?: number | undefined;
  altitudeM?: number | undefined;
  accuracyM?: number | undefined;
  speedMps?: number | undefined;
  /** course over ground, degrees */
  courseBearingDeg?: number | undefined;
  /** magnetometer / compass heading, degrees */
  compassHeadingDeg?: number | undefined;
  fixQuality: FixQuality;
  satellitesVisible: number;
  satellitesUsedInFix: number;
  satellites: SatelliteInfo[];
}

export interface Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitudeM?: number | undefined;
  note?: string | undefined;
  createdAt: number;
}

export type HistoryKind = "shared" | "received" | "navigated";

export interface HistoryEntry {
  id: string;
  kind: HistoryKind;
  transport: TransportId;
  label: string;
  latitude: number;
  longitude: number;
  accuracyM?: number | undefined;
  at: number;
}

export type TransportId = "qr" | "bluetooth" | "wifi-direct" | "local-network" | "nfc";

export type TransportState =
  | "SUPPORTED"
  | "AVAILABLE"
  | "CONNECTED"
  | "READY"
  | "PERMISSION_REQUIRED"
  | "UNAVAILABLE";

export interface TransportDescriptor {
  id: TransportId;
  name: string;
  detail: string;
  state: TransportState;
  /** true when this transport genuinely works inside the browser prototype */
  worksInBrowser: boolean;
}