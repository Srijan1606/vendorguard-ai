import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check, ShieldCheck, Bell, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const WORKSPACES = ["Acme Security Team", "Procurement Ops", "IT Vendor Risk", "Personal Sandbox"];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(WORKSPACES[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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
            aria-label="Notifications"
            className="cursor-pointer relative flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent ring-2 ring-surface"
              aria-hidden="true"
            />
          </button>

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
