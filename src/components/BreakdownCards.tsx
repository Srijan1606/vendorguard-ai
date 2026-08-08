import type { ReactNode } from "react";
import { Lock, Award, History, Check, AlertTriangle, X, Minus } from "lucide-react";
import type { AuditResult, FlagLevel, CertStatus } from "../lib/mockAudit";
import Badge, { type BadgeTone } from "./Badge";

const FLAG_TONE: Record<FlagLevel, BadgeTone> = {
  pass: "pass",
  neutral: "neutral",
  warning: "warning",
  fail: "fail",
};

const FLAG_ICON: Record<FlagLevel, ReactNode> = {
  pass: <Check className="w-3.5 h-3.5" aria-hidden="true" />,
  neutral: <Minus className="w-3.5 h-3.5" aria-hidden="true" />,
  warning: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
  fail: <X className="w-3.5 h-3.5" aria-hidden="true" />,
};

const CERT_TONE: Record<CertStatus, BadgeTone> = {
  Verified: "pass",
  Unavailable: "fail",
  Expired: "warning",
  Unknown: "neutral",
};

function CardShell({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm p-5 flex flex-col h-full transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
          {icon}
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/** Derive privacy flag list from the PrivacyGovernance object. */
function privacyFlags(privacy: AuditResult["privacyGovernance"]): { label: string; level: FlagLevel }[] {
  const flags: { label: string; level: FlagLevel }[] = [];
  if (privacy.dpaAvailable) flags.push({ label: "DPA Available", level: "pass" });
  else flags.push({ label: "DPA Not Available", level: "fail" });
  if (privacy.subprocessorList) flags.push({ label: "Subprocessor List Published", level: "pass" });
  else flags.push({ label: "No Subprocessor List", level: "warning" });
  if (privacy.cookiePolicy === "pass") flags.push({ label: "Cookie Policy Compliant", level: "pass" });
  else if (privacy.cookiePolicy === "warning") flags.push({ label: "Cookie Policy Incomplete", level: "warning" });
  else flags.push({ label: "Cookie Policy Missing", level: "fail" });
  return flags;
}

export default function BreakdownCards({ result }: { result: AuditResult }) {
  const privacy = result?.privacyGovernance;
  const certs = result?.certifications ?? [];
  const breach = result?.breachHistory;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Data Privacy & GDPR */}
      <CardShell icon={<Lock className="w-4 h-4" aria-hidden="true" />} title="Data Privacy & GDPR">
        {privacy ? (
          <>
            <p className="text-sm text-foreground/70 leading-relaxed mb-3">{privacy.aiSummary}</p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {privacyFlags(privacy).map((flag, i) => (
                <Badge key={i} tone={FLAG_TONE[flag.level]} icon={FLAG_ICON[flag.level]}>
                  {flag.label}
                </Badge>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-foreground/50 italic">Privacy data unavailable for this vendor.</p>
        )}
      </CardShell>

      {/* Security Certifications */}
      <CardShell icon={<Award className="w-4 h-4" aria-hidden="true" />} title="Security Certifications">
        {certs.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {certs.map((cert) => (
              <li key={cert.name} className="border-b border-border last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{cert.name}</span>
                  <Badge tone={CERT_TONE[cert.status]}>{cert.status}</Badge>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed">{cert.detail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-foreground/50 italic">No certification data available for this vendor.</p>
        )}
      </CardShell>

      {/* Data Breach & Incident History */}
      <CardShell icon={<History className="w-4 h-4" aria-hidden="true" />} title="Data Breach & Incident History">
        {breach ? (
          <>
            <p className="text-sm text-foreground/70 leading-relaxed mb-3">{breach.summary}</p>
            {breach.events.length > 0 ? (
              <ul className="flex flex-col gap-3 mt-auto">
                {breach.events.map((event, i) => (
                  <li key={i} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{event.title}</span>
                      <Badge tone={FLAG_TONE[event.severity]} icon={FLAG_ICON[event.severity]}>
                        {event.date}
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground/60 leading-relaxed">{event.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground/50 italic mt-auto">No breach events found.</p>
            )}
          </>
        ) : (
          <p className="text-sm text-foreground/50 italic">Breach history data unavailable.</p>
        )}
      </CardShell>
    </div>
  );
}