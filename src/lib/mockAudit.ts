// Deterministic dummy data generator for vendor compliance audits.
// Seeded by vendor name so the same input always yields the same "audit" —
// this stands in for a real backend call in this front-end-only phase.

export type RiskStatus = "Compliant" | "Caution" | "High Risk";
export type FlagLevel = "pass" | "neutral" | "warning" | "fail";
export type CertStatus = "Certified" | "In Progress" | "Not Certified";

export interface Flag {
  label: string;
  level: FlagLevel;
}

export interface Certification {
  name: string;
  status: CertStatus;
  detail: string;
}

export interface BreachEvent {
  date: string;
  title: string;
  severity: FlagLevel;
  description: string;
}

export interface Citation {
  snippet: string;
  sourceLabel: string;
  sourceUrl: string;
  category: "Privacy" | "Security" | "Breach History" | "General";
}

export interface AuditResult {
  vendorName: string;
  vendorDomain: string;
  riskScore: number;
  riskStatus: RiskStatus;
  generatedAt: string;
  privacy: {
    summary: string;
    flags: Flag[];
  };
  certifications: Certification[];
  breachHistory: {
    summary: string;
    events: BreachEvent[];
  };
  citations: Citation[];
}

// Simple deterministic string hash -> 32-bit int
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length];
}

function riskStatusForScore(score: number): RiskStatus {
  if (score >= 75) return "Compliant";
  if (score >= 45) return "Caution";
  return "High Risk";
}

function slugifyDomain(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes(".")) {
    return trimmed.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
  return `${trimmed.replace(/\s+/g, "")}.com`;
}

