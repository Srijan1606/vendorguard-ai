import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Copy, Check, FileSearch } from "lucide-react";
import type { EvidenceSource } from "../lib/mockAudit";

export default function EvidenceExplorer({ sources }: { sources: EvidenceSource[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleCopy(snippet: string, i: number) {
    navigator.clipboard.writeText(snippet);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10 text-secondary shrink-0">
          <FileSearch className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">Evidence Explorer</h3>
        <span className="ml-auto text-xs text-foreground/40">{sources.length} sources</span>
      </div>

      <div className="flex flex-col gap-2">
        {sources.map((src, i) => {
          const isExpanded = expanded === i;
          return (
            <div
              key={i}
              className={`rounded-lg border transition-all duration-200 ${
                isExpanded ? "border-primary/30 bg-primary/[0.02]" : "border-border/50"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : i)}
                className="cursor-pointer w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-medium text-foreground/70">{src.category}</span>
                  <span className="text-sm font-medium text-foreground truncate">{src.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-foreground/50 tabular-nums">{src.confidence}%</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-foreground/40" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-foreground/40" aria-hidden="true" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-0 border-t border-border/50 mt-0">
                  <p className="text-xs text-foreground/70 leading-relaxed mt-2 mb-3 italic">
                    &ldquo;{src.snippet}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary transition-colors duration-150"
                    >
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      Open Source
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(src.snippet, i)}
                      className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-foreground/60 hover:text-foreground transition-colors duration-150"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-3 h-3 text-success" aria-hidden="true" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          Copy Citation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}