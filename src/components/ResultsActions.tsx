import { FileText, Download, FileJson, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
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
  lines.push(`Overall Risk Score: ${result.riskScore} / 100 — ${result.riskStatus}`);
  lines.push("");
  lines.push(result.executiveSummary);
  lines.push("");
  lines.push("--- Recommendations ---");
  result.recommendations.forEach((r) => lines.push(`  • [${r.priority.toUpperCase()}] ${r.action}`));
  lines.push("");
  lines.push("--- Risk Breakdown ---");
  result.riskBreakdown.forEach((c) => lines.push(`  • ${c.name}: ${c.score}/100`));
  return lines.join("\n");
}

export default function ResultsActions({ result }: { result: AuditResult }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  function handleDownload(format: "JSON" | "Text") {
    const safeName = result.vendorDomain.replace(/[^a-z0-9.-]/gi, "_");
    if (format === "JSON") {
      downloadFile(`${safeName}-audit.json`, JSON.stringify(result, null, 2), "application/json");
    } else {
      downloadFile(`${safeName}-audit.txt`, buildTextReport(result), "text/plain");
    }
    setShowMenu(false);
  }

  function handleCopySummary() {
    navigator.clipboard.writeText(result.executiveSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const actions = [
    { icon: <FileJson className="w-4 h-4" />, label: "Download JSON", onClick: () => handleDownload("JSON") },
    { icon: <FileText className="w-4 h-4" />, label: "Download PDF", onClick: () => handleDownload("Text") },
    { icon: <Share2 className="w-4 h-4" />, label: "Export CSV", onClick: () => handleDownload("Text") },
    { icon: <Copy className="w-4 h-4" />, label: "Copy Summary", onClick: handleCopySummary },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Quick actions shown on larger screens */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleDownload("JSON")}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          JSON
        </button>
        <button
          type="button"
          onClick={() => handleDownload("Text")}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          PDF
        </button>
        <button
          type="button"
          onClick={handleCopySummary}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
        <button
          type="button"
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          Share
        </button>
      </div>

      {/* Mobile menu */}
      <div className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Export
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-surface shadow-lg py-1 z-30">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => { a.onClick(); setShowMenu(false); }}
                className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}