"use client";

import { useActionState } from "react";
import { createBusiness, type BusinessActionState } from "./action";
import { Button } from "@/components/ui/button";

const initialState: BusinessActionState = {};

export default function BusinessForm() {
  const [state, formAction, isPending] = useActionState(
    createBusiness,
    initialState,
  );

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
          Nomor telepon <span className="font-normal text-muted-foreground">(opsional)</span>
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
          Alamat <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          className="bg-input focus:border-primary focus:ring-primary/20 mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-foreground">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan bisnis"}
      </Button>
    </form>
  );
}
