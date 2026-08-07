import { BarChartHorizontal } from "lucide-react";

export default function SourceQualityPanel({ sources }: { sources: { name: string; score: number }[] }) {
  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10 text-success shrink-0">
          <BarChartHorizontal className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">Source Quality</h3>
      </div>

      <div className="flex flex-col gap-3">
        {sources.map((src) => (
          <div key={src.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground/70">{src.name}</span>
              <span className="text-xs font-semibold text-foreground tabular-nums">{src.score}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-700 ease-out"
                style={{ width: `${src.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}