import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Edit3, Phone, UserRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Money, StatusBadge } from "@/components/dashboard/dashboard-bits";
import CustomerDeactivateForm from "@/components/customers/customer-deactivate-form";
import { getCustomerDetail } from "@/db/queries/customers";
import { requireUser } from "@/lib/auth/get-current-context";
import { deactivateCustomerAction } from "../actions";

type CustomerDetailPageProps = {
  params: Promise<{ customerId: string }>;
};

export async function generateMetadata({
  params,
}: CustomerDetailPageProps): Promise<Metadata> {
  const { customerId } = await params;
  const context = await requireUser();

  if (!context.business) {
    return { title: "Customer | FinLedger" };
  }

  const customer = await getCustomerDetail(context.business.id, customerId);
  return {
    title: customer ? `${customer.name} | FinLedger` : "Customer | FinLedger",
  };
}

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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  const { customerId } = await params;
  const customer = await getCustomerDetail(context.business.id, customerId);

  if (!customer) {
    notFound();
  }

  const outstandingDebt = customer.debts.reduce(
    (sum, debt) => sum + debt.outstandingAmount,
    0,
  );

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/app/customers"
        className="inline-flex items-center gap-2 text-sm font-bold text-primary-dark hover:underline"
      >
        <ArrowLeft className="size-4" />
        Kembali ke customer
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-bg text-primary-dark">
            <UserRound className="size-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
                {customer.name}
              </h1>
              <span className="rounded-full bg-primary-bg px-2.5 py-1 text-[11px] font-bold text-primary-dark">
                {customer.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              {customer.phone ? <Phone className="size-4" /> : null}
              {customer.phone ?? "Nomor telepon belum diisi"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/app/customers/${customer.id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold text-primary-dark transition hover:bg-primary-bg"
          >
            <Edit3 className="size-4" />
            Edit
          </Link>
          {customer.isActive ? (
            <CustomerDeactivateForm
              customerId={customer.id}
              action={deactivateCustomerAction}
            />
          ) : null}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Piutang aktif</p>
            <Money value={outstandingDebt} className="mt-2 block text-xl font-extrabold" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total transaksi</p>
            <p className="mt-2 text-xl font-extrabold">{customer.sales.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Bergabung sejak</p>
            <p className="mt-2 text-sm font-extrabold">{formatDate(customer.createdAt)}</p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat piutang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.debts.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                Belum ada riwayat piutang.
              </p>
            ) : (
              customer.debts.map((debt) => (
                <div key={debt.id} className="rounded-2xl border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">
                        Sisa <Money value={debt.outstandingAmount} />
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Dari <Money value={debt.totalAmount} /> · tempo {formatDate(debt.dueDate)}
                      </p>
                    </div>
                    <StatusBadge status={debt.status} />
                  </div>
                  {debt.payments.length > 0 ? (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-xs font-bold text-muted-foreground">Pembayaran terakhir</p>
                      <p className="mt-1 text-xs">
                        <Money value={debt.payments[0].amount} /> · {formatDateTime(debt.payments[0].paidAt)}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat transaksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.sales.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                Belum ada transaksi.
              </p>
            ) : (
              customer.sales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between gap-3 rounded-2xl border bg-background p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{sale.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {sale.serviceType ?? "Layanan"} · {formatDateTime(sale.soldAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Money value={sale.totalAmount} className="block text-sm font-extrabold" />
                    <div className="mt-1"><StatusBadge status={sale.paymentStatus} /></div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {customer.address || customer.notes ? (
        <Card>
          <CardHeader><CardTitle>Catatan customer</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {customer.address ? <p><span className="font-bold">Alamat:</span> {customer.address}</p> : null}
            {customer.notes ? <p><span className="font-bold">Catatan:</span> {customer.notes}</p> : null}
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
