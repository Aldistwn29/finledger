"use server";

import { requireUser } from "@/lib/auth/get-current-context";
import {
  minorUnitsToMoney,
  parseMoneyToMinorUnits,
} from "@/lib/financial/money";
import type {
  CreatePulseSaleInput,
  SaleActionState,
  SaleFieldName,
} from "@/services/pulse/sales/types";
import { createPulseSale as createPulseSaleUseCase } from "@/services/pulse/sales/create-pulse-sale";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const amountSchema = z
  .string()
  .trim()
  .regex(/^\d+(?:[.,]\d{1,2})?$/, "Nominal tidak valid.");

const optionalUuidSchema = z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().uuid().nullable(),
);

const saleSchema = z
  .object({
    serviceType: z
      .string()
      .trim()
      .min(1, "Jenis layanan wajib dipilih")
      .max(80, "Jenis layanan terlalu panjang"),
    description: z
      .string()
      .trim()
      .min(1, "Deskripsi transaksi wajib diisi.")
      .max(160, "Deskripsi terlalu panjang."),

    costAmount: amountSchema,
    sellingAmount: amountSchema,
    paymentStatus: z.enum(["PAID", "CREDIT", "PARTIAL"]),
    customerId: optionalUuidSchema,
    paidAmount: amountSchema,
  })
  .superRefine((value, context) => {
    const costAmount = parseMoneyToMinorUnits(value.costAmount);
    const sellingAmount = parseMoneyToMinorUnits(value.sellingAmount);
    const paidAmount = parseMoneyToMinorUnits(value.paidAmount);

    if (costAmount < 0n) {
      context.addIssue({
        code: "custom",
        path: ["costAmount"],
        message: "Modal tidak boleh negatif",
      });
    }

    if (sellingAmount <= 0n) {
      context.addIssue({
        code: "custom",
        path: ["sellingAmount"],
        message: "Harga jual harus lebih besar dari 0",
      });
    }

    if (value.paymentStatus !== "PAID" && value.customerId === null) {
      context.addIssue({
        code: "custom",
        path: ["customerId"],
        message: "Pelanggan wajib dipilih untuk transaksi piutang",
      });
    }

    if (value.paymentStatus === "PAID") {
      if (paidAmount !== sellingAmount) {
        context.addIssue({
          code: "custom",
          path: ["paidAmount"],
          message: "Transaksi lunas harus dibayar penuh.",
        });
      }
    }

    if (value.paymentStatus === "CREDIT") {
      if (paidAmount !== 0n) {
        context.addIssue({
          code: "custom",
          path: ["paidAmount"],
          message: "Transaksi hutang tidak boleh memiliki pembayaran awal.",
        });
      }
    }

    if (value.paymentStatus === "PARTIAL") {
      if (paidAmount <= 0n || paidAmount >= sellingAmount) {
        context.addIssue({
          code: "custom",
          path: ["paidAmount"],
          message:
            "Pembayaran sebagian harus lebih dari 0 dan kurang dari harga jual.",
        });
      }
    }
  });

function getString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function getFieldErrors(error: z.ZodError): SaleActionState {
  const fieldErrors: Partial<Record<SaleFieldName, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !fieldErrors[field as SaleFieldName]) {
      fieldErrors[field as SaleFieldName] = issue.message;
    }
  }

  return {
    error: "Periksa kembali data penjualan.",
    fieldErrors,
  };
}

export async function createPulseSale(
  _previousState: SaleActionState,
  formData: FormData,
): Promise<SaleActionState> {
  const context = await requireUser();

  if (!context.business) {
    return {
      error: "Bisnis belum tersedia",
    };
  }

  if (context.business.business_type !== "PULSE") {
    return {
      error: "Form ini hanya untuk bisnis pulsa.",
    };
  }

  const parsed = saleSchema.safeParse({
    serviceType: getString(formData.get("serviceType")),
    description: getString(formData.get("description")),
    costAmount: getString(formData.get("costAmount")),
    sellingAmount: getString(formData.get("sellingAmount")),
    paymentStatus: getString(formData.get("paymentStatus")),
    customerId: getString(formData.get("customerId")),
    paidAmount: getString(formData.get("paidAmount")),
  });

  if (!parsed.success) {
    return getFieldErrors(parsed.error);
  }

  const sellingAmount = parseMoneyToMinorUnits(parsed.data.sellingAmount);
  const paidAmount =
    parsed.data.paymentStatus === "PAID"
      ? sellingAmount
      : parsed.data.paymentStatus === "CREDIT"
        ? 0n
        : parseMoneyToMinorUnits(parsed.data.paidAmount);

  const input: CreatePulseSaleInput = {
    customerId: parsed.data.customerId,
    description: parsed.data.description,
    paymentStatus: parsed.data.paymentStatus,
    paidAmount: minorUnitsToMoney(paidAmount),
    serviceType: parsed.data.serviceType,
    costAmount: minorUnitsToMoney(
      parseMoneyToMinorUnits(parsed.data.costAmount),
    ),
    sellingAmount: minorUnitsToMoney(sellingAmount),
  };

  try {
    await createPulseSaleUseCase(input);
  } catch {
    return {
      error: "Penjualan gagal disimpan. Silahkan coba lagi",
    };
  }

  revalidatePath("/app/dashboard");
  revalidatePath("/app/sales");
  revalidatePath("/app/receivables");

  redirect("/app/sales");
}
