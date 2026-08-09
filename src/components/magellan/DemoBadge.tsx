import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoBadge({
  label = "SIMULATED",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-demo px-2 py-0.5 text-[10px] font-bold tracking-widest text-demo-foreground",
        className,
      )}
    >
      <FlaskConical className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

export function SimulatedNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="rounded-md border border-demo/50 bg-demo/10 px-3 py-2 text-xs leading-relaxed text-foreground">
      <span className="font-semibold">Demo data. </span>
      {children ??
        "This browser prototype uses DemoGnssProvider. In production these values come from Android LocationManager + GnssStatus. No value shown here is a real measurement."}
    </p>
  );
}