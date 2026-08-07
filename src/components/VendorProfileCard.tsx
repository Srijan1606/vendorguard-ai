import { Building2, Globe, MapPin, Calendar, Users, Cloud, ExternalLink, ShieldCheck, BadgeCheck } from "lucide-react";
import type { VendorProfile } from "../lib/mockAudit";

export default function VendorProfileCard({ profile }: { profile: VendorProfile }) {
  const fields = [
    { icon: <Globe className="w-3.5 h-3.5" />, label: "Website", value: profile.domain, href: `https://${profile.domain}` },
    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Industry", value: profile.industry },
    { icon: <Building2 className="w-3.5 h-3.5" />, label: "Headquarters", value: profile.headquarters },
    { icon: <Calendar className="w-3.5 h-3.5" />, label: "Founded", value: profile.founded },
    { icon: <Users className="w-3.5 h-3.5" />, label: "Employees", value: profile.estimatedEmployees },
    { icon: <Cloud className="w-3.5 h-3.5" />, label: "Cloud Provider", value: profile.cloudProvider },
  ];

  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
          <Building2 className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">Vendor Profile</h3>
        {profile.verified && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-success">
            <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Verified
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.label} className="flex items-center gap-2.5">
            <span className="text-foreground/40 shrink-0">{f.icon}</span>
            <div>
              <p className="text-xs text-foreground/50">{f.label}</p>
              {f.href ? (
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-secondary hover:text-primary hover:underline transition-colors duration-150 inline-flex items-center gap-1"
                >
                  {f.value}
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              ) : (
                <p className="text-sm font-medium text-foreground">{f.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <a
          href={profile.trustCenterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200 active:scale-[0.97]"
        >
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          Visit Trust Center
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}