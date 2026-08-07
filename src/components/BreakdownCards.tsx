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
  Certified: "pass",
  "In Progress": "warning",
  "Not Certified": "fail",
};

function CardShell({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm p-5 flex flex-col h-full transition-shadow duration-200 hover:shadow-md">
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

export default function BreakdownCards({ result }: { result: AuditResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardShell icon={<Lock className="w-4 h-4" aria-hidden="true" />} title="Data Privacy & GDPR">
        <p className="text-sm text-foreground/70 leading-relaxed mb-3">{result.privacy.summary}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {result.privacy.flags.map((flag, i) => (
            <Badge key={i} tone={FLAG_TONE[flag.level]} icon={FLAG_ICON[flag.level]}>
              {flag.label}
            </Badge>
          ))}
        </div>
      </CardShell>

      <CardShell icon={<Award className="w-4 h-4" aria-hidden="true" />} title="Security Certifications">
        <ul className="flex flex-col gap-3">
          {result.certifications.map((cert) => (
            <li key={cert.name} className="border-b border-border last:border-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{cert.name}</span>
                <Badge tone={CERT_TONE[cert.status]}>{cert.status}</Badge>
              </div>
              <p className="text-xs text-foreground/60 leading-relaxed">{cert.detail}</p>
            </li>
          ))}
        </ul>
      </CardShell>

      <CardShell icon={<History className="w-4 h-4" aria-hidden="true" />} title="Data Breach & Incident History">
        <p className="text-sm text-foreground/70 leading-relaxed mb-3">{result.breachHistory.summary}</p>
        {result.breachHistory.events.length > 0 ? (
          <ul className="flex flex-col gap-3 mt-auto">
            {result.breachHistory.events.map((event, i) => (
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
        ) : null}
      </CardShell>
    </div>
  );
}
