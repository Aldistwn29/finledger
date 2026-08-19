import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingsForm from "@/components/settings/settings-form";
import { requireUser } from "@/lib/auth/get-current-context";
import { updateSettingsAction } from "./actions";

export const metadata: Metadata = {
  title: "Pengaturan | FinLedger",
  description: "Kelola profil dan informasi bisnis.",
};

export default async function SettingsPage() {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Pengaturan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kelola informasi akun dan bisnis Anda.
        </p>
      </header>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profil dan bisnis</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            fullName={context.profile.full_name}
            businessName={context.business.name}
            businessPhone={context.business.phone}
            businessAddress={context.business.address}
            action={updateSettingsAction}
          />
        </CardContent>
      </Card>
    </main>
  );
}
