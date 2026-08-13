"use client";

import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  ReceiptText,
  Users,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/app/sales", label: "Penjualan", icon: ReceiptText },
  { href: "/app/receivables", label: "Piutang", icon: WalletCards },
  { href: "/app/customers", label: "Pelanggan", icon: Users },
  { href: "/app/reports", label: "Laporan", icon: BarChart3 },
];

function isCurrentPath(pathname: string, href: string) {
  return href === "/app/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Navigasi mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-20px_var(--surface-dark)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-stretch">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isCurrentPath(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition",
                active
                  ? "text-primary-dark"
                  : "text-muted-foreground hover:text-primary-dark",
              )}
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-xl transition",
                  active && "bg-primary-bg",
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
