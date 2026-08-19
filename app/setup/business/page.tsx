import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BusinessForm from "@/components/business/business-form";
import { getCurrentContext } from "@/lib/auth/get-current-context";
import { APP_ROLES } from "@/lib/auth/roles";
import { createBusiness } from "./actions";

export const metadata: Metadata = {
  title: "Setup Bisnis | Finledger",
};

export default async function SetupBusinessPage() {
  const context = await getCurrentContext();

  if (!context) {
    redirect("/login");
  }

  if (context.profile.role === APP_ROLES.ADMIN) {
    redirect("/admin/dashboard");
  }

  if (context.business) {
    redirect("/app/dashboard");
  }
  return (
    <main className="flex min-h-screen justify-center px-4 py-10">
      <section className="bg-card w-full max-w-lg rounded-3xl border p-6 shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--primary)_22%,transparent)] sm:p-8">
        <h1 className="text-2xl font-extrabold">Siapkan bisnis Anda</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Lengkapi data bisnis Anda untuk mulai menggunakan FinLedger.
        </p>
        <BusinessForm action={createBusiness} />
      </section>
    </main>
  );
}
