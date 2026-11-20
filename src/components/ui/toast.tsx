"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Toast = { id: number; message: string };

const ToastContext = createContext<((message: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((v) => [...v, { id, message }]);
    window.setTimeout(
      () => setToasts((v) => v.filter((t) => t.id !== id)),
      5000,
    );
  }, []);
  return (
    <ToastContext.Provider value={add}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed right-4 bottom-4 z-50 space-y-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast requires ToastProvider");
  return context;
}
