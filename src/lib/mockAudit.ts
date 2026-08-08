// Expanded deterministic mock data for VendorGuard AI compliance audits.
// Seeded by vendor name so the same input always yields the same "audit".

export type RiskStatus = "Compliant" | "Low Risk" | "Caution" | "High Risk" | "Critical";
export type FlagLevel = "pass" | "neutral" | "warning" | "fail";
export type CertStatus = "Verified" | "Unavailable" | "Expired" | "Unknown";

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
  confidence: number;
}

export interface RiskCategory {
  name: string;
  score: number; // 0-100
}

export interface ComplianceCheckItem {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface VendorProfile {
  name: string;
  domain: string;
  industry: string;
  headquarters: string;
  founded: string;
  estimatedEmployees: string;
  cloudProvider: string;
  trustCenterUrl: string;
  verified: boolean;
}

export interface PrivacyGovernance {
  gdprSummary: string;
  dataRetention: string;
  userRights: string;
  crossBorderTransfers: string;
  cookiePolicy: FlagLevel;
  dpaAvailable: boolean;
  subprocessorList: boolean;
  aiSummary: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "incident" | "certification" | "policy" | "milestone";
  severity?: FlagLevel;
}

export interface EvidenceSource {
  title: string;
  url: string;
  snippet: string;
  confidence: number;
  category: string;
}

export interface Recommendation {
  action: string;
  priority: "high" | "medium" | "low";
}

export interface AuditResult {
  vendorName: string;
  vendorDomain: string;
  riskScore: number;
  riskStatus: RiskStatus;
  generatedAt: string;
  executiveSummary: string;
  aiConfidence: number;
  evidenceQuality: number;
  sourcesCount: number;
  docsParsed: number;
  positiveFactors: Flag[];
  negativeFactors: Flag[];
  riskBreakdown: RiskCategory[];
  complianceChecklist: ComplianceCheckItem[];
  vendorProfile: VendorProfile;
  certifications: Certification[];
  privacyGovernance: PrivacyGovernance;
  breachHistory: {
    summary: string;
    events: BreachEvent[];
  };
  riskTimeline: TimelineEvent[];
  citations: Citation[];
  evidenceSources: EvidenceSource[];
  sourceQuality: { name: string; score: number }[];
  recommendations: Recommendation[];
  missingInfo: { label: string; detail: string }[];
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

function pickN<T>(arr: T[], seed: number, n: number): T[] {
  const shuffled = [...arr].sort((a, b) => {
    const ha = hashString(String(seed) + JSON.stringify(a));
    const hb = hashString(String(seed) + JSON.stringify(b));
    return ha - hb;
  });
  return shuffled.slice(0, n);
}

function riskStatusForScore(score: number): RiskStatus {
  if (score >= 90) return "Compliant";
  if (score >= 70) return "Low Risk";
  if (score >= 45) return "Caution";
  if (score >= 25) return "High Risk";
  return "Critical";
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

  const riskScore = 30 + (seed % 66);
  const riskStatus = riskStatusForScore(riskScore);

  const aiConfidence = 75 + (seed % 20);
  const evidenceQuality = 65 + (seed % 30);
  const sourcesCount = 8 + (seed % 10);
  const docsParsed = 3 + (seed % 6);

  // ── Executive Summary ──
  const executiveSummary = `VendorGuard AI analyzed ${vendorName} using public documentation, security certifications, privacy policies, and historical incident data. ${vendorName} demonstrates ${
    riskScore >= 70 ? "strong" : riskScore >= 45 ? "moderate" : "limited"
  } compliance with industry standards${
    riskScore < 70 ? " while a number of privacy and security concerns remain" : ""
  }. Overall onboarding risk is considered ${riskStatus.toLowerCase()}.`;

  // ── Positive / Negative Factors ──
  const posPool: Flag[] = [
    { label: "SOC2 Type II verified", level: "pass" },
    { label: "ISO27001 certified", level: "pass" },
    { label: "Privacy Policy updated recently", level: "pass" },
    { label: "GDPR compliant data processing", level: "pass" },
    { label: "DPA available", level: "pass" },
    { label: "Strong encryption at rest and in transit", level: "pass" },
    { label: "Regular third-party security audits", level: "pass" },
    { label: "Transparent subprocessor list", level: "pass" },
  ];
  const negPool: Flag[] = [
    { label: "Minor breach in 2022", level: "fail" },
    { label: "Cookie policy missing", level: "fail" },
    { label: "GDPR wording incomplete", level: "fail" },
    { label: "No HIPAA attestation", level: "fail" },
    { label: "Data retention policy unclear", level: "warning" },
    { label: "Limited breach notification history", level: "warning" },
    { label: "Cross-border transfer mechanism missing", level: "fail" },
    { label: "Subprocessor list not published", level: "warning" },
  ];

  const positiveFactors = pickN(posPool, seed, 3 + (seed % 3));
  const negativeFactors = pickN(negPool, seed + 7, 2 + (seed % 3));

  // ── Risk Breakdown ──
  const riskBreakdown: RiskCategory[] = [
    { name: "Privacy", score: Math.min(100, 40 + (seed % 55)) },
    { name: "Security", score: Math.min(100, 50 + (seed % 45)) },
    { name: "Legal", score: Math.min(100, 35 + (seed % 50)) },
    { name: "Compliance", score: Math.min(100, 45 + (seed % 50)) },
    { name: "Transparency", score: Math.min(100, 30 + (seed % 60)) },
    { name: "Reliability", score: Math.min(100, 55 + (seed % 40)) },
    { name: "Data Governance", score: Math.min(100, 40 + (seed % 50)) },
    { name: "Third-party Risk", score: Math.min(100, 35 + (seed % 45)) },
  ];

  // ── Compliance Checklist ──
  const complianceChecklist: ComplianceCheckItem[] = [
    {
      label: "GDPR",
      status: seed % 3 === 0 ? "warn" : "pass",
      detail: seed % 3 === 0 ? "Partial compliance detected" : "Full compliance verified",
    },
    {
      label: "SOC2 Type II",
      status: options.checkSoc2 ? (seed % 4 === 0 ? "fail" : "pass") : "warn",
      detail: options.checkSoc2
        ? seed % 4 === 0
          ? "Not certified"
          : "Verified"
        : "SOC2 check skipped",
    },
    {
      label: "ISO27001",
      status: seed % 5 === 0 ? "fail" : "pass",
      detail: seed % 5 === 0 ? "Not found" : "Certified",
    },
    {
      label: "DPA Available",
      status: seed % 4 === 0 ? "fail" : "pass",
      detail: seed % 4 === 0 ? "Not available" : "Available upon request",
    },
    {
      label: "HIPAA",
      status: seed % 3 === 0 ? "fail" : seed % 2 === 0 ? "pass" : "warn",
      detail: seed % 3 === 0
        ? "No documentation found"
        : seed % 2 === 0
        ? "Compliant"
        : "Unknown",
    },
    {
      label: "Cookie Policy",
      status: seed % 4 === 0 ? "fail" : seed % 3 === 0 ? "warn" : "pass",
      detail: seed % 4 === 0 ? "Missing" : seed % 3 === 0 ? "Incomplete" : "Compliant",
    },
    {
      label: "Subprocessor List",
      status: seed % 3 === 0 ? "fail" : "pass",
      detail: seed % 3 === 0 ? "Not published" : "Published and updated quarterly",
    },
  ];

  // ── Vendor Profile ──
  const industries = ["SaaS", "Enterprise Software", "Cloud Infrastructure", "Collaboration", "FinTech", "Security"];
  const cities = ["San Francisco, CA", "New York, NY", "London, UK", "Berlin, DE", "Dublin, IE", "Tokyo, JP"];
  const cloudProviders = ["AWS", "Google Cloud", "Azure", "Self-hosted"];
  const vendorProfile: VendorProfile = {
    name: vendorName,
    domain: vendorDomain,
    industry: pick(industries, seed, 3),
    headquarters: pick(cities, seed, 5),
    founded: `${2009 + (seed % 14)}`,
    estimatedEmployees: `${100 + (seed % 5000)}`,
    cloudProvider: pick(cloudProviders, seed, 7),
    trustCenterUrl: `https://trust.${vendorDomain}`,
    verified: seed % 5 !== 0,
  };

  // ── Certifications ──
  const certPool: { name: string; statuses: CertStatus[] }[] = [
    { name: "SOC 2 Type II", statuses: ["Verified", "Verified", "Unavailable", "Expired"] },
    { name: "ISO 27001", statuses: ["Verified", "Verified", "Unavailable", "Unknown"] },
    { name: "HIPAA", statuses: ["Verified", "Unavailable", "Unavailable", "Unknown"] },
    { name: "PCI DSS", statuses: ["Verified", "Unavailable", "Unknown", "Expired"] },
    { name: "FedRAMP", statuses: ["Unavailable", "Unavailable", "Unknown", "Unknown"] },
    { name: "CCPA", statuses: ["Verified", "Verified", "Unavailable", "Unknown"] },
  ];

  const certifications: Certification[] = certPool.map((cert, i) => {
    const status = pick(cert.statuses, seed, i * 7);
    const detailMap: Record<CertStatus, string> = {
      Verified: `Valid attestation report on file.`,
      Unavailable: `No attestation report found in public registries.`,
      Expired: `Previous certification has lapsed.`,
      Unknown: `Status could not be verified from public sources.`,
    };
    return { name: cert.name, status, detail: detailMap[status] };
  });

  // ── Privacy Governance ──
  const privacyGovernance: PrivacyGovernance = {
    gdprSummary: `${vendorName}'s published privacy policy references GDPR Art. 28 obligations and maintains a Data Processing Addendum.`,
    dataRetention: "Customer data retained for the duration of the agreement plus 90 days. Backups retained for 12 months.",
    userRights: "Right to access, rectify, delete, and port data. Response within 30 days as per GDPR Art. 12.",
    crossBorderTransfers: seed % 2 === 0
      ? "SCCs in place for EU-US data transfers."
      : "No explicit cross-border transfer mechanism documented.",
    cookiePolicy: seed % 3 === 0 ? "fail" : seed % 2 === 0 ? "warning" : "pass",
    dpaAvailable: seed % 4 !== 0,
    subprocessorList: seed % 3 !== 0,
    aiSummary: `${vendorName} has ${
      seed % 3 === 0 ? "comprehensive" : "partial"
    } privacy documentation with ${
      seed % 2 === 0 ? "clear" : "limited"
    } data governance policies. ${
      seed % 4 === 0 ? "User rights processes are well-documented." : "Some gaps in user rights documentation remain."
    }`,
  };

  // ── Breach History ──
  const breachPool: BreachEvent[] = [
    { date: "2023-11-02", title: "Third-party analytics vendor exposure", severity: "warning", description: "A downstream analytics sub-processor briefly exposed non-sensitive usage logs." },
    { date: "2022-06-14", title: "Credential stuffing attempt detected", severity: "neutral", description: "Automated login attempts detected and blocked; no accounts compromised." },
    { date: "2021-09-30", title: "Misconfigured storage bucket", severity: "fail", description: "A cloud storage bucket was misconfigured for public read access for ~6 hours." },
    { date: "2024-02-18", title: "Phishing campaign targeting employees", severity: "pass", description: "Identified and contained by internal security team; no systems compromised." },
    { date: "2020-07-12", title: "API rate limiting vulnerability", severity: "warning", description: "API rate limiting bypass discovered and patched within 24 hours." },
  ];

  const numBreaches = options.scanBreach ? 1 + (seed % 4) : 0;
  const breachEvents = options.scanBreach
    ? pickN(breachPool, seed, numBreaches)
    : [];

  const breachSummary = !options.scanBreach
    ? `Breach history scan was skipped.`
    : numBreaches === 0
      ? `No publicly disclosed data breaches found in the last 5 years.`
      : `${numBreaches} historical security incident${numBreaches > 1 ? "s" : ""} found in public records.`;

  // ── Risk Timeline ──
  const riskTimeline: TimelineEvent[] = [
    { date: "2024-11-15", title: "Privacy Policy Updated", description: "Updated data processing disclosures and cookie consent mechanisms.", type: "policy" },
    { date: "2024-06-01", title: "SOC2 Type II Renewed", description: "Annual SOC2 Type II audit completed with no exceptions.", type: "certification", severity: "pass" },
    { date: "2023-09-20", title: "Minor Security Incident", description: "Third-party analytics vendor exposure - remediated within 48 hours.", type: "incident", severity: "warning" },
    { date: "2023-03-15", title: "ISO27001:2022 Transition", description: "Successfully transitioned to ISO27001:2022 standard.", type: "certification", severity: "pass" },
    { date: "2022-06-14", title: "Credential Stuffing Attempt", description: "Automated login attempts blocked; no accounts compromised.", type: "incident", severity: "neutral" },
    { date: "2021-09-30", title: "Storage Bucket Misconfiguration", description: "Brief public exposure of internal logs - remediated in 6 hours.", type: "incident", severity: "fail" },
  ];

  // ── Evidence Sources ──
  const evidenceSources: EvidenceSource[] = [
    {
      title: "Official Website",
      url: `https://${vendorDomain}`,
      snippet: `${vendorName} provides enterprise SaaS solutions with documented security practices.`,
      confidence: 95,
      category: "General",
    },
    {
      title: "Privacy Policy",
      url: `https://${vendorDomain}/legal/privacy`,
      snippet: `"${vendorName} processes personal data in accordance with GDPR Article 28."`,
      confidence: 88,
      category: "Privacy",
    },
    {
      title: "SOC2 Report",
      url: `https://trust.${vendorDomain}`,
      snippet: `SOC2 Type II report renewed annually.`,
      confidence: 82,
      category: "Security",
    },
    {
      title: "Security News",
      url: `https://news.example.com/${vendorDomain}`,
      snippet: `No material security incidents reported in the last fiscal year.`,
      confidence: 70,
      category: "Security",
    },
    {
      title: "Community Reports",
      url: `https://community.example.com/${vendorDomain}`,
      snippet: `Users report reliable service with responsive security team.`,
      confidence: 60,
      category: "General",
    },
  ];

  // ── Source Quality ──
  const sourceQuality = [
    { name: "Official Website", score: 95 },
    { name: "Privacy Policy", score: 88 },
    { name: "SOC2 Report", score: 82 },
    { name: "Security News", score: 70 },
    { name: "Community Reports", score: 60 },
  ];

  // ── Recommendations ──
  const allRecs: Recommendation[] = [
    { action: "Request latest SOC2 report.", priority: "high" },
    { action: "Review DPA for data processing terms.", priority: "high" },
    { action: "Verify data residency compliance.", priority: "medium" },
    { action: "Monitor annual certification renewals.", priority: "medium" },
    { action: "Request HIPAA attestation if required.", priority: "low" },
    { action: "Review subprocessor list for changes.", priority: "medium" },
    { action: "Confirm breach notification procedures.", priority: "high" },
  ];
  const recommendations = pickN(allRecs, seed, 4 + (seed % 3));

  // ── Missing Info ──
  const missingPool = [
    { label: "No HIPAA documentation found", detail: "HIPAA attestation not publicly available" },
    { label: "No public penetration test report", detail: "Recent pentest report not published" },
    { label: "Cookie Policy unavailable", detail: "Cookie consent mechanism not found" },
    { label: "Data retention policy not published", detail: "Retention schedules not publicly documented" },
    { label: "No BCP/DR documentation", detail: "Business continuity plan not available" },
  ];
  const missingInfo = pickN(missingPool, seed + 3, 1 + (seed % 3));

  // ── Citations ──
  const citations: Citation[] = [
    { snippet: `"${vendorName} processes personal data in accordance with GDPR Article 28."`, sourceLabel: `${vendorDomain}/legal/privacy`, sourceUrl: `https://${vendorDomain}/legal/privacy`, category: "Privacy", confidence: 88 },
    { snippet: `"Our SOC 2 Type II report is renewed annually."`, sourceLabel: `trust.${vendorDomain}`, sourceUrl: `https://trust.${vendorDomain}`, category: "Security", confidence: 82 },
    { snippet: `"No material security incidents in the last fiscal year."`, sourceLabel: `${vendorDomain}/security`, sourceUrl: `https://${vendorDomain}/security`, category: "Breach History", confidence: 70 },
    { snippet: `"ISO 27001 certified for core cloud infrastructure."`, sourceLabel: `${vendorDomain}/compliance`, sourceUrl: `https://${vendorDomain}/compliance`, category: "Security", confidence: 85 },
    { snippet: `"Sub-processors list published and updated quarterly."`, sourceLabel: `${vendorDomain}/legal/subprocessors`, sourceUrl: `https://${vendorDomain}/legal/subprocessors`, category: "Privacy", confidence: 75 },
  ];

  return {
    vendorName,
    vendorDomain,
    riskScore,
    riskStatus,
    generatedAt: new Date().toISOString(),
    executiveSummary,
    aiConfidence,
    evidenceQuality,
    sourcesCount,
    docsParsed,
    positiveFactors,
    negativeFactors,
    riskBreakdown,
    complianceChecklist,
    vendorProfile,
    certifications,
    privacyGovernance,
    breachHistory: { summary: breachSummary, events: breachEvents },
    riskTimeline,
    citations,
    evidenceSources,
    sourceQuality,
    recommendations,
    missingInfo,
  };
}

// ── Pre-computed demo vendors for quick access ──
export const DEMO_VENDORS = [
  { label: "Audit Slack", vendor: "Slack" },
  { label: "Audit Notion", vendor: "Notion" },
  { label: "Audit Zoom", vendor: "Zoom" },
  { label: "Audit Microsoft Teams", vendor: "Microsoft Teams" },
  { label: "Audit Unknown SaaS", vendor: "Unknown SaaS Co", simulateFailure: true },
];