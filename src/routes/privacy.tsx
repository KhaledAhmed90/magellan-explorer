import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/magellan/primitives";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Magellan" },
      {
        name: "description",
        content: "Magellan is offline-first: location data stays on the device and is shared only when you choose.",
      },
      { property: "og:title", content: "Privacy — Magellan" },
      { property: "og:description", content: "Offline-first privacy model, no accounts, no cloud." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Privacy" description="Offline-first by design." />
      <div className="space-y-4 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          GNSS status, satellites, waypoints, navigation, QR, history and settings all work without
          any cloud service. Magellan has no account system and no remote database.
        </p>
        <p>
          Location data leaves your device only when you deliberately share it through a transport
          you selected — a QR code you display, or a native peer transport on Android.
        </p>
        <p>
          In this web prototype, waypoints and history are kept in your browser&apos;s local storage
          and can be cleared at any time from the History and Waypoints screens.
        </p>
        <p>
          Android runtime permissions (location, camera, nearby devices) are requested only for the
          feature that needs them, and features degrade gracefully when a permission is denied.
        </p>
      </div>
    </div>
  );
}