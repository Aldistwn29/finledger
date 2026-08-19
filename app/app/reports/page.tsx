import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmptyState,
  Money,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-bits";
import { requireUser } from "@/lib/auth/get-current-context";
import {
  getPulseSalesReport,
  type SalesReportPeriod,
} from "@/services/pulse/reports/get-sales-report";

export const metadata: Metadata = {
  title: "Laporan Penjualan | FinLedger",
  description: "Laporan penjualan pulsa mingguan dan bulanan.",
};

type ReportsPageProps = {
  searchParams: Promise<{ period?: string | string[] }>;
};

function getPeriod(value: string | string[] | undefined): SalesReportPeriod {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected === "month" ? "month" : "week";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ReportsPage({
  searchParams,
}: ReportsPageProps) {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  if (context.business.business_type !== "PULSE") {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-6">
            <h1 className="text-2xl font-extrabold">Laporan belum tersedia</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Laporan ini khusus untuk bisnis pulsa.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const params = await searchParams;
  const period = getPeriod(params.period);
  const report = await getPulseSalesReport(context.business.id, period);

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Laporan penjualan"
        description="Evaluasi transaksi pulsa berdasarkan periode."
      />

      <div className="flex rounded-2xl border bg-card p-1 sm:w-fit">
        <Link
          href="/app/reports?period=week"
          className={`flex-1 rounded-xl px-5 py-2.5 text-center text-sm font-bold transition sm:flex-none ${
            period === "week"
              ? "bg-primary-bg text-primary-dark"
              : "text-muted-foreground hover:bg-primary-bg"
          }`}
        >
          Mingguan
        </Link>
        <Link
          href="/app/reports?period=month"
          className={`flex-1 rounded-xl px-5 py-2.5 text-center text-sm font-bold transition sm:flex-none ${
            period === "month"
              ? "bg-primary-bg text-primary-dark"
              : "text-muted-foreground hover:bg-primary-bg"
          }`}
        >
          Bulanan
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        {formatDate(report.start)} - {formatDate(report.end)}
      </p>

      <section aria-label="Ringkasan laporan" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">Total penjualan</p>
            <Money value={report.totalSales} className="mt-3 block text-xl font-extrabold" />
            <p className="mt-1 text-xs text-muted-foreground">{report.transactionCount} transaksi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">Kas diterima</p>
            <Money value={report.cashReceived} className="mt-3 block text-xl font-extrabold text-primary-dark" />
            <p className="mt-1 text-xs text-muted-foreground">Pembayaran aktual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">Keuntungan</p>
            <Money value={report.totalMargin} className="mt-3 block text-xl font-extrabold text-primary-dark" />
            <p className="mt-1 text-xs text-muted-foreground">Harga jual dikurangi modal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-muted-foreground">Sisa piutang</p>
            <Money value={report.totalOutstanding} className="mt-3 block text-xl font-extrabold text-warning-foreground" />
            <p className="mt-1 text-xs text-muted-foreground">Dari transaksi periode ini</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary-bg text-primary-dark">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h2 className="font-extrabold">Rincian transaksi</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Lunas {report.paidCount} · Hutang {report.creditCount} · Sebagian {report.partialCount}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {report.sales.length === 0 ? (
              <EmptyState title="Belum ada transaksi pada periode ini" />
            ) : (
              report.sales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex flex-col gap-3 rounded-2xl border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{sale.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(sale.soldAt)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                      <Money value={sale.total} className="block text-sm font-extrabold" />
                      <Money value={sale.margin} className="mt-1 block text-xs font-semibold text-primary-dark" />
                    </div>
                    <StatusBadge status={sale.paymentStatus} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
