import { createClient } from "@/lib/supabase/server";

export async function payDebt(
  debtId: string,
  amount: string,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("pay_debt", {
    p_debt_id: debtId,
    p_amount: amount,
  });

  if (error || typeof data !== "string") {
    throw new Error("Pembayaran piutang gagal disimpan.");
  }

  return data;
}
