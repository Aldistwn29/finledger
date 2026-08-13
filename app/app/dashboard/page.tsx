import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  HandCoins,
  Plus,
  ReceiptText,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EmptyState,
  MetricCard,
  Money,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-bits";
import PulseDashboardChart from "@/components/dashboard/pulse-dashboard-chart";
import ThemeToggle from "@/components/theme/theme-toggle";
import { requireUser } from "@/lib/auth/get-current-context";
import { getPulseDashboard } from "@/services/reports/get-pulse-dashboard";

function formatDate(value: string | null) {
  if (!value) return "Belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export const metadata = {
  title: "Dashboard Pulsa | FinLedger",
  description: "Ringkasan penjualan, kas, modal, margin, dan piutang usaha pulsa.",
};

export default async function PulseDashboardPage() {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  if (context.business.business_type !== "PULSE") {
    return (
      <main className="p-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-extrabold">Dashboard belum tersedia</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Dashboard ini khusus untuk bisnis pulsa.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const dashboard = await getPulseDashboard(context.business.id);
  const overdueCount = dashboard.activeDebts.filter(
    (debt) => debt.status === "OVERDUE",
  ).length;

  return (
    <main className="min-w-0 space-y-6 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={`Halo, ${context.business.name}`}
        description="Ringkasan aktivitas usaha pulsa Anda."
        action={
          <div className="flex min-w-0 w-full items-center gap-2 sm:w-auto">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <Link href="/app/sales/new" className="min-w-0 flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto">
                <Plus className="size-4" />
                Catat penjualan
              </Button>
            </Link>
          </div>
        }
      />

      <section aria-label="Ringkasan keuangan" className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <MetricCard label="Penjualan hari ini" value={<Money value={dashboard.salesToday} />} hint="Total transaksi hari ini" icon={<ReceiptText className="size-4" />} />
        <MetricCard label="Penjualan bulan ini" value={<Money value={dashboard.salesMonth} />} hint="Total nilai penjualan" icon={<ReceiptText className="size-4" />} tone="success" />
        <MetricCard label="Saldo usaha" value={<Money value={dashboard.cashBalance} />} hint="Dari transaksi kas" icon={<Wallet className="size-4" />} tone="success" />
        <MetricCard label="Margin bulan ini" value={<Money value={dashboard.monthlyMargin} />} hint="Harga jual dikurangi modal" icon={<ArrowUpRight className="size-4" />} tone="gold" />
        <MetricCard label="Piutang aktif" value={<Money value={dashboard.activeDebt} />} hint="Total yang belum dibayar" icon={<HandCoins className="size-4" />} tone="gold" />
        <MetricCard label="Piutang terlambat" value={<Money value={dashboard.overdueDebt} />} hint={`${overdueCount} piutang perlu ditagih`} icon={<AlertTriangle className="size-4" />} tone="coral" />
        <MetricCard label="Modal bulan ini" value={<Money value={dashboard.monthlyCapital} />} hint="Tambahan modal usaha" icon={<Wallet className="size-4" />} />
        <MetricCard label="Pengeluaran bulan ini" value={<Money value={dashboard.monthlyExpense} />} hint="Pengeluaran operasional" icon={<Clock className="size-4" />} tone="coral" />
      </section>

      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <CardTitle>Tren penjualan 14 hari</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Total nilai transaksi per hari.</p>
          </div>
          <Money value={dashboard.chartData.reduce((total, item) => total + item.total, 0)} className="text-sm font-bold text-primary" />
        </CardHeader>
        <CardContent><PulseDashboardChart data={dashboard.chartData} /></CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transaksi terbaru</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Penjualan pulsa terbaru.</p>
            </div>
            <Link href="/app/sales" className="text-sm font-bold text-primary-dark hover:underline">Lihat semua</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboard.recentSales.length === 0 ? (
              <EmptyState title="Belum ada transaksi" description="Mulai dengan mencatat penjualan pulsa." />
            ) : dashboard.recentSales.map((sale) => (
              <Link key={sale.id} href={`/app/sales/${sale.id}`} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border bg-background p-3 transition hover:border-primary/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{sale.description}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{sale.customerName} · {formatDateTime(sale.soldAt)}</p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 text-left sm:block sm:text-right">
                  <Money value={sale.total} className="text-sm font-extrabold" />
                  <div className="mt-1"><StatusBadge status={sale.paymentStatus} /></div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden border-coral/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="size-4 text-coral" />Peringatan piutang</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Piutang yang perlu segera diperhatikan.</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboard.activeDebts.length === 0 ? <EmptyState title="Tidak ada piutang aktif" /> : dashboard.activeDebts.map((debt) => (
              <Link key={debt.id} href={`/app/receivables/${debt.id}`} className="block rounded-2xl border border-border bg-background p-3 transition hover:border-coral/50">
                <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"><p className="max-w-full truncate text-sm font-bold">{debt.customerName}</p><StatusBadge status={debt.status} /></div>
                <p className="mt-2 text-xs text-muted-foreground">Jatuh tempo: {formatDate(debt.dueDate)}</p>
                <Money value={debt.outstanding} className="mt-1 block text-sm font-extrabold" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
