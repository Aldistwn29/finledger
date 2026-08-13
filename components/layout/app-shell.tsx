"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/theme/theme-toggle";
import AppSidebar from "./app-sidebar";
import MobileBottomNav from "./mobile-bottom-nav";

type AppShellProps = {
  children: ReactNode;
  businessName: string;
  businessType: "GROCERY" | "PULSE";
  userName: string;
  userEmail: string;
};

export default function AppShell({
  children,
  businessName,
  businessType,
  userName,
  userEmail,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        businessName={businessName}
        businessType={businessType}
        userName={userName}
        userEmail={userEmail}
        pathname={pathname}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={logout}
      />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka navigasi"
            aria-expanded={mobileOpen}
            className="grid size-10 place-items-center rounded-xl border text-primary-dark transition hover:bg-primary-bg"
          >
            <span className="sr-only">Buka menu</span>
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
            </span>
          </button>
          <p className="truncate px-3 text-sm font-extrabold">{businessName}</p>
          <ThemeToggle />
        </header>

        <div className="min-w-0 pb-20 lg:pb-0">{children}</div>
      </div>

      <MobileBottomNav pathname={pathname} />
    </div>
  );
}
