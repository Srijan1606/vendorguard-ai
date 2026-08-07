import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export interface AuditOptions {
  includePrivacy: boolean;
  checkSoc2: boolean;
  scanBreach: boolean;
}

interface ToggleDef {
  key: keyof AuditOptions;
  label: string;
}

const TOGGLES: ToggleDef[] = [
  { key: "includePrivacy", label: "Include Privacy Policy" },
  { key: "checkSoc2", label: "Check SOC2 Status" },
  { key: "scanBreach", label: "Scan Breach History" },
];

interface PresetVendor {
  label: string;
  vendor: string;
  /** When true, this preset simulates an unverifiable vendor / failed lookup for demo purposes. */
  simulateFailure?: boolean;
}

const PRESET_VENDORS: PresetVendor[] = [
  { label: "Audit Slack", vendor: "Slack" },
  { label: "Audit Notion", vendor: "Notion" },
  { label: "Audit Unknown SaaS", vendor: "Unknown SaaS Co", simulateFailure: true },
];

export default function AuditSearchBar({
  onRunAudit,
  isLoading,
}: {
  onRunAudit: (vendor: string, options: AuditOptions, simulateFailure?: boolean) => void;
  isLoading: boolean;
}) {
  const [vendor, setVendor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<AuditOptions>({
    includePrivacy: true,
    checkSoc2: true,
    scanBreach: true,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = vendor.trim();
    if (!trimmed) {
      setError("Enter a vendor name or domain to run an audit.");
      return;
    }
    setError(null);
    onRunAudit(trimmed, options);
  }

  function toggle(key: keyof AuditOptions) {
    setOptions((o) => ({ ...o, [key]: !o[key] }));
  }

  function handlePreset(preset: PresetVendor) {
    setVendor(preset.vendor);
    setError(null);
    onRunAudit(preset.vendor, options, preset.simulateFailure);
  }

  return (
    <section className="rounded-xl border border-border bg-white shadow-sm p-4 sm:p-6">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="vendor-input" className="block text-sm font-medium text-foreground mb-2">
          Vendor Compliance Audit
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40"
              aria-hidden="true"
            />
            <input
              id="vendor-input"
              type="text"
              value={vendor}
              onChange={(e) => {
                setVendor(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter SaaS Vendor Name or Domain (e.g., Slack, Notion, Zoom)"
              aria-invalid={!!error}
              aria-describedby={error ? "vendor-input-error" : undefined}
              className="w-full rounded-lg border border-border bg-white pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Auditing…
              </>
            ) : (
              "Run Compliance Audit"
            )}
          </button>
        </div>
        {error && (
          <p id="vendor-input-error" role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {TOGGLES.map((t) => {
            const active = options[t.key];
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(t.key)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-foreground/60 hover:border-primary/30"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-foreground/50 mb-2">
            Demo / Preset Vendors — instant sample results, no live lookup
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_VENDORS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset)}
                disabled={isLoading}
                className="cursor-pointer rounded-full border border-secondary/30 bg-secondary/5 px-3.5 py-1.5 text-xs font-medium text-secondary transition-all duration-200 hover:bg-secondary/10 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}
