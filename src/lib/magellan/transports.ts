import type { TransportDescriptor, TransportId, TransportState } from "./types";
import type { LocationPayloadV1 } from "./payload-types";
import { encodeLocationPayload } from "./payload";

/**
 * TransportManager — LocationPayload -> TransportManager -> QR / BT / Wi-Fi Direct / LAN.
 * In this browser prototype only the QR transport can actually deliver a payload.
 * Native transports report their honest capability state and NEVER simulate success.
 */

export const TRANSPORTS: TransportDescriptor[] = [
  {
    id: "qr",
    name: "QR code",
    detail: "Offline visual transfer. Fully functional in this prototype.",
    state: "READY",
    worksInBrowser: true,
  },
  {
    id: "bluetooth",
    name: "Bluetooth",
    detail: "Android BLE GATT transfer. Requires native module + runtime permissions.",
    state: "PERMISSION_REQUIRED",
    worksInBrowser: false,
  },
  {
    id: "wifi-direct",
    name: "Wi-Fi Direct",
    detail: "Android Wi-Fi P2P peer transfer. Native only.",
    state: "SUPPORTED",
    worksInBrowser: false,
  },
  {
    id: "local-network",
    name: "Local network",
    detail: "Same-LAN socket transfer with mDNS discovery. Native only.",
    state: "AVAILABLE",
    worksInBrowser: false,
  },
  {
    id: "nfc",
    name: "NFC",
    detail: "Planned transport. Not implemented on any platform yet.",
    state: "UNAVAILABLE",
    worksInBrowser: false,
  },
];

export const TRANSPORT_STATE_LABEL: Record<TransportState, string> = {
  SUPPORTED: "Supported",
  AVAILABLE: "Available",
  CONNECTED: "Connected",
  READY: "Ready",
  PERMISSION_REQUIRED: "Permission required",
  UNAVAILABLE: "Unavailable",
};

export type SendResult =
  | { ok: true; transport: TransportId; encoded: string }
  | { ok: false; transport: TransportId; reason: string };

export function getTransport(id: TransportId): TransportDescriptor {
  return TRANSPORTS.find((t) => t.id === id) ?? TRANSPORTS[0]!;
}

export function send(id: TransportId, payload: LocationPayloadV1): SendResult {
  const t = getTransport(id);
  if (!t.worksInBrowser) {
    return {
      ok: false,
      transport: id,
      reason: `${t.name} is a native Android transport. This web prototype cannot open it, so no transfer was performed.`,
    };
  }
  return { ok: true, transport: id, encoded: encodeLocationPayload(payload) };
}