import { Lightbulb, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import type { Recommendation } from "../lib/mockAudit";

const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
  high: { color: "text-destructive bg-destructive/10 border-destructive/20", label: "High" },
  medium: { color: "text-warning bg-warning/10 border-warning/20", label: "Medium" },
  low: { color: "text-foreground/60 bg-muted border-border/50", label: "Low" },
};

export default function AIRecommendations({ items }: { items: Recommendation[] }) {
  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent shrink-0">
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">AI Recommendations</h3>
      </div>

      <p className="text-sm text-foreground/70 mb-3">
        Vendor can be approved. Recommended actions:
      </p>

      <ul className="flex flex-col gap-2">
        {items.map((rec, i) => {
          const cfg = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.low;
          return (
            <li
              key={i}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border bg-surface transition-all duration-150 hover:shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ArrowRight className="w-3.5 h-3.5 text-foreground/40 shrink-0" aria-hidden="true" />
                <span className="text-sm text-foreground/80">{rec.action}</span>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                {cfg.label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}