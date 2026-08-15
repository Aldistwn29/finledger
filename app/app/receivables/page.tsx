import type { Metadata } from "next";
import { HandCoins } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, Money, PageHeader, StatusBadge } from "@/components/dashboard/dashboard-bits";
import DebtPaymentForm from "@/components/receivables/debt-payment-form";
import { getPulseReceivables } from "@/db/queries/pulse/receivables";
import { requireUser } from "@/lib/auth/get-current-context";
import { createDebtPayment } from "./actions";

export const metadata: Metadata = {
  title: "Piutang | FinLedger",
  description: "Daftar dan pembayaran piutang pelanggan.",
};

function formatDate(value: string | null) {
  if (!value) return "Tanpa jatuh tempo";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function ReceivablesPage() {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  if (context.business.business_type !== "PULSE") {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-6">
            <h1 className="text-2xl font-extrabold">Piutang belum tersedia</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Fitur ini khusus untuk bisnis pulsa.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const receivables = await getPulseReceivables(context.business.id);
  const totalOutstanding = receivables.reduce(
    (sum, debt) => sum + debt.outstandingAmount,
    0,
  );

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Piutang"
        description="Pantau dan catat pembayaran pelanggan."
      />

      <Card className="border-accent/40 bg-warning-bg">
        <CardContent className="flex items-center gap-3 p-5">
          <div className="grid size-10 place-items-center rounded-xl bg-card/70 text-warning-foreground">
            <HandCoins className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-warning-foreground">
              Total piutang aktif
            </p>
            <Money value={totalOutstanding} className="mt-1 block text-xl font-extrabold text-warning-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {receivables.length === 0 ? (
            <EmptyState
              title="Tidak ada piutang aktif"
              description="Piutang dari transaksi hutang akan muncul di sini."
            />
          ) : (
            <div className="space-y-3">
              {receivables.map((debt) => (
                <article key={debt.id} className="rounded-2xl border bg-background p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-sm font-extrabold">{debt.customerName}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Jatuh tempo: {formatDate(debt.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                      <Money value={debt.outstandingAmount} className="block text-lg font-extrabold" />
                      <div className="mt-1"><StatusBadge status={debt.status} /></div>
                    </div>
                  </div>
                  <DebtPaymentForm debtId={debt.id} action={createDebtPayment} />
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
