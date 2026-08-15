"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type {
  CustomerAction,
} from "@/services/customers/types";

export default function CustomerDeactivateForm({
  customerId,
  action,
}: {
  customerId: string;
  action: CustomerAction;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="customerId" value={customerId} />
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Nonaktifkan"}
      </Button>
      {state.error ? (
        <p role="alert" className="mt-2 text-xs text-danger-foreground">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
