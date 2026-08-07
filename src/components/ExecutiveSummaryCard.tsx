import { AlertTriangle, ShieldAlert, ShieldCheck, Sparkles, ThumbsUp, Library, FileText, Clock } from "lucide-react";
import type { AuditResult } from "../lib/mockAudit";
import RiskGauge from "./RiskGauge";
import Badge from "./Badge";

const STATUS_CONFIG: Record<AuditResult["riskStatus"], { tone: "pass" | "warning" | "fail" | "info" | "neutral"; icon: React.ReactNode }> = {
  Compliant: { tone: "pass", icon: <ShieldCheck className="w-4 h-4" /> },
  "Low Risk": { tone: "info", icon: <ThumbsUp className="w-4 h-4" /> },
  Caution: { tone: "warning", icon: <AlertTriangle className="w-4 h-4" /> },
  "High Risk": { tone: "fail", icon: <ShieldAlert className="w-4 h-4" /> },
  Critical: { tone: "fail", icon: <ShieldAlert className="w-4 h-4" /> },
};

export default function ExecutiveSummaryCard({ result }: { result: AuditResult }) {
  const cfg = STATUS_CONFIG[result.riskStatus];

  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <RiskGauge score={result.riskScore} status={result.riskStatus} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {result.vendorName}
            </h2>
            <Badge tone={cfg.tone} icon={cfg.icon}>
              {result.riskStatus}
            </Badge>
          </div>
          <p className="text-sm text-foreground/50 mb-1">{result.vendorDomain}</p>

          {/* AI Executive Summary */}
          <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-primary/[0.03] border border-primary/10">
            <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              {result.executiveSummary}
            </p>
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-foreground/50">
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
              AI Confidence: {result.aiConfidence}%
            </span>
            <span className="inline-flex items-center gap-1">
              <Library className="w-3.5 h-3.5" aria-hidden="true" />
              Sources: {result.sourcesCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Docs Parsed: {result.docsParsed}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {new Date(result.generatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}