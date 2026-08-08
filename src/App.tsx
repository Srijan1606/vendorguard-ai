import { useState, useCallback } from "react";
import Header from "./components/Header";
import AuditSearchBar, { type AuditOptions } from "./components/AuditSearchBar";
import HeroMetricsCards from "./components/HeroMetricsCards";
import AuditLoadingScreen from "./components/AuditLoadingScreen";
import ExecutiveSummaryCard from "./components/ExecutiveSummaryCard";
import ResultsActions from "./components/ResultsActions";
import AIReasoningPanel from "./components/AIReasoningPanel";
import RiskBreakdownBars from "./components/RiskBreakdownBars";
import ComplianceChecklist from "./components/ComplianceChecklist";
import VendorProfileCard from "./components/VendorProfileCard";
import EvidenceExplorer from "./components/EvidenceExplorer";
import AuditLogTable from "./components/AuditLogTable";
import AIChatAssistant from "./components/AIChatAssistant";
import AIRecommendations from "./components/AIRecommendations";
import SourceQualityPanel from "./components/SourceQualityPanel";
import BreakdownCards from "./components/BreakdownCards";
import { generateAuditResult, type AuditResult } from "./lib/mockAudit";
import { ShieldCheck, Search, BarChart3, Sparkles, Zap, Brain } from "lucide-react";

export default function App() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [auditCount, setAuditCount] = useState(0);

  const handleRunAudit = useCallback((vendor: string, options: AuditOptions, simulateFailure?: boolean) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate staged audit processing
    window.setTimeout(() => {
      setIsLoading(false);

      if (simulateFailure) {
        setResult(null);
        setErrorMessage(
          `Unable to verify "${vendor}". We couldn't find enough public compliance data to run an audit — try entering the vendor's full domain instead.`
        );
        return;
      }

      try {
        const audit = generateAuditResult(vendor, options);
        setResult(audit);
        setAuditCount((c) => c + 1);
      } catch {
        setResult(null);
        setErrorMessage("Something went wrong while generating the audit. Please try again in a moment.");
      }
    }, 4000); // Longer delay to show the loading experience
  }, []);

  const handleClearResult = useCallback(() => {
    setResult(null);
    setErrorMessage(null);
  }, []);

  const showEmpty = !isLoading && !errorMessage && !result;

  return (
    <div className="min-h-screen bg-background">
      <Header onNewAudit={handleClearResult} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Hero Metrics — always visible once audits exist */}
        <HeroMetricsCards result={result} auditCount={auditCount} />

        {/* Search Bar */}
        <AuditSearchBar onRunAudit={handleRunAudit} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && <AuditLoadingScreen />}

        {/* Error State */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:p-6 flex items-start gap-3"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10 text-destructive shrink-0">
              <Zap className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive mb-1">Audit Failed</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
              className="cursor-pointer shrink-0 text-foreground/40 hover:text-foreground/70 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Empty State */}
        {showEmpty && (
          <section className="rounded-xl border border-border bg-surface shadow-sm py-16 sm:py-20 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mt-2">
              Ready to analyze any SaaS vendor
            </h2>
            <p className="text-sm text-foreground/50 max-w-md leading-relaxed px-4">
              Review Privacy Policies, Security Certifications, Breach History, and Compliance Documentation in one unified dashboard.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-xl px-4">
              {[
                { icon: <Search className="w-4 h-4" />, label: "Privacy Policy" },
                { icon: <ShieldCheck className="w-4 h-4" />, label: "Security Certs" },
                { icon: <BarChart3 className="w-4 h-4" />, label: "Risk Analysis" },
                { icon: <Brain className="w-4 h-4" />, label: "AI Insights" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-3"
                >
                  <span className="text-primary">{f.icon}</span>
                  <span className="text-xs font-medium text-foreground/60">{f.label}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-foreground/40 mt-2">
              Enter a vendor name above and click <strong className="text-accent">Run Compliance Audit</strong>
            </p>
          </section>
        )}

        {/* Results Dashboard */}
        {result && !isLoading && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            {/* Top row: title + actions */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                Audit Results
              </h2>
              <ResultsActions result={result} />
            </div>

            {/* Executive Summary */}
            <ExecutiveSummaryCard result={result} />

            {/* Breakdown: Privacy, Certifications, Breach History */}
            <BreakdownCards result={result} />

            {/* AI Reasoning + Risk Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AIReasoningPanel result={result} />
              <RiskBreakdownBars result={result} />
            </div>

            {/* Compliance Checklist + Vendor Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ComplianceChecklist items={result.complianceChecklist} />
              <VendorProfileCard profile={result.vendorProfile} />
            </div>

            {/* Evidence Explorer + Source Citations */}
            <EvidenceExplorer sources={result.evidenceSources} />
            <AuditLogTable result={result} />

            {/* AI Recommendations + Source Quality */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AIRecommendations items={result.recommendations} />
              <SourceQualityPanel sources={result.sourceQuality} />
            </div>

            {/* Re-run button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                New Audit
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
}