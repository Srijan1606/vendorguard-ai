import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check, ShieldCheck, Bell, User, Sparkles, X,ExternalLink } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const WORKSPACES = ["Acme Security Team", "Procurement Ops", "IT Vendor Risk", "Personal Sandbox"];

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Audit Complete",
    description: "Slack compliance audit finished — score updated to 78/100.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "New Certification Found",
    description: "Notion's ISO 27001 certification was renewed.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Vendor Breach Alert",
    description: "Zoom reported a minor security incident on March 12.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    title: "Recommendation Updated",
    description: "3 new high-priority recommendations for Microsoft Teams.",
    time: "6 hours ago",
    read: true,
  },
  {
    id: "5",
    title: "System Ready",
    description: "All compliance data sources are synced and operational.",
    time: "1 day ago",
    read: true,
  },
];

export default function Header({ onNewAudit }: { onNewAudit?: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(WORKSPACES[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => (i + 1) % WORKSPACES.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => (i - 1 + WORKSPACES.length) % WORKSPACES.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) {
        setSelected(WORKSPACES[activeIndex]);
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }

  return (
    <header className="border-b glass-surface sticky top-0 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-on-primary shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              VendorGuard AI
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
              System Ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div ref={containerRef} className="relative">
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-haspopup="listbox"
              aria-label="Switch workspace"
              onClick={() => setOpen((o) => !o)}
              onKeyDown={onKeyDown}
              className="cursor-pointer flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:border-primary/40 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-foreground/50 hidden sm:inline">Workspace:</span>
              <span className="truncate max-w-[10rem]">{selected}</span>
              <ChevronDown
                className={`w-4 h-4 text-foreground/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {open && (
              <ul
                id={listboxId}
                role="listbox"
                aria-activedescendant={`${listboxId}-${activeIndex}`}
                className="absolute right-0 mt-2 w-56 rounded-lg border glass-surface shadow-lg py-1 z-30"
              >
                {WORKSPACES.map((ws, i) => (
                  <li
                    key={ws}
                    id={`${listboxId}-${i}`}
                    role="option"
                    aria-selected={ws === selected}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      setSelected(ws);
                      setOpen(false);
                    }}
                    className={`cursor-pointer flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors duration-150 ${
                      i === activeIndex ? "bg-muted" : ""
                    } ${ws === selected ? "text-primary font-medium" : "text-foreground"}`}
                  >
                    <span className="truncate">{ws}</span>
                    {ws === selected && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={onNewAudit}
            className="cursor-pointer hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            New Audit
          </button>

          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setNotifsOpen((o) => !o)}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
              aria-expanded={notifsOpen}
              aria-haspopup="menu"
              className="cursor-pointer relative flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1.125rem] h-[1.125rem] rounded-full bg-accent text-[10px] font-bold text-on-primary px-1 ring-2 ring-surface leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifsOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border glass-surface shadow-xl z-30 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="cursor-pointer text-xs font-medium text-primary hover:text-primary/70 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNotifsOpen(false)}
                      aria-label="Close notifications"
                      className="cursor-pointer text-foreground/40 hover:text-foreground transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-8 h-8 mx-auto text-foreground/20 mb-2" aria-hidden="true" />
                      <p className="text-sm text-foreground/40">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-border/30 transition-colors duration-150 ${
                          n.read ? "opacity-60" : "bg-primary/[0.02]"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                            )}
                            <span className={`text-sm font-medium truncate ${n.read ? "text-foreground/60" : "text-foreground"}`}>
                              {n.title}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/50 mt-0.5 line-clamp-2">
                            {n.description}
                          </p>
                          <span className="text-[10px] text-foreground/40 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border/50 px-4 py-2.5 text-center">
                  <button
                    type="button"
                    className="cursor-pointer text-xs font-medium text-primary hover:text-primary/70 transition-colors duration-150 flex items-center justify-center gap-1 mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          <button
            type="button"
            aria-label="User account"
            className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-secondary/15 text-secondary hover:bg-secondary/25 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            <User className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
