import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/dashboard-bits";
import CustomerList from "@/components/customers/customer-list";
import { getCustomers } from "@/db/queries/customers";
import { requireUser } from "@/lib/auth/get-current-context";
import type { CustomerStatusFilter } from "@/services/customers/types";

export const metadata: Metadata = {
  title: "Customer | FinLedger",
  description: "Kelola customer dan lihat ringkasan piutang.",
};

type CustomersPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
  }>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getStatus(value: string): CustomerStatusFilter {
  return value === "ACTIVE" || value === "INACTIVE" ? value : "ALL";
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  const params = await searchParams;
  const search = getValue(params.q).trim();
  const status = getStatus(getValue(params.status));
  const customers = await getCustomers(context.business.id, { search, status });

  const filterHref = (nextStatus: CustomerStatusFilter) => {
    const query = new URLSearchParams();
    if (search) query.set("q", search);
    if (nextStatus !== "ALL") query.set("status", nextStatus);
    const value = query.toString();
    return value ? `/app/customers?${value}` : "/app/customers";
  };

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Customer"
        description="Kelola data customer dan pantau piutang mereka."
        action={
          <Link href="/app/customers/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="size-4" />
              Tambah customer
            </Button>
          </Link>
        }
      />

      <form
        method="get"
        className="flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:flex-row"
      >
        <label htmlFor="customer-search" className="sr-only">
          Cari customer
        </label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="customer-search"
            name="q"
            defaultValue={search}
            placeholder="Cari nama atau nomor telepon"
            className="h-11 w-full rounded-xl border bg-input pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {status !== "ALL" ? (
          <input type="hidden" name="status" value={status} />
        ) : null}
        <Button type="submit" variant="outline">
          Cari
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {(["ALL", "ACTIVE", "INACTIVE"] as const).map((filter) => (
          <Link
            key={filter}
            href={filterHref(filter)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              status === filter
                ? "border-primary bg-primary-bg text-primary-dark"
                : "text-muted-foreground hover:border-primary/40 hover:bg-primary-bg hover:text-primary-dark"
            }`}
          >
            {filter === "ALL"
              ? "Semua"
              : filter === "ACTIVE"
                ? "Aktif"
                : "Nonaktif"}
          </Link>
        ))}
      </div>

      <CustomerList customers={customers} />
    </main>
  );
}
