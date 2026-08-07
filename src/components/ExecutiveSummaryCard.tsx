import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { AuditResult } from "../lib/mockAudit";
import RiskGauge from "./RiskGauge";
import Badge, { type BadgeTone } from "./Badge";

const STATUS_TONE: Record<AuditResult["riskStatus"], BadgeTone> = {
  Compliant: "pass",
  Caution: "warning",
  "High Risk": "fail",
};

const STATUS_ICON: Record<AuditResult["riskStatus"], React.ReactNode> = {
  Compliant: <ShieldCheck className="w-4 h-4" aria-hidden="true" />,
  Caution: <AlertTriangle className="w-4 h-4" aria-hidden="true" />,
  "High Risk": <ShieldAlert className="w-4 h-4" aria-hidden="true" />,
};

const STATUS_COPY: Record<AuditResult["riskStatus"], string> = {
  Compliant: "This vendor meets our baseline compliance requirements with no critical gaps detected.",
  Caution: "This vendor shows some compliance gaps that warrant follow-up before onboarding.",
  "High Risk": "This vendor has significant compliance gaps. Manual review is strongly recommended.",
};

export default function ExecutiveSummaryCard({ result }: { result: AuditResult }) {
  return (
    <section className="rounded-xl border border-border bg-white shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <RiskGauge score={result.riskScore} status={result.riskStatus} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 items-center">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {result.vendorName}
            </h2>
            <Badge tone={STATUS_TONE[result.riskStatus]} icon={STATUS_ICON[result.riskStatus]}>
              {result.riskStatus}
            </Badge>
          </div>
          <p className="text-sm text-foreground/50 mb-2">{result.vendorDomain}</p>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl">
            {STATUS_COPY[result.riskStatus]}
          </p>
          <p className="text-xs text-foreground/40 mt-3">
            Vendor Risk Score generated{" "}
            {new Date(result.generatedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
