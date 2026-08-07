import { useState } from "react";
import Header from "./components/Header";
import AuditSearchBar, { type AuditOptions } from "./components/AuditSearchBar";
import ExecutiveSummaryCard from "./components/ExecutiveSummaryCard";
import BreakdownCards from "./components/BreakdownCards";
import AuditLogTable from "./components/AuditLogTable";
import ExportButton from "./components/ExportButton";
import { generateAuditResult, type AuditResult } from "./lib/mockAudit";
import { ShieldQuestion, AlertTriangle, X } from "lucide-react";

export default function App() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleRunAudit(vendor: string, options: AuditOptions, simulateFailure?: boolean) {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulated audit processing delay — replace with a real backend call later.
    window.setTimeout(() => {
      setIsLoading(false);

      if (simulateFailure) {
        setResult(null);
        setErrorMessage(
          `Unable to verify "${vendor}". We couldn't find enough public compliance data to run an audit — try entering the vendor's full domain (e.g. "example.com") instead.`
        );
        return;
      }

      try {
        setResult(generateAuditResult(vendor, options));
      } catch {
        setResult(null);
        setErrorMessage(
          "Something went wrong while generating the audit. Please try again in a moment."
        );
      }
    }, 900);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        <AuditSearchBar onRunAudit={handleRunAudit} isLoading={isLoading} />

        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10 text-destructive shrink-0">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed flex-1">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
              className="cursor-pointer shrink-0 text-foreground/40 hover:text-foreground/70 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {result ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                Audit Results
              </h2>
              <ExportButton result={result} />
            </div>

            <ExecutiveSummaryCard result={result} />
            <BreakdownCards result={result} />
            <AuditLogTable result={result} />
          </div>
        ) : (
          !isLoading &&
          !errorMessage && (
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
