import type { ReactNode } from "react";

export type BadgeTone = "pass" | "neutral" | "warning" | "fail" | "info";

const toneClasses: Record<BadgeTone, string> = {
  pass: "bg-success/10 text-success border-success/30",
  neutral: "bg-muted text-foreground/70 border-border",
  warning: "bg-warning/10 text-warning border-warning/30",
  fail: "bg-destructive/10 text-destructive border-destructive/30",
  info: "bg-secondary/10 text-secondary border-secondary/30",
};

export default function Badge({
  tone = "neutral",
  icon,
  children,
  className = "",
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
