import { ExternalLink, FileSearch } from "lucide-react";
import type { AuditResult, Citation } from "../lib/mockAudit";
import Badge, { type BadgeTone } from "./Badge";

const CATEGORY_TONE: Record<Citation["category"], BadgeTone> = {
  Privacy: "info",
  Security: "pass",
  "Breach History": "warning",
  General: "neutral",
};

export default function AuditLogTable({ result }: { result: AuditResult }) {
  const { citations } = result;

  return (
    <section className="rounded-xl border border-border bg-white shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-primary" aria-hidden="true" />
          Audit Log & Source Citations
        </h3>
        <span className="text-xs text-foreground/40">
          Showing {citations.length} of {citations.length} sources
        </span>
      </div>

      {citations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <p className="text-sm text-foreground/50">
            No source citations were extracted for this audit — try enabling more scan options.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="px-5 sm:px-6 py-2 font-medium text-foreground/50 text-xs uppercase tracking-wide">
                  Extracted Snippet
                </th>
                <th scope="col" className="px-3 py-2 font-medium text-foreground/50 text-xs uppercase tracking-wide">
                  Category
                </th>
                <th scope="col" className="px-3 py-2 font-medium text-foreground/50 text-xs uppercase tracking-wide">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {citations.map((citation, i) => (
                <tr
                  key={i}
                  className={`border-b border-border last:border-0 transition-colors duration-150 hover:bg-muted/60 ${
                    i % 2 === 1 ? "bg-muted/30" : ""
                  }`}
                >
                  <td className="px-5 sm:px-6 py-3 text-foreground/80 leading-relaxed max-w-md">
                    {citation.snippet}
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={CATEGORY_TONE[citation.category]}>{citation.category}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <a
                      href={citation.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer inline-flex items-center gap-1 text-secondary hover:text-primary hover:underline transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      {citation.sourceLabel}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
