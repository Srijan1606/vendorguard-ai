import { useEffect, useRef, useState } from "react";
import { Download, FileJson, FileText, Check } from "lucide-react";
import type { AuditResult } from "../lib/mockAudit";

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildTextReport(result: AuditResult): string {
  const lines: string[] = [];
  lines.push("VendorGuard AI — Compliance Audit Report");
  lines.push(`Vendor: ${result.vendorName} (${result.vendorDomain})`);
  lines.push(`Generated: ${new Date(result.generatedAt).toLocaleString()}`);
  lines.push("");
  lines.push(`Overall Risk Score: ${result.riskScore} / 100 — ${result.riskStatus}`);
  lines.push("");
  lines.push("--- Data Privacy & GDPR ---");
  lines.push(result.privacy.summary);
  result.privacy.flags.forEach((f) => lines.push(`  • [${f.level.toUpperCase()}] ${f.label}`));
  lines.push("");
  lines.push("--- Security Certifications ---");
  result.certifications.forEach((c) => lines.push(`  • ${c.name}: ${c.status} — ${c.detail}`));
  lines.push("");
  lines.push("--- Data Breach & Incident History ---");
  lines.push(result.breachHistory.summary);
  result.breachHistory.events.forEach((e) =>
    lines.push(`  • ${e.date} [${e.severity.toUpperCase()}] ${e.title} — ${e.description}`)
  );
  lines.push("");
  lines.push("--- Source Citations ---");
  result.citations.forEach((c) =>
    lines.push(`  • (${c.category}) ${c.sourceLabel} — ${c.sourceUrl}\n    "${c.snippet}"`)
  );
  return lines.join("\n");
}

export default function ExportButton({ result }: { result: AuditResult }) {
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

  function handleExport(format: "JSON" | "Text Summary") {
    setOpen(false);
    const safeName = result.vendorDomain.replace(/[^a-z0-9.-]/gi, "_");
    if (format === "JSON") {
      downloadFile(
        `${safeName}-vendorguard-audit.json`,
        JSON.stringify(result, null, 2),
        "application/json"
      );
    } else {
      downloadFile(`${safeName}-vendorguard-audit.txt`, buildTextReport(result), "text/plain");
    }
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
        className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-primary bg-surface px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/5 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        Download Audit Report
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-lg border glass-surface shadow-lg py-1 z-30"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport("JSON")}
            className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
          >
            <FileJson className="w-4 h-4 text-foreground/50" aria-hidden="true" />
            Export as JSON
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport("Text Summary")}
            className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
          >
            <FileText className="w-4 h-4 text-foreground/50" aria-hidden="true" />
            Export as Text Summary
          </button>
        </div>
      )}

      {confirmed && (
        <div
          role="status"
          aria-live="polite"
          className="absolute right-0 mt-2 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs font-medium text-success shadow-md whitespace-nowrap z-30"
        >
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          {confirmed} downloaded for {result.vendorName}
        </div>
      )}
    </div>
  );
}
