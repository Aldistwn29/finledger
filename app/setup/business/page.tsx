import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BusinessForm from "./business-form";

export const metadata: Metadata = {
  title: "Setup Bisnis | Finledger",
};

export default async function SetupBusinessPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "Admin") {
    redirect("/admin/dashboard");
  }

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membership) {
    redirect("/app/dashboard");
  }

  return (
    <main className="flex min-h-screen justify-center px-4 py-10">
      <section className="bg-card w-full max-w-lg rounded-3xl border p-6 shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--primary)_22%,transparent)] sm:p-8">
        <h1 className="text-2xl font-extrabold">Siapkan bisnis Anda</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Lengkapi data bisnis Anda untuk mulai menggunakan FinLedger.
        </p>
        <BusinessForm />
      </section>
    </main>
  );
}
