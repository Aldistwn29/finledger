import { createClient } from "@/lib/supabase/server";

export type PulseReportSaleRow = {
  id: string;
  description: string;
  payment_status: "PAID" | "CREDIT" | "PARTIAL";
  total_amount: number | string;
  paid_amount: number | string;
  outstanding_amount: number | string;
  cost_amount: number | string | null;
  margin_amount: number | string | null;
  sold_at: string;
};

export async function getPulseReportSales(
  businessId: string,
  start: Date,
  end: Date,
): Promise<PulseReportSaleRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sales")
    .select(
      "id, description, payment_status, total_amount, paid_amount, outstanding_amount, cost_amount, margin_amount, sold_at",
    )
    .eq("business_id", businessId)
    .gte("sold_at", start.toISOString())
    .lt("sold_at", end.toISOString())
    .order("sold_at", { ascending: false });

  if (error) {
    throw new Error("Laporan penjualan gagal dimuat.");
  }

  return (data ?? []) as PulseReportSaleRow[];
}
