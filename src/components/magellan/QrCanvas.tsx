import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

/** Real, scannable QR generated in the browser from the versioned payload. */
export function QrCanvas({ value, size = 240 }: { value: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancelled = false;
    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#000000ff", light: "#ffffffff" },
    })
      .then(() => !cancelled && setError(null))
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "QR generation failed");
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl border border-border bg-white p-3">
        <canvas
          ref={ref}
          width={size}
          height={size}
          aria-label="Magellan location QR code"
          role="img"
        />
      </div>
      {error ? <p className="text-xs text-destructive">QR error: {error}</p> : null}
    </div>
  );
}