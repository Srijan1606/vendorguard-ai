import { useEffect, useState } from "react";
import type { RiskStatus } from "../lib/mockAudit";

export default function RiskGauge({ score }: { score: number; status: RiskStatus }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const currentProgress = (animatedScore / 100) * circumference;

  // Animate score from 0 → target over 1.5s
  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(ease * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0" role="img" aria-label={`Vendor risk score ${score} out of 100, status ${status}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="risk-gauge-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-destructive)" />
            <stop offset="40%" stopColor="var(--color-warning)" />
            <stop offset="75%" stopColor="var(--color-secondary)" />
            <stop offset="100%" stopColor="var(--color-success)" />
          </linearGradient>
        </defs>

        {/* Dark track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="10"
        />

        {/* Gradient fill – color overridden by stroke for exact match */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#risk-gauge-fill)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - currentProgress}
          style={{ transition: "stroke-dashoffset 40ms linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
          {animatedScore}
        </span>
        <span className="text-xs text-foreground/50 font-medium">/ 100</span>
      </div>
    </div>
  );
}