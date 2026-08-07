import { useState } from "react";
import Header from "./components/Header";
import AuditSearchBar, { type AuditOptions } from "./components/AuditSearchBar";
import ExecutiveSummaryCard from "./components/ExecutiveSummaryCard";
import BreakdownCards from "./components/BreakdownCards";
import AuditLogTable from "./components/AuditLogTable";
import ExportButton from "./components/ExportButton";
import { generateAuditResult, type AuditResult } from "./lib/mockAudit";
import { ShieldQuestion } from "lucide-react";

export default function App() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleRunAudit(vendor: string, options: AuditOptions) {
    setIsLoading(true);
    // Simulated audit processing delay — replace with a real backend call later.
    window.setTimeout(() => {
      setResult(generateAuditResult(vendor, options));
      setIsLoading(false);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        <AuditSearchBar onRunAudit={handleRunAudit} isLoading={isLoading} />

        {result ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                Audit Results
              </h2>
              <ExportButton vendorName={result.vendorName} />
            </div>

            <ExecutiveSummaryCard result={result} />
            <BreakdownCards result={result} />
            <AuditLogTable result={result} />
          </div>
        ) : (
          !isLoading && (
            <div className="rounded-xl border border-dashed border-border bg-white/50 py-16 sm:py-24 text-center flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <ShieldQuestion className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground">No audit run yet</p>
              <p className="text-sm text-foreground/50 max-w-sm">
                Enter a vendor name or domain above and click "Run Compliance Audit" to see
                a full risk breakdown here.
              </p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
