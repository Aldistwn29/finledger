import { createClient } from "@/lib/supabase/server";

export type PulseDashboardSaleRow = {
  id: string;
  description: string;
  total_amount: number | string;
  cost_amount: number | string | null;
  selling_amount: number | string | null;
  margin_amount: number | string | null;
  payment_status: "PAID" | "CREDIT" | "PARTIAL";
  customer_id: string | null;
  sold_at: string;
};

export type PulseDashboardDebtRow = {
  id: string;
  customer_id: string;
  outstanding_amount: number | string;
  due_date: string | null;
  status: "NOT_DUE" | "DUE" | "OVERDUE" | "PAID";
};

export type PulseDashboardCashRow = {
  type:
    | "SALE_PAYMENT"
    | "DEBT_PAYMENT"
    | "EXPENSE"
    | "CAPITAL_IN"
    | "OWNER_WITHDRAWAL";
  amount: number | string;
  occurred_at: string;
};

export type PulseDashboardCustomerRow = {
  id: string;
  name: string;
};

export type PulseDashboardRows = {
  sales: PulseDashboardSaleRow[];
  debts: PulseDashboardDebtRow[];
  cashTransactions: PulseDashboardCashRow[];
  customers: PulseDashboardCustomerRow[];
};

export async function getPulseDashboardRows(
  businessId: string,
  salesStart: Date,
): Promise<PulseDashboardRows> {
  const supabase = await createClient();

  const [salesResult, debtsResult, cashResult, customersResult] =
    await Promise.all([
      supabase
        .from("sales")
        .select(
          "id, description, total_amount, cost_amount, selling_amount, margin_amount, payment_status, customer_id, sold_at",
        )
        .eq("business_id", businessId)
        .gte("sold_at", salesStart.toISOString())
        .order("sold_at", { ascending: false }),
      supabase
        .from("debt_records")
        .select("id, customer_id, outstanding_amount, due_date, status")
        .eq("business_id", businessId)
        .neq("status", "PAID")
        .order("due_date", { ascending: true, nullsFirst: false }),
      supabase
        .from("cash_transactions")
        .select("type, amount, occurred_at")
        .eq("business_id", businessId)
        .order("occurred_at", { ascending: false }),
      supabase
        .from("customers")
        .select("id, name")
        .eq("business_id", businessId),
    ]);

  if (
    salesResult.error ||
    debtsResult.error ||
    cashResult.error ||
    customersResult.error
  ) {
    throw new Error("Dashboard data could not be loaded.");
  }

  return {
    sales: (salesResult.data ?? []) as PulseDashboardSaleRow[],
    debts: (debtsResult.data ?? []) as PulseDashboardDebtRow[],
    cashTransactions: (cashResult.data ?? []) as PulseDashboardCashRow[],
    customers: (customersResult.data ?? []) as PulseDashboardCustomerRow[],
  };
}
