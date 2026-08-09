import { createFileRoute } from "@tanstack/react-router";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader } from "@/components/magellan/primitives";
import { Button } from "@/components/ui/button";
import { formatCoord } from "@/lib/magellan/geo";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Magellan" },
      { name: "description", content: "Offline log of shared, received and navigated Magellan locations." },
      { property: "og:title", content: "History — Magellan" },
      { property: "og:description", content: "Local-only sharing history." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history, clearHistory, t } = useMagellan();
  return (
    <div className="space-y-5">
      <PageHeader
        title={t("nav_history")}
        description="Stored locally only. Nothing is uploaded."
        actions={
          history.length ? (
            <Button variant="outline" size="sm" onClick={clearHistory}>
              Clear
            </Button>
          ) : undefined
        }
      />
      <ul className="space-y-2">
        {history.map((h) => (
          <li key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-border bg-card p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{h.label}</p>
              <p className="numeric truncate text-xs text-muted-foreground">
                {formatCoord(h.latitude, h.longitude, 5)} · {h.transport}
              </p>
            </div>
            <div className="shrink-0 text-end text-xs text-muted-foreground">
              <div className="rounded-full border border-border px-2 py-0.5">{h.kind}</div>
              <div className="mt-1">{new Date(h.at).toLocaleString()}</div>
            </div>
          </li>
        ))}
        {history.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No entries yet. Share or receive a location to populate history.
          </li>
        ) : null}
      </ul>
    </div>
  );
}