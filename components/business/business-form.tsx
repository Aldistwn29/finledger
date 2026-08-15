"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";

export type BusinessActionState = {
  error?: string;
};

type BusinessAction = (
  previousState: BusinessActionState,
  formData: FormData,
) => Promise<BusinessActionState>;

const initialState: BusinessActionState = {};

export default function BusinessForm({ action }: { action: BusinessAction }) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-bold">
          Nama bisnis
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="organization"
          placeholder="Contoh: Warung Berkah"
          className="bg-input focus:border-primary focus:ring-primary/20 mt-2 h-11 w-full rounded-xl border px-4 text-sm outline-none focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="businessType" className="text-sm font-bold">
          Jenis bisnis
        </label>
        <select
          id="businessType"
          name="businessType"
          required
          defaultValue=""
          className="bg-input focus:border-primary focus:ring-primary/20 mt-2 h-11 w-full rounded-xl border px-4 text-sm outline-none focus:ring-2"
        >
          <option value="" disabled>
            Pilih jenis bisnis
          </option>
          <option value="GROCERY">Warung sembako</option>
          <option value="PULSE">Usaha pulsa</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-bold">
          Nomor telepon{" "}
          <span className="text-muted-foreground font-normal">(opsional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="bg-input focus:border-primary focus:ring-primary/20 mt-2 h-11 w-full rounded-xl border px-4 text-sm outline-none focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="address" className="text-sm font-bold">
          Alamat{" "}
          <span className="text-muted-foreground font-normal">(opsional)</span>
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          className="bg-input focus:border-primary focus:ring-primary/20 mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="bg-danger-bg text-danger-foreground rounded-xl px-4 py-3 text-sm"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan bisnis"}
      </Button>
    </form>
  );
}
