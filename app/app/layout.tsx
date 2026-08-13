import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/get-current-context";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  return (
    <AppShell
      businessName={context.business.name}
      businessType={context.business.business_type}
      userName={context.profile.full_name}
      userEmail={context.user.email ?? ""}
    >
      {children}
    </AppShell>
  );
}
