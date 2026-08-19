import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ReceiptText } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmptyState,
  Money,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-bits";
import { getPulseSales } from "@/db/queries/pulse/sales";
import { requireUser } from "@/lib/auth/get-current-context";

export const metadata: Metadata = {
  title: "Penjualan | FinLedger",
  description: "Daftar penjualan pulsa usaha Anda.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function SalesPage() {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  if (context.business.business_type !== "PULSE") {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-6">
            <h1 className="text-2xl font-extrabold">
              Penjualan belum tersedia
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Halaman ini khusus untuk bisnis pulsa.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const sales = await getPulseSales(context.business.id);

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Penjualan"
        description="Catat dan lihat transaksi pulsa usaha Anda."
        action={
          <Link href="/app/sales/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="size-4" />
              Catat penjualan
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-4 sm:p-6">
          {sales.length === 0 ? (
            <EmptyState
              title="Belum ada penjualan"
              description="Mulai dengan mencatat transaksi pulsa pertama Anda."
            />
          ) : (
            <div className="space-y-3">
              {sales.map((sale) => (
                <article
                  key={sale.id}
                  className="rounded-2xl border bg-background p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-bg text-primary-dark">
                        <ReceiptText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-extrabold">
                          {sale.description}
                        </h2>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {sale.serviceType} · {sale.customerName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(sale.soldAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:block sm:text-right">
                      <div>
                        <Money
                          value={sale.totalAmount}
                          className="text-sm font-extrabold"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Margin {" "}
                          <Money
                            value={sale.marginAmount}
                            className="font-bold text-primary-dark"
                          />
                        </p>
                      </div>
                      <div className="sm:mt-2">
                        <StatusBadge status={sale.paymentStatus} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
