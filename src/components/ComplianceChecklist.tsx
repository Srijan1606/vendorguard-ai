import { ClipboardCheck } from "lucide-react";
import type { ComplianceCheckItem } from "../lib/mockAudit";

export default function ComplianceChecklist({ items }: { items: ComplianceCheckItem[] }) {
  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10 text-success shrink-0">
          <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">Compliance Checklist</h3>
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item, i) => {
          return (
            <li key={i} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors duration-150">
              <div className="flex items-center gap-2.5">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  item.status === "pass"
                    ? "bg-success/10 text-success"
                    : item.status === "warn"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {item.status === "pass" ? "✓" : item.status === "warn" ? "!" : "✗"}
                </span>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <span className="text-xs text-foreground/50">{item.detail}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}