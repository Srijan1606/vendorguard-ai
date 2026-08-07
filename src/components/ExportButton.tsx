import { useEffect, useRef, useState } from "react";
import { Download, FileJson, FileText, Check } from "lucide-react";

export default function ExportButton({ vendorName }: { vendorName: string }) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleExport(format: string) {
    setOpen(false);
    setConfirmed(format);
    window.setTimeout(() => setConfirmed(null), 2500);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/5 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        Download Audit Report
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-white shadow-lg py-1 z-30"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport("PDF")}
            className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
          >
            <FileText className="w-4 h-4 text-foreground/50" aria-hidden="true" />
            Export as PDF
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport("JSON")}
            className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
          >
            <FileJson className="w-4 h-4 text-foreground/50" aria-hidden="true" />
            Export as JSON
          </button>
        </div>
      )}

      {confirmed && (
        <div
          role="status"
          className="absolute right-0 mt-2 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs font-medium text-success shadow-md whitespace-nowrap z-30"
        >
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          {confirmed} report for {vendorName} is ready (demo — no file generated yet)
        </div>
      )}
    </div>
  );
}
