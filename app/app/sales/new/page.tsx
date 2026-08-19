import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Smartphone } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import SaleForm from "@/components/pulse/sales/sale-form";
import { getActiveCustomers } from "@/db/queries/customers";
import { requireUser } from "@/lib/auth/get-current-context";
import { createPulseSale } from "../actions";

export const metadata: Metadata = {
  title: "Catat Penjualan | FinLedger",
  description: "Catat transaksi penjualan pulsa.",
};

export default async function NewSalePage() {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  const business = context.business;

  if (business.business_type !== "PULSE") {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold">Form belum tersedia</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Form ini khusus untuk bisnis pulsa.
            </p>
            <Link
              href="/app/dashboard"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold text-primary-dark transition hover:bg-primary-bg"
            >
              Kembali ke dashboard
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const customers = await getActiveCustomers(business.id);

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <Link
          href="/app/sales"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark hover:underline"
        >
          <ArrowLeft className="size-4" />
          Kembali ke penjualan
        </Link>

        <div className="mt-5 flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-bg text-primary-dark">
            <Smartphone className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Catat penjualan pulsa
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Catat nominal, pembayaran, dan keuntungan transaksi.
            </p>
          </div>
        </div>
      </header>

      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-5 sm:p-8">
          <SaleForm customers={customers} action={createPulseSale} />
        </CardContent>
      </Card>
    </main>
  );
}
