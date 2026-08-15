"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  minorUnitsToCurrency,
  parseMoneyToMinorUnits,
} from "@/lib/financial/money";
import type {
  ActiveCustomer,
  CreatePulseSaleAction,
  PulseSalePaymentStatus,
  SaleActionState,
  SaleFieldName,
} from "@/services/pulse/sales/types";

type SaleFormProps = {
  customers: ActiveCustomer[];
  action: CreatePulseSaleAction;
};

const initialState: SaleActionState = {};

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border bg-input px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const serviceOptions = [
  { value: "Pulsa telepon", label: "Pulsa telepon" },
  { value: "Paket data", label: "Paket data" },
  { value: "Token listrik", label: "Token listrik" },
  { value: "Lainnya", label: "Lainnya" },
];

const paymentOptions: Array<{
  value: PulseSalePaymentStatus;
  label: string;
  description: string;
}> = [
  {
    value: "PAID",
    label: "Lunas",
    description: "Dibayar penuh",
  },
  {
    value: "CREDIT",
    label: "Hutang",
    description: "Belum dibayar",
  },
  {
    value: "PARTIAL",
    label: "Sebagian",
    description: "Dibayar sebagian",
  },
];

function parsePreviewAmount(value: string): bigint | null {
  if (!value.trim()) {
    return null;
  }

  try {
    return parseMoneyToMinorUnits(value);
  } catch {
    return null;
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-danger-foreground mt-1.5 text-xs">
      {message}
    </p>
  );
}

