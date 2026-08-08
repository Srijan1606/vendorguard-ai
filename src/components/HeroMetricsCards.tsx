import { useEffect, useRef, useState } from "react";
import { ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { AuditResult } from "../lib/mockAudit";

interface Props {
  result: AuditResult | null;
  auditCount: number;
}

function AnimatedNumber({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(value / 40));
    ref.current = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(ref.current);
      } else {
        setDisplay(start);
      }
    }, 20);
    return () => clearInterval(ref.current);
  }, [value]);

  return (
    <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
      {display}
      {label}
    </span>
  );
}

export default function HeroMetricsCards({ result, auditCount }: Props) {
  const avgRisk = result ? result.riskScore : 0;
  const compliantPct = result ? Math.min(100, Math.max(0, result.riskScore + 10)) : 0;
  const criticalPct = result ? Math.max(0, 100 - result.riskScore - 20) : 0;

  const metrics = [
    {
      icon: <Activity className="w-5 h-5" aria-hidden="true" />,
      label: "Audits Completed Today",
      value: auditCount,
      suffix: "",
      trend: "+3",
      trendUp: true,
      color: "text-primary bg-primary/10",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" aria-hidden="true" />,
      label: "Average Vendor Risk Score",
      value: avgRisk,
      suffix: "",
      trend: result ? (result.riskStatus === "Compliant" || result.riskStatus === "Low Risk" ? "+5%" : "-2%") : "—",
      trendUp: result ? (result.riskStatus === "Compliant" || result.riskStatus === "Low Risk") : true,
      color: "text-success bg-success/10",
    },
    {
      icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
      label: "Compliant Vendors",
      value: compliantPct,
      suffix: "%",
      trend: "+8%",
      trendUp: true,
      color: "text-secondary bg-secondary/10",
    },
    {
      icon: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
      label: "Critical Vendors",
      value: criticalPct,
      suffix: "%",
      trend: "-1%",
      trendUp: false,
      color: "text-destructive bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="glow-hover rounded-xl border border-border bg-surface shadow-sm p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${m.color}`}>
              {m.icon}
            </div>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                m.trendUp ? "text-success" : "text-destructive"
              }`}
            >
              {m.trendUp ? (
                <TrendingUp className="w-3 h-3" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-3 h-3" aria-hidden="true" />
              )}
              {m.trend}
            </span>
          </div>
          <AnimatedNumber value={m.value} label={m.suffix} />
          <p className="text-xs text-foreground/50 mt-1 font-medium">{m.label}</p>
        </div>
      ))}
    </div>
  );
}