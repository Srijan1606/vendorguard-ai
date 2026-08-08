import { Brain, ThumbsUp, ThumbsDown } from "lucide-react";
import type { AuditResult } from "../lib/mockAudit";

export default function AIReasoningPanel({ result }: { result: AuditResult }) {
  return (
    <section className="glow-hover-violet rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10 text-secondary shrink-0">
          <Brain className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">Why this score?</h3>
        <span className="ml-auto text-xs text-foreground/40">
          AI Confidence: {result.aiConfidence}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Positive Factors */}
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-success mb-3 uppercase tracking-wide">
            <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
            Positive Factors
          </h4>
          <ul className="flex flex-col gap-2">
            {result.positiveFactors.map((f, i) => (
              <li
                key={i}
                className="animate-staggered stagger-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-success/5 border border-success/10"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">+</span>
                </span>
                <span className="text-xs text-foreground/80">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Negative Factors */}
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-destructive mb-3 uppercase tracking-wide">
            <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
            Negative Factors
          </h4>
          <ul className="flex flex-col gap-2">
            {result.negativeFactors.map((f, i) => (
              <li
                key={i}
                className="animate-staggered stagger-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/5 border border-destructive/10"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="w-5 h-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">−</span>
                </span>
                <span className="text-xs text-foreground/80">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}