import { useEffect, useRef, useState } from "react";
import { Download, FileJson, FileText, File, Check } from "lucide-react";
import { jsPDF } from "jspdf";
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
  const pg = result.privacyGovernance;
  lines.push(pg.aiSummary);
  lines.push(`  • Cookie Policy: ${pg.cookiePolicy.toUpperCase()}`);
  lines.push(`  • DPA Available: ${pg.dpaAvailable ? "YES" : "NO"}`);
  lines.push(`  • Subprocessor List Published: ${pg.subprocessorList ? "YES" : "NO"}`);
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

function buildPdfReport(result: AuditResult): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  function addSectionTitle(title: string) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 97, 143);
    doc.text(title, margin, y);
    y += 7;
    doc.setDrawColor(33, 97, 143);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 5;
  }

  function addBody(text: string, indent = 0) {
    const lines = doc.splitTextToSize(text, contentW - indent);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    lines.forEach((line: string) => {
      if (y > 285) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin + indent, y);
      y += 5;
    });
    y += 2;
  }

  function addKeyValue(label: string, value: string) {
    if (y > 280) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(label, margin, y);
    const labelW = doc.getTextWidth(label + "  ");
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + labelW, y);
    y += 6;
  }

  // ── Header ──
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 97, 143);
  doc.text("VendorGuard AI", margin, y);
  y += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Compliance Audit Report", margin, y);
  y += 12;

  // Separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Vendor Info ──
  addSectionTitle("Vendor Information");
  addKeyValue("Vendor:", `${result.vendorName} (${result.vendorDomain})`);
  addKeyValue("Industry:", result.vendorProfile.industry);
  addKeyValue("Headquarters:", result.vendorProfile.headquarters);
  addKeyValue("Report Generated:", new Date(result.generatedAt).toLocaleString());

  // ── Risk Score ──
  addSectionTitle("Overall Risk Assessment");
  const scoreColor = result.riskScore >= 70 ? [46, 160, 67] : result.riskScore >= 45 ? [234, 179, 8] : [220, 38, 38];
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${result.riskScore} / 100`, margin, y);
  y += 8;
  addKeyValue("Risk Status:", result.riskStatus);
  addKeyValue("AI Confidence:", `${result.aiConfidence}%`);
  addKeyValue("Sources Analyzed:", `${result.sourcesCount}`);
  y += 3;

  // ── Executive Summary ──
  addSectionTitle("Executive Summary");
  addBody(result.executiveSummary);

  // ── Positive & Negative Factors ──
  addSectionTitle("Key Findings");
  if (result.positiveFactors.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 160, 67);
    doc.text("Positive Factors:", margin, y);
    y += 5;
    result.positiveFactors.forEach((f) => {
      addBody(`✓  ${f.label}`, 4);
    });
    y += 2;
  }
  if (result.negativeFactors.length > 0) {
    if (y > 275) { doc.addPage(); y = margin; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text("Areas of Concern:", margin, y);
    y += 5;
    result.negativeFactors.forEach((f) => {
      addBody(`✗  ${f.label}`, 4);
    });
    y += 2;
  }

  // ── Privacy Governance ──
  addSectionTitle("Privacy Governance");
  const pg = result.privacyGovernance;
  addBody(pg.aiSummary);
  addKeyValue("Cookie Policy:", pg.cookiePolicy.toUpperCase());
  addKeyValue("DPA Available:", pg.dpaAvailable ? "YES" : "NO");
  addKeyValue("Subprocessor List:", pg.subprocessorList ? "Published" : "Not Published");

  // ── Certifications ──
  if (y > 265) { doc.addPage(); y = margin; }
  addSectionTitle("Security Certifications");
  result.certifications.forEach((c) => {
    addBody(`• ${c.name}: ${c.status} — ${c.detail}`);
  });

  // ── Breach History ──
  if (y > 265) { doc.addPage(); y = margin; }
  addSectionTitle("Breach & Incident History");
  addBody(result.breachHistory.summary);
  result.breachHistory.events.forEach((e) => {
    addBody(`• ${e.date} [${e.severity.toUpperCase()}] ${e.title} — ${e.description}`);
  });

  // ── Recommendations ──
  if (y > 265) { doc.addPage(); y = margin; }
  addSectionTitle("Recommendations");
  result.recommendations.forEach((r) => {
    addBody(`• [${r.priority.toUpperCase()}] ${r.action}`);
  });

  // ── Source Citations ──
  if (y > 265) { doc.addPage(); y = margin; }
  addSectionTitle("Source Citations");
  result.citations.forEach((c) => {
    addBody(`• (${c.category}) ${c.sourceLabel}`);
    addBody(`  "${c.snippet}"`, 4);
    y -= 2;
  });

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(
      `VendorGuard AI — ${result.vendorName} — Page ${i} of ${pageCount}`,
      margin,
      295
    );
  }

  return doc;
}

function downloadPdf(result: AuditResult) {
  const doc = buildPdfReport(result);
  const safeName = result.vendorDomain.replace(/[^a-z0-9.-]/gi, "_");
  doc.save(`${safeName}-vendorguard-audit.pdf`);
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

  function handleExport(format: "JSON" | "Text Summary" | "PDF") {
    setOpen(false);
    const safeName = result.vendorDomain.replace(/[^a-z0-9.-]/gi, "_");
    if (format === "JSON") {
      downloadFile(
        `${safeName}-vendorguard-audit.json`,
        JSON.stringify(result, null, 2),
        "application/json"
      );
    } else if (format === "PDF") {
      downloadPdf(result);
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
            onClick={() => handleExport("PDF")}
            className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
          >
            <File className="w-4 h-4 text-foreground/50" aria-hidden="true" />
            Export as PDF
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
