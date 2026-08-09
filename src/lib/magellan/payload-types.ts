export interface LocationPayloadV1 {
  t: "MGLN";
  v: 1;
  lat: number;
  lon: number;
  alt?: number | undefined;
  acc?: number | undefined;
  ts: number;
  name?: string | undefined;
  note?: string | undefined;
  src: "live" | "waypoint" | "manual" | "demo";
}