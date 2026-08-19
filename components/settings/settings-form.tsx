"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { SettingsActionState } from "@/app/app/settings/actions";

type SettingsAction = (
  previousState: SettingsActionState,
  formData: FormData,
) => Promise<SettingsActionState>;

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border bg-input px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function SettingsForm({
  fullName,
  businessName,
  businessPhone,
  businessAddress,
  action,
}: {
  fullName: string;
  businessName: string;
  businessPhone: string | null;
  businessAddress: string | null;
  action: SettingsAction;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="text-sm font-bold">
          Nama pengguna
        </label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={fullName}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="businessName" className="text-sm font-bold">
          Nama bisnis
        </label>
        <input
          id="businessName"
          name="businessName"
          defaultValue={businessName}
          required
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="businessPhone" className="text-sm font-bold">
          Nomor telepon bisnis
        </label>
        <input
          id="businessPhone"
          name="businessPhone"
          type="tel"
          defaultValue={businessPhone ?? ""}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="businessAddress" className="text-sm font-bold">
          Alamat bisnis
        </label>
        <textarea
          id="businessAddress"
          name="businessAddress"
          rows={3}
          defaultValue={businessAddress ?? ""}
          className="mt-2 w-full rounded-xl border bg-input px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            Menyimpan...
          </>
        ) : (
          "Simpan pengaturan"
        )}
      </Button>
    </form>
  );
}
