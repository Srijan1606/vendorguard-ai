import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";

const STAGES = [
  "Identifying Vendor",
  "Discovering Official Website",
  "Parsing Privacy Policy",
  "Checking SOC2 Certification",
  "Verifying ISO27001",
  "Searching Public Breach Databases",
  "Performing AI Compliance Analysis",
  "Calculating Risk Score",
  "Generating Executive Report",
];

export default function AuditLoadingScreen() {
  const [currentStage, setCurrentStage] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const stageDuration = 700 + Math.random() * 600;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const advance = setTimeout(() => {
      if (currentStage < STAGES.length - 1) {
        setCompleted((prev) => [...prev, currentStage]);
        setCurrentStage((prev) => prev + 1);
      } else {
        setCompleted((prev) => [...prev, currentStage]);
      }
    }, stageDuration);

    return () => {
      clearTimeout(advance);
      clearInterval(timer);
    };
  }, [currentStage, startTime]);

  const progress = ((completed.length + (currentStage < STAGES.length ? 1 : 0)) / STAGES.length) * 100;
  const remaining = Math.max(1, Math.ceil(((STAGES.length - completed.length - (currentStage < STAGES.length ? 1 : 0)) * 800) / 1000));

  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Loader2 className="w-5 h-5 text-primary animate-spin" aria-hidden="true" />
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">AI Compliance Audit in Progress</h2>
          <p className="text-xs text-foreground/50">
            {elapsed}s elapsed · ~{remaining}s remaining
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted mb-6 overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stages list */}
      <ul className="flex flex-col gap-2">
        {STAGES.map((stage, i) => {
          const isComplete = completed.includes(i);
          const isActive = i === currentStage && !isComplete;
          return (
            <li
              key={stage}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive ? "bg-primary/5 border border-primary/20" : ""
              } ${isComplete ? "opacity-70" : ""}`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-all duration-300 ${
                  isComplete
                    ? "bg-success/10 text-success"
                    : isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-foreground/30"
                }`}
              >
                {isComplete ? (
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={`text-sm transition-colors duration-300 ${
                  isComplete
                    ? "text-foreground/60 line-through"
                    : isActive
                    ? "text-foreground font-medium"
                    : "text-foreground/40"
                }`}
              >
                {stage}
              </span>
              {isActive && (
                <span className="ml-auto flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}