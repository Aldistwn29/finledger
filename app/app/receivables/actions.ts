"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/get-current-context";
import { parseMoneyToMinorUnits } from "@/lib/financial/money";
import { payDebt as payDebtUseCase } from "@/services/pulse/receivables/pay-debt";

export type DebtPaymentActionState = {
  error?: string;
};

const paymentSchema = z.object({
  debtId: z.string().uuid("Piutang tidak valid."),
  amount: z
    .string()
    .trim()
    .regex(/^\d+(?:[.,]\d{1,2})?$/, "Nominal pembayaran tidak valid."),
});

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function createDebtPayment(
  _previousState: DebtPaymentActionState,
  formData: FormData,
): Promise<DebtPaymentActionState> {
  const context = await requireUser();

  if (!context.business || context.business.business_type !== "PULSE") {
    return { error: "Fitur piutang hanya tersedia untuk bisnis pulsa." };
  }

  const parsed = paymentSchema.safeParse({
    debtId: getString(formData.get("debtId")),
    amount: getString(formData.get("amount")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await payDebtUseCase(
      parsed.data.debtId,
      parsedMoney(parsed.data.amount),
    );
  } catch {
    return {
      error: "Pembayaran gagal. Pastikan nominal tidak melebihi piutang.",
    };
  }

  revalidatePath("/app/dashboard");
  revalidatePath("/app/reports");
  revalidatePath("/app/receivables");
  redirect("/app/receivables");
}

function parsedMoney(value: string) {
  return `${parseMoneyToMinorUnits(value) / 100n}.${(
    parseMoneyToMinorUnits(value) % 100n
  )
    .toString()
    .padStart(2, "0")}`;
}
