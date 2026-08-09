import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader } from "@/components/magellan/primitives";
import { TRANSPORTS, TRANSPORT_STATE_LABEL } from "@/lib/magellan/transports";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/transports")({
  head: () => ({
    meta: [
      { title: "Transports — Magellan" },
      {
        name: "description",
        content:
          "Transport abstraction states: Supported, Available, Connected, Ready, Permission required and Unavailable.",
      },
      { property: "og:title", content: "Transports — Magellan" },
      { property: "og:description", content: "LocationPayload → TransportManager → QR, Bluetooth, Wi-Fi Direct, LAN." },
    ],
  }),
  component: TransportsPage,
});

function TransportsPage() {
  const { t } = useMagellan();
  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_transports")}
        description="LocationPayload → TransportManager → QR / Bluetooth / Wi-Fi Direct / Local network."
      />
      <p className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
        Only QR can transfer a payload from a browser. Native transports report their real
        capability state and are never shown as connected here.
      </p>
      <ul className="space-y-2">
        {TRANSPORTS.map((tr) => (
          <li key={tr.id} className="rounded-lg border border-border bg-card p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{tr.name}</p>
                <p className="text-xs text-muted-foreground">{tr.detail}</p>
              </div>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px]">
                {TRANSPORT_STATE_LABEL[tr.state]}
              </span>
            </div>
            <div className="mt-3">
              <Button
                size="sm"
                variant={tr.worksInBrowser ? "default" : "outline"}
                onClick={() =>
                  tr.worksInBrowser
                    ? toast.success("QR transport ready — open Share location")
                    : toast.error(`${tr.name} is native-only`, {
                        description: "This web prototype cannot open the native transport.",
                      })
                }
              >
                {tr.worksInBrowser ? "Use transport" : "Why unavailable?"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}