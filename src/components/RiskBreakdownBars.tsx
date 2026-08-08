import { BarChart3 } from "lucide-react";
import type { AuditResult } from "../lib/mockAudit";

const CATEGORY_COLORS: Record<string, string> = {
  Privacy: "bg-primary",
  Security: "bg-secondary",
  Legal: "bg-accent",
  Compliance: "bg-success",
  Transparency: "bg-warning",
  Reliability: "bg-info",
  "Data Governance": "bg-[#8B5CF6]",
  "Third-party Risk": "bg-destructive",
};

export default function RiskBreakdownBars({ result }: { result: AuditResult }) {
  return (
    <section className="glow-hover rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent shrink-0">
          <BarChart3 className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">Risk Breakdown</h3>
      </div>

      <div className="flex flex-col gap-3">
        {result.riskBreakdown.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground/70">{cat.name}</span>
              <span className="text-xs font-semibold text-foreground tabular-nums">{cat.score}/100</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${CATEGORY_COLORS[cat.name] || "bg-primary"}`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}