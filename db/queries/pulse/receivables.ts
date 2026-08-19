import { createClient } from "@/lib/supabase/server";

type DebtRow = {
  id: string;
  customer_id: string;
  outstanding_amount: number | string;
  total_amount: number | string;
  paid_amount: number | string;
  due_date: string | null;
  status: "NOT_DUE" | "DUE" | "OVERDUE" | "PAID";
  created_at: string;
};

type CustomerRow = {
  id: string;
  name: string;
};

export type PulseReceivable = {
  id: string;
  customerName: string;
  outstandingAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueDate: string | null;
  status: DebtRow["status"];
  createdAt: string;
};

const toAmount = (value: number | string) => Number(value);

export async function getPulseReceivables(
  businessId: string,
): Promise<PulseReceivable[]> {
  const supabase = await createClient();

  const [debtsResult, customersResult] = await Promise.all([
    supabase
      .from("debt_records")
      .select(
        "id, customer_id, outstanding_amount, total_amount, paid_amount, due_date, status, created_at",
      )
      .eq("business_id", businessId)
      .neq("status", "PAID")
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id, name")
      .eq("business_id", businessId),
  ]);

  if (debtsResult.error || customersResult.error) {
    throw new Error("Daftar piutang gagal dimuat.");
  }

  const debts = (debtsResult.data ?? []) as DebtRow[];
  const customers = (customersResult.data ?? []) as CustomerRow[];
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.name]),
  );

  return debts.map((debt) => ({
    id: debt.id,
    customerName: customerNames.get(debt.customer_id) ?? "Pelanggan",
    outstandingAmount: toAmount(debt.outstanding_amount),
    totalAmount: toAmount(debt.total_amount),
    paidAmount: toAmount(debt.paid_amount),
    dueDate: debt.due_date,
    status: debt.status,
    createdAt: debt.created_at,
  }));
}
