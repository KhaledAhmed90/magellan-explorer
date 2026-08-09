import { createFileRoute } from "@tanstack/react-router";
import { useMagellan } from "@/lib/magellan/store";
import { PageHeader } from "@/components/magellan/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Magellan" },
      { name: "description", content: "Language, theme and GNSS data-source settings for Magellan." },
      { property: "og:title", content: "Settings — Magellan" },
      { property: "og:description", content: "Appearance, language and data source." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang, theme, setTheme, snapshot, t } = useMagellan();
  return (
    <div className="space-y-5">
      <PageHeader title={t("nav_settings")} description="Offline-first. No account, no cloud sync." />
      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <Row label={t("language")}>
          <div className="flex gap-2">
            <Button size="sm" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")}>
              English
            </Button>
            <Button size="sm" variant={lang === "ar" ? "default" : "outline"} onClick={() => setLang("ar")}>
              العربية (RTL)
            </Button>
          </div>
        </Row>
        <Row label={t("theme")}>
          <div className="flex gap-2">
            <Button size="sm" variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
              Light
            </Button>
            <Button size="sm" variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
              Dark
            </Button>
          </div>
        </Row>
        <Row label="GNSS data source">
          <p className="text-sm text-muted-foreground">
            {snapshot.source} — simulated. The Android build uses AndroidGnssStatus via the native
            module; the provider is not switchable in the browser.
          </p>
        </Row>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-border pb-4 last:border-0 last:pb-0 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="label-eyebrow pt-1">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}