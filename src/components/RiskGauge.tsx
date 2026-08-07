import type { RiskStatus } from "../lib/mockAudit";

const STATUS_COLOR: Record<RiskStatus, string> = {
  Compliant: "var(--color-success)",
  "Low Risk": "var(--color-secondary)",
  Caution: "var(--color-warning)",
  "High Risk": "var(--color-destructive)",
  Critical: "oklch(0.6 0.25 20)",
};

export default function RiskGauge({ score, status }: { score: number; status: RiskStatus }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = STATUS_COLOR[status];

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0" role="img" aria-label={`Vendor risk score ${score} out of 100, status ${status}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 600ms ease-out, stroke 300ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
          {score}
        </span>
        <span className="text-xs text-foreground/50 font-medium">/ 100</span>
      </div>
    </div>
  );
}
