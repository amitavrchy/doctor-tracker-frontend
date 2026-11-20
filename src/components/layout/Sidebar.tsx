"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { useLogout, useMe } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: UsersRound },
];

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-teal-700 text-white">
        <Activity size={22} />
      </div>
      <div>
        <div className="text-base font-bold tracking-tight text-slate-900">
          Doctor Tracker
        </div>
        <div className="text-xs text-slate-500">Care management</div>
      </div>
    </div>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const segment = useSelectedLayoutSegment();
  const { data: user } = useMe();
  const logout = useLogout();
  return (
    <div className="flex h-full flex-col bg-white px-5 py-7">
      <div className="px-2">
        <Brand />
      </div>
      <div className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Workspace
      </div>
      <nav aria-label="Main navigation" className="mt-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = segment === href.slice(1);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">
            {user?.name?.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-4 w-full justify-start"
          loading={logout.isPending}
          onClick={() => logout.mutate()}
        >
          <LogOut size={17} /> Sign out
        </Button>
      </div>
    </div>
  );
}
