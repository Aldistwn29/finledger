import { createClient } from "@/lib/supabase/server";
import type { CreatePulseSaleInput } from "@/services/pulse/sales/types";

export async function insertPulseSale(
  input: CreatePulseSaleInput,
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_pulse_sale", {
    p_customer_id: input.customerId,
    p_description: input.description,
    p_payment_status: input.paymentStatus,
    p_paid_amount: input.paidAmount,
    p_service_type: input.serviceType,
    p_cost_amount: input.costAmount,
    p_selling_amount: input.sellingAmount,
  });

  if (error || typeof data !== "string") {
    throw new Error("Penjualan pulsa gagal disimpan.");
  }

  return data;
}
