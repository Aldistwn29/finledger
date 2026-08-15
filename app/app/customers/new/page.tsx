import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerForm from "@/components/customers/customer-form";
import { requireUser } from "@/lib/auth/get-current-context";
import { createCustomerAction } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Customer | FinLedger",
  description: "Tambahkan customer baru.",
};

export default async function NewCustomerPage() {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Tambah customer
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Simpan informasi dasar customer untuk transaksi dan piutang.
        </p>
      </header>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi customer</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm action={createCustomerAction} />
        </CardContent>
      </Card>
    </main>
  );
}
