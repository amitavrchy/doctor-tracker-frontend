"use client";

import { Menu, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Brand, Sidebar } from "./Sidebar";
import { Button } from "@/components/ui";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const returnFocus = trigger.current;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab" && drawer.current) {
        const items = Array.from(
          drawer.current.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          ),
        );
        if (!items.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === drawer.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", onKey);
      returnFocus?.focus();
    };
  }, [open, close]);
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 lg:block">
        <Sidebar />
      </aside>
      <div className="lg:pl-64">
        <header className="flex h-18 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">
          <Brand />
          <Button
            ref={trigger}
            variant="ghost"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
          {children}
        </main>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50" onClick={close} />
          <div
            ref={drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            tabIndex={-1}
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] outline-none"
          >
            <Sidebar onNavigate={close} />
            <Button
              variant="ghost"
              aria-label="Close navigation"
              className="absolute top-6 right-3"
              onClick={close}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
