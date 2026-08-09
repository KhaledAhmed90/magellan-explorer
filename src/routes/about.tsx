import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/magellan/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Magellan" },
      {
        name: "description",
        content: "About the Magellan web prototype and its relationship to the Expo + React Native Android app.",
      },
      { property: "og:title", content: "About — Magellan" },
      { property: "og:description", content: "Scope, architecture and honesty rules of the Magellan prototype." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="About Magellan" description="Offline GNSS, satellite insight and local location sharing." />
      <div className="space-y-4 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed">
        <p>
          This site is a <strong>UX/UI prototype only</strong>. The production Magellan application
          is built with Expo and React Native for Android; nothing here replaces it.
        </p>
        <div>
          <h2 className="label-eyebrow">Production GNSS</h2>
          <p className="mt-1 text-muted-foreground">
            Android LocationManager, GnssStatus and GnssStatus.Callback exposed through an Expo
            module: satellitesVisible, satellitesUsedInFix, constellation, SVID, azimuth, elevation,
            C/N0 and usedInFix, plus carrierFrequency, basebandCn0DbHz, almanac and ephemeris where
            supported. Unsupported values are shown as Unavailable, never fabricated.
          </p>
        </div>
        <div>
          <h2 className="label-eyebrow">Architecture</h2>
          <p className="mt-1 text-muted-foreground">
            The browser uses a DemoGnssProvider behind the same GnssSnapshot interface that the
            Android native bridge implements. Sharing is modelled as LocationPayload (MGLN v1) →
            TransportManager → QR / Bluetooth / Wi-Fi Direct / local network / future transports.
          </p>
        </div>
        <div>
          <h2 className="label-eyebrow">Honesty rules</h2>
          <ul className="mt-1 list-disc space-y-1 ps-5 text-muted-foreground">
            <li>No invented satellite counts, C/N0, heading, accuracy or coordinates.</li>
            <li>Every simulated surface is labelled DEMO / SIMULATED.</li>
            <li>Native transports are never reported as connected from the browser.</li>
            <li>One versioned QR payload format for all transports.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}