export function generateAuditResult(
  vendorInput: string,
  options: { includePrivacy: boolean; checkSoc2: boolean; scanBreach: boolean }
): AuditResult {
  const vendorName = vendorInput.trim();
  const vendorDomain = slugifyDomain(vendorName);
  const seed = hashString(vendorDomain);

  const riskScore = 30 + (seed % 66); // range 30-95
  const riskStatus = riskStatusForScore(riskScore);

  const privacyFlagPool: Flag[] = [
    { label: "GDPR Data Processing Agreement Available", level: "pass" },
    { label: "CCPA Compliant Disclosures", level: "pass" },
    { label: "Data Residency Options (EU/US)", level: "pass" },
    { label: "Third-Party Sub-processor List Published", level: "neutral" },
    { label: "Data Retention Policy Unclear", level: "warning" },
    { label: "No Explicit Right-to-Erasure Workflow", level: "warning" },
    { label: "Cross-Border Transfer Mechanism Missing", level: "fail" },
  ];

  const numPrivacyFlags = options.includePrivacy ? 4 + (seed % 2) : 2;
  const privacyFlags: Flag[] = Array.from({ length: numPrivacyFlags }).map((_, i) =>
    pick(privacyFlagPool, seed, i * 3)
  );

  const privacySummary = options.includePrivacy
    ? `${vendorName}'s published privacy policy references GDPR Art. 28 obligations and lists a documented data processing agreement. Automated scan of the policy and trust center found ${numPrivacyFlags} notable data-handling clauses worth review.`
    : `Privacy Policy scan was skipped for this audit. Enable "Include Privacy Policy" to analyze ${vendorName}'s data handling clauses and GDPR posture.`;

  const certPool: { name: string; statuses: CertStatus[] }[] = [
    { name: "SOC 2 Type II", statuses: ["Certified", "In Progress", "Not Certified"] },
    { name: "ISO 27001", statuses: ["Certified", "Certified", "In Progress", "Not Certified"] },
    { name: "HIPAA", statuses: ["Certified", "In Progress", "Not Certified", "Not Certified"] },
  ];

  const certifications: Certification[] = certPool.map((cert, i) => {
    let status: CertStatus;
    if (cert.name === "SOC 2 Type II" && !options.checkSoc2) {
      status = "In Progress";
      return {
        name: cert.name,
        status,
        detail: "SOC2 verification was skipped for this audit — enable 'Check SOC2 Status' for a live attestation lookup.",
      };
    }
    status = pick(cert.statuses, seed, i * 7);
    const detailMap: Record<CertStatus, string> = {
      Certified: `Valid attestation report on file, last audited within 12 months.`,
      "In Progress": `Vendor has an active audit engagement; report expected within this quarter.`,
      "Not Certified": `No attestation report found in vendor trust center or public registries.`,
    };
    return { name: cert.name, status, detail: detailMap[status] };
  });

  const breachPool: BreachEvent[] = [
    {
      date: "2023-11-02",
      title: "Third-party analytics vendor exposure",
      severity: "warning",
      description: "A downstream analytics sub-processor briefly exposed non-sensitive usage logs. Remediated within 48 hours; no customer data confirmed affected.",
    },
    {
      date: "2022-06-14",
      title: "Credential stuffing attempt detected",
      severity: "neutral",
      description: "Automated login attempts were detected and blocked by rate limiting; no accounts compromised.",
    },
    {
      date: "2021-09-30",
      title: "Misconfigured storage bucket",
      severity: "fail",
      description: "A cloud storage bucket was briefly misconfigured for public read access, exposing internal logs for approximately 6 hours before remediation.",
    },
    {
      date: "2024-02-18",
      title: "Phishing campaign targeting employees",
      severity: "pass",
      description: "Targeted phishing campaign was identified and contained by internal security team; no systems were compromised.",
    },
  ];

  const numBreaches = seed % 3; // 0, 1, or 2 events
  const breachEvents = options.scanBreach
    ? Array.from({ length: numBreaches }).map((_, i) => pick(breachPool, seed, i * 5))
    : [];

  const breachSummary = !options.scanBreach
    ? `Breach history scan was skipped for this audit. Enable "Scan Breach History" to check public disclosure databases and news sources.`
    : numBreaches === 0
      ? `No publicly disclosed data breaches or security incidents were found for ${vendorName} in the last 5 years across monitored disclosure databases.`
      : `${numBreaches} historical security incident${numBreaches > 1 ? "s" : ""} found in public disclosure records. Severity and impact vary — see details below.`;

  const citations: Citation[] = [
    {
      snippet: `"${vendorName} processes personal data in accordance with GDPR Article 28 and maintains a Data Processing Addendum available upon request."`,
      sourceLabel: `${vendorDomain}/legal/privacy`,
      sourceUrl: `https://${vendorDomain}/legal/privacy`,
      category: "Privacy",
    },
    {
      snippet: `"Our SOC 2 Type II report is renewed annually and available via our trust center under NDA."`,
      sourceLabel: `trust.${vendorDomain}`,
      sourceUrl: `https://trust.${vendorDomain}`,
      category: "Security",
    },
    {
      snippet: `"No material security incidents have been reported in the last fiscal year."`,
      sourceLabel: `${vendorDomain}/security`,
      sourceUrl: `https://${vendorDomain}/security`,
      category: "Breach History",
    },
    {
      snippet: `"${vendorName} is ISO 27001 certified for its core cloud infrastructure, covering data centers in the US and EU."`,
      sourceLabel: `${vendorDomain}/compliance`,
      sourceUrl: `https://${vendorDomain}/compliance`,
      category: "Security",
    },
    {
      snippet: `"Sub-processors list is published and updated quarterly; customers are notified 30 days before any change."`,
      sourceLabel: `${vendorDomain}/legal/subprocessors`,
      sourceUrl: `https://${vendorDomain}/legal/subprocessors`,
      category: "Privacy",
    },
  ];

  return {
    vendorName,
    vendorDomain,
    riskScore,
    riskStatus,
    generatedAt: new Date().toISOString(),
    privacy: {
      summary: privacySummary,
      flags: privacyFlags,
    },
    certifications,
    breachHistory: {
      summary: breachSummary,
      events: breachEvents,
    },
    citations,
  };
}
