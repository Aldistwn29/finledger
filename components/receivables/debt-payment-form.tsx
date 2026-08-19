"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { DebtPaymentActionState } from "@/app/app/receivables/actions";

type DebtPaymentAction = (
  previousState: DebtPaymentActionState,
  formData: FormData,
) => Promise<DebtPaymentActionState>;

export default function DebtPaymentForm({
  debtId,
  action,
}: {
  debtId: string;
  action: DebtPaymentAction;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-4 border-t pt-4">
      <input type="hidden" name="debtId" value={debtId} />
      <label htmlFor={`amount-${debtId}`} className="text-xs font-bold">
        Catat pembayaran
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={`amount-${debtId}`}
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="Nominal pembayaran"
          required
          className="h-10 min-w-0 flex-1 rounded-xl border bg-input px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
      {state.error ? (
        <p role="alert" className="mt-2 text-xs text-danger-foreground">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
