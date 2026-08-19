"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type {
  CustomerAction,
  CustomerActionState,
  CustomerDetail,
} from "@/services/customers/types";

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border bg-input px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1.5 text-xs text-danger-foreground">{message}</p>
  ) : null;
}

export default function CustomerForm({
  action,
  customer,
}: {
  action: CustomerAction;
  customer?: CustomerDetail;
}) {
  const [state, formAction, isPending] = useActionState<CustomerActionState, FormData>(
    action,
    {},
  );
  const editing = Boolean(customer);

  return (
    <form action={formAction} className="space-y-5">
      {customer ? (
        <input type="hidden" name="customerId" value={customer.id} />
      ) : null}

      <div>
        <label htmlFor="name" className="text-sm font-bold">
          Nama customer
        </label>
        <input
          id="name"
          name="name"
          defaultValue={customer?.name ?? ""}
          required
          autoComplete="name"
          placeholder="Contoh: Sari"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          className={inputClassName}
        />
        <FieldError message={state.fieldErrors?.name} />
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-bold">
          Nomor telepon{" "}
          <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          defaultValue={customer?.phone ?? ""}
          autoComplete="tel"
          placeholder="Contoh: 081234567890"
          aria-invalid={Boolean(state.fieldErrors?.phone)}
          className={inputClassName}
        />
        <FieldError message={state.fieldErrors?.phone} />
      </div>

      <div>
        <label htmlFor="address" className="text-sm font-bold">
          Alamat{" "}
          <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          defaultValue={customer?.address ?? ""}
          placeholder="Alamat customer"
          aria-invalid={Boolean(state.fieldErrors?.address)}
          className="mt-2 w-full rounded-xl border bg-input px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <FieldError message={state.fieldErrors?.address} />
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-bold">
          Catatan{" "}
          <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={customer?.notes ?? ""}
          placeholder="Catatan tambahan"
          aria-invalid={Boolean(state.fieldErrors?.notes)}
          className="mt-2 w-full rounded-xl border bg-input px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <FieldError message={state.fieldErrors?.notes} />
      </div>

      {state.error ? (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-foreground"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href={editing ? `/app/customers/${customer?.id}` : "/app/customers"}
          className="inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold text-primary-dark transition hover:bg-primary-bg"
        >
          Batal
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : editing ? (
            "Simpan perubahan"
          ) : (
            "Tambah customer"
          )}
        </Button>
      </div>
    </form>
  );
}
