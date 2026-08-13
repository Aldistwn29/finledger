"use client";

import Link from "next/link";
import {
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  ReceiptText,
  Settings2,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  businessName: string;
  businessType: "GROCERY" | "PULSE";
  userName: string;
  userEmail: string;
  pathname: string;
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const primaryItems = [
  { href: "/app/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/app/sales", label: "Penjualan", icon: ReceiptText },
  { href: "/app/receivables", label: "Piutang", icon: WalletCards },
  { href: "/app/customers", label: "Pelanggan", icon: Users },
  { href: "/app/reports", label: "Laporan", icon: BarChart3 },
];

const managementItems = [
  { href: "/app/expenses", label: "Pengeluaran", icon: CreditCard },
  { href: "/app/capital", label: "Modal", icon: CircleDollarSign },
];

function isCurrentPath(pathname: string, href: string) {
  return href === "/app/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

export default function AppSidebar({
  businessName,
  businessType,
  userName,
  userEmail,
  pathname,
  mobileOpen,
  onClose,
  onLogout,
}: AppSidebarProps) {
  const typeLabel = businessType === "PULSE" ? "Usaha pulsa" : "Warung sembako";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-surface-dark/50 lg:hidden"
        />
      ) : null}

      <aside
        aria-label="Navigasi utama"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-[12px_0_32px_-28px_var(--surface-dark)] transition-transform duration-200 lg:z-20 lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/app/dashboard" onClick={onClose} className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <CircleDollarSign className="size-5" />
            </span>
            <span className="truncate text-base font-extrabold tracking-tight">FinLedger</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup navigasi"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-primary-bg hover:text-primary-dark lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="border-b p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border bg-background p-2.5 text-left transition hover:border-primary/50 hover:bg-primary-bg"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-xs font-extrabold text-surface-dark">
              {initials(businessName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{businessName}</span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{typeLabel}</span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <NavGroup label="Workspace" items={primaryItems} pathname={pathname} onNavigate={onClose} />
          <NavGroup label="Manage" items={managementItems} pathname={pathname} onNavigate={onClose} className="mt-7" />

          <div className="mt-6 border-t pt-4">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Support</p>
            <Link
              href="/app/feedback"
              onClick={onClose}
              aria-current={isCurrentPath(pathname, "/app/feedback") ? "page" : undefined}
              className={cn(
                "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                isCurrentPath(pathname, "/app/feedback")
                  ? "bg-primary-bg text-primary-dark"
                  : "text-muted-foreground hover:bg-primary-bg hover:text-primary-dark",
              )}
            >
              <MessageSquareText className="size-4" />
              Feedback
            </Link>
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex items-center justify-between rounded-xl px-2 py-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-light text-xs font-extrabold text-surface-dark">
                {initials(userName)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold">{userName}</span>
                <span className="block max-w-36 truncate text-[11px] text-muted-foreground">{userEmail}</span>
              </span>
            </div>
            <Settings2 className="size-4 shrink-0 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-xs font-bold text-muted-foreground transition hover:border-danger-foreground/40 hover:bg-danger-bg hover:text-danger-foreground"
            >
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
  className,
}: {
  label: string;
  items: typeof primaryItems;
  pathname: string;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-1">
        {items.map(({ href, label: itemLabel, icon: Icon }) => {
          const active = isCurrentPath(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-primary-bg text-primary-dark"
                  : "text-muted-foreground hover:bg-primary-bg hover:text-primary-dark",
              )}
            >
              <Icon className="size-4" />
              {itemLabel}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
