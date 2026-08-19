import Link from "next/link";
import { ArrowUpRight, Phone, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState, Money } from "@/components/dashboard/dashboard-bits";
import type { CustomerListItem } from "@/services/customers/types";

export default function CustomerList({
  customers,
}: {
  customers: CustomerListItem[];
}) {
  if (customers.length === 0) {
    return (
      <EmptyState
        title="Belum ada customer"
        description="Tambahkan customer untuk mulai mencatat transaksi hutang."
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {customers.map((customer) => (
        <Card key={customer.id} className="p-4 transition hover:border-primary/50">
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-bg text-primary-dark">
                <Users className="size-4" />
              </div>
              <div className="min-w-0">
                <Link
                  href={`/app/customers/${customer.id}`}
                  className="block truncate text-sm font-extrabold hover:text-primary-dark hover:underline"
                >
                  {customer.name}
                </Link>
                <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                  {customer.phone ? <Phone className="size-3" /> : null}
                  {customer.phone ?? "Nomor telepon belum diisi"}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                customer.isActive
                  ? "bg-primary-bg text-primary-dark"
                  : "bg-muted/20 text-muted-foreground"
              }`}
            >
              {customer.isActive ? "Aktif" : "Nonaktif"}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Piutang aktif</p>
              <Money
                value={customer.outstandingDebt}
                className="mt-1 block text-sm font-extrabold"
              />
            </div>
            <Link
              href={`/app/customers/${customer.id}`}
              aria-label={`Lihat detail ${customer.name}`}
              className="grid size-9 place-items-center rounded-full border text-primary-dark transition hover:bg-primary-bg"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