export default function SaleForm({ customers, action }: SaleFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [paymentStatus, setPaymentStatus] =
    useState<PulseSalePaymentStatus>("PAID");

  const [costAmount, setCostAmount] = useState("");
  const [sellingAmount, setSellingAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const costPreview = parsePreviewAmount(costAmount);
  const sellingPreview = parsePreviewAmount(sellingAmount);

  const profitPreview =
    costPreview !== null && sellingPreview !== null
      ? sellingPreview - costPreview
      : null;

  const requiresCustomer = paymentStatus !== "PAID";
  const isPartial = paymentStatus === "PARTIAL";

  function fieldError(field: SaleFieldName) {
    return state.fieldErrors?.[field];
  }

  function changePaymentStatus(nextStatus: PulseSalePaymentStatus) {
    setPaymentStatus(nextStatus);

    if (nextStatus === "PAID") {
      setPaidAmount(sellingAmount);
    }

    if (nextStatus === "CREDIT") {
      setPaidAmount("0");
    }

    if (nextStatus === "PARTIAL") {
      setPaidAmount("");
    }
  }

  function changeSellingAmount(value: string) {
    setSellingAmount(value);

    if (paymentStatus === "PAID") {
      setPaidAmount(value);
    }
  }

  const serverPaidAmount =
    paymentStatus === "PAID"
      ? sellingAmount
      : paymentStatus === "CREDIT"
        ? "0"
        : paidAmount;

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="description" className="text-sm font-bold">
          Nama transaksi
        </label>

        <input
          id="description"
          name="description"
          type="text"
          placeholder="Contoh: Pulsa Telkomsel 25.000"
          required
          aria-invalid={Boolean(fieldError("description"))}
          aria-describedby={
            fieldError("description") ? "description-error" : undefined
          }
          className={inputClassName}
        />

        <FieldError
          id="description-error"
          message={fieldError("description")}
        />
      </div>

      <div>
        <label htmlFor="serviceType" className="text-sm font-bold">
          Jenis layanan
        </label>

        <select
          id="serviceType"
          name="serviceType"
          defaultValue=""
          required
          aria-invalid={Boolean(fieldError("serviceType"))}
          aria-describedby={
            fieldError("serviceType") ? "serviceType-error" : undefined
          }
          className={inputClassName}
        >
          <option value="" disabled>
            Pilih jenis layanan
          </option>

          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <FieldError
          id="serviceType-error"
          message={fieldError("serviceType")}
        />
      </div>

      <div>
        <label htmlFor="customerId" className="text-sm font-bold">
          Pelanggan{" "}
          <span className="text-muted-foreground font-normal">
            {requiresCustomer ? "*" : "(opsional)"}
          </span>
        </label>

        <select
          id="customerId"
          name="customerId"
          defaultValue=""
          required={requiresCustomer}
          aria-invalid={Boolean(fieldError("customerId"))}
          aria-describedby={
            fieldError("customerId") ? "customerId-error" : undefined
          }
          className={inputClassName}
        >
          <option value="">
            {requiresCustomer ? "Pilih pelanggan" : "Pelanggan umum"}
          </option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        {requiresCustomer && customers.length === 0 ? (
          <p className="text-warning-foreground mt-1.5 text-xs">
            Belum ada pelanggan aktif.
          </p>
        ) : null}

        <FieldError id="customerId-error" message={fieldError("customerId")} />
      </div>

      <div>
        <p className="text-sm font-bold">Status pembayaran</p>

        <div
          className="mt-2 grid gap-3 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Status pembayaran"
        >
          {paymentOptions.map((option) => {
            const isSelected = paymentStatus === option.value;

            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  isSelected
                    ? "border-primary bg-primary-bg"
                    : "bg-card hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentStatus"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => changePaymentStatus(option.value)}
                  className="sr-only"
                />

                <span className="block text-sm font-extrabold">
                  {option.label}
                </span>

                <span className="text-muted-foreground mt-1 block text-xs">
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>

        <FieldError
          id="paymentStatus-error"
          message={fieldError("paymentStatus")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="costAmount" className="text-sm font-bold">
            Modal
          </label>

          <input
            id="costAmount"
            name="costAmount"
            type="text"
            inputMode="decimal"
            placeholder="Contoh: 23000"
            value={costAmount}
            onChange={(event) => setCostAmount(event.target.value)}
            required
            aria-invalid={Boolean(fieldError("costAmount"))}
            aria-describedby={
              fieldError("costAmount") ? "costAmount-error" : undefined
            }
            className={inputClassName}
          />

          <FieldError
            id="costAmount-error"
            message={fieldError("costAmount")}
          />
        </div>

        <div>
          <label htmlFor="sellingAmount" className="text-sm font-bold">
            Harga jual
          </label>

          <input
            id="sellingAmount"
            name="sellingAmount"
            type="text"
            inputMode="decimal"
            placeholder="Contoh: 25000"
            value={sellingAmount}
            onChange={(event) => changeSellingAmount(event.target.value)}
            required
            aria-invalid={Boolean(fieldError("sellingAmount"))}
            aria-describedby={
              fieldError("sellingAmount") ? "sellingAmount-error" : undefined
            }
            className={inputClassName}
          />

          <FieldError
            id="sellingAmount-error"
            message={fieldError("sellingAmount")}
          />
        </div>
      </div>

      <div>
        <div className="bg-primary-bg rounded-2xl border p-4">
          <p className="text-primary-dark text-xs font-bold">Keuntungan</p>

          <p className="money text-primary-dark mt-2 text-xl font-extrabold">
            {profitPreview === null
              ? "Rp0"
              : minorUnitsToCurrency(profitPreview)}
          </p>

          <p className="text-muted-foreground mt-1 text-xs">
            Harga jual dikurangi modal.
          </p>
        </div>
      </div>

      {isPartial ? (
        <div>
          <label htmlFor="paidAmountInput" className="text-sm font-bold">
            Pembayaran awal
          </label>

          <input
            id="paidAmountInput"
            name="paidAmountInput"
            type="text"
            inputMode="decimal"
            placeholder="Contoh: 10000"
            value={paidAmount}
            onChange={(event) => setPaidAmount(event.target.value)}
            required
            aria-invalid={Boolean(fieldError("paidAmount"))}
            aria-describedby={
              fieldError("paidAmount") ? "paidAmount-error" : undefined
            }
            className={inputClassName}
          />

          <FieldError
            id="paidAmount-error"
            message={fieldError("paidAmount")}
          />
        </div>
      ) : null}

      <input type="hidden" name="paidAmount" value={serverPaidAmount} />

      {state.error ? (
        <p
          role="alert"
          aria-live="polite"
          className="border-danger-foreground/30 bg-danger-bg text-danger-foreground rounded-2xl border p-4 text-sm font-semibold"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/app/sales"
          className="text-primary-dark hover:bg-primary-bg inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold transition"
        >
          Batal
        </Link>

        <Button type="submit" variant="gold" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan penjualan"
          )}
        </Button>
      </div>
    </form>
  );
}
