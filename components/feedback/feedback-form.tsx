"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { FeedbackActionState } from "@/app/app/feedback/actions";

type FeedbackAction = (
  previousState: FeedbackActionState,
  formData: FormData,
) => Promise<FeedbackActionState>;

export default function FeedbackForm({ action }: { action: FeedbackAction }) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="category" className="text-sm font-bold">
          Jenis feedback
        </label>
        <select
          id="category"
          name="category"
          defaultValue="BUG"
          className="mt-2 h-11 w-full rounded-xl border bg-input px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="BUG">Melaporkan masalah</option>
          <option value="SUGGESTION">Ide atau saran</option>
          <option value="OTHER">Lainnya</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-bold">
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Tuliskan feedback Anda..."
          className="mt-2 w-full rounded-xl border bg-input px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-foreground">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          "Kirim feedback"
        )}
      </Button>
    </form>
  );
}
