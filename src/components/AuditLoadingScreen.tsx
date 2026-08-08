import { useEffect, useRef, useState } from "react";

const STAGES = [
  "Establishing secure connection to vendor domains...",
  "Scraping /privacy and /security endpoints...",
  "Synthesizing SOC2 compliance metrics via LLM...",
  "Verifying ISO27001 certification records...",
  "Cross-referencing public breach databases...",
  "Performing deep AI compliance analysis...",
  "Calculating weighted risk and trust scores...",
  "Generating executive summary report...",
  "Finalizing Trust Score...",
];

const TYPING_SPEED = 28; // ms per character
const LINE_PAUSE = 400; // ms pause between fully typed lines

export default function AuditLoadingScreen() {
  const [currentLine, setCurrentLine] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());

  // ── Typing engine ──
  useEffect(() => {
    if (finished) return;

    const line = STAGES[currentLine];

    if (typedChars < line.length) {
      const t = setTimeout(() => setTypedChars((c) => c + 1), TYPING_SPEED);
      return () => clearTimeout(t);
    }

    // Line fully typed → mark completed, advance or finish
    const pause = setTimeout(() => {
      setCompleted((p) => [...p, currentLine]);
      if (currentLine < STAGES.length - 1) {
        setCurrentLine((l) => l + 1);
        setTypedChars(0);
      } else {
        setFinished(true);
      }
    }, LINE_PAUSE);
    return () => clearTimeout(pause);
  }, [currentLine, typedChars, finished]);

  // ── Elapsed timer ──
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(((completed.length + (finished ? 1 : 0)) / STAGES.length) * 100);
  const remaining = Math.max(1, Math.ceil(((STAGES.length - completed.length - (finished ? 0 : 1)) * 900) / 1000));

  return (
    <section className="rounded-xl border border-border/60 bg-surface shadow-sm overflow-hidden" role="status" aria-label="Audit in progress">
      {/* ── Terminal window chrome ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/60">
        <span className="w-3 h-3 rounded-full bg-destructive/70" />
        <span className="w-3 h-3 rounded-full bg-warning/70" />
        <span className="w-3 h-3 rounded-full bg-success/70" />
        <span className="ml-3 text-xs font-mono text-foreground/40 tracking-widest uppercase">compliance-engine</span>
        <span className="ml-auto text-xs font-mono text-foreground/30">{elapsed}s · ~{remaining}s</span>
      </div>

      {/* ── Log body ── */}
      <div className="p-5 sm:p-6 font-mono text-sm leading-relaxed space-y-1.5 min-h-[280px] terminal-log">
        {STAGES.map((stage, i) => {
          const isComplete = completed.includes(i);
          const isActive = i === currentLine && !isComplete;

          if (isActive) {
            const typed = stage.slice(0, typedChars);
            return (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0 mt-0.5 select-none">❯</span>
                <span className="text-emerald-200/90 cursor-blink">{typed}</span>
              </div>
            );
          }

          if (isComplete) {
            return (
              <div key={i} className="flex items-start gap-2 opacity-70">
                <span className="text-emerald-500 shrink-0 mt-0.5 select-none">✔</span>
                <span className="text-emerald-300/70">{stage}</span>
              </div>
            );
          }

          // Pending — dimmed
          return (
            <div key={i} className="flex items-start gap-2 opacity-30">
              <span className="text-foreground/40 shrink-0 mt-0.5 select-none">{">"}</span>
              <span className="text-foreground/40">{stage}</span>
            </div>
          );
        })}

        {/* ── Final pulse indicator ── */}
        {finished && (
          <div className="flex items-center gap-2 pt-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" style={{ "--pulse-color": "oklch(0.65 0.2 150 / 0.6)" } as React.CSSProperties} />
            <span className="text-xs font-semibold tracking-wider uppercase">Ready</span>
          </div>
        )}
      </div>

      {/* ── Progress bar footer ── */}
      <div className="h-1 bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-primary to-secondary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}