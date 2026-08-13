import { createClient } from "@/lib/supabase/server";

type SaleRow = {
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

type DebtRow = {
  id: string;
  customer_id: string;
  outstanding_amount: number | string;
  due_date: string | null;
  status: "NOT_DUE" | "DUE" | "OVERDUE" | "PAID";
};

type CashRow = {
  type: "SALE_PAYMENT" | "DEBT_PAYMENT" | "EXPENSE" | "CAPITAL_IN" | "OWNER_WITHDRAWAL";
  amount: number | string;
  occurred_at: string;
};

type CustomerRow = {
  id: string;
  name: string;
};

export type PulseDashboardData = {
  salesToday: number;
  salesMonth: number;
  cashBalance: number;
  activeDebt: number;
  overdueDebt: number;
  monthlyMargin: number;
  monthlyCapital: number;
  monthlyExpense: number;
  chartData: Array<{ label: string; total: number }>;
  recentSales: Array<{
    id: string;
    description: string;
    customerName: string;
    total: number;
    paymentStatus: SaleRow["payment_status"];
    soldAt: string;
  }>;
  activeDebts: Array<{
    id: string;
    customerName: string;
    outstanding: number;
    dueDate: string | null;
    status: DebtRow["status"];
  }>;
};

const toAmount = (value: number | string | null | undefined) =>
  value === null || value === undefined ? 0 : Number(value);

const startOfDay = (date: Date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const isSameDay = (left: string, right: Date) =>
  startOfDay(new Date(left)).getTime() === startOfDay(right).getTime();

const isSameMonth = (value: string, date: Date) => {
  const parsed = new Date(value);
  return parsed.getFullYear() === date.getFullYear() && parsed.getMonth() === date.getMonth();
};

export async function getPulseDashboard(businessId: string): Promise<PulseDashboardData> {
  const supabase = await createClient();
  const now = new Date();
  const fourteenDaysAgo = startOfDay(new Date(now));
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const salesStart = monthStart < fourteenDaysAgo ? monthStart : fourteenDaysAgo;

  const [salesResult, debtsResult, cashResult, customersResult] = await Promise.all([
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
    supabase.from("customers").select("id, name").eq("business_id", businessId),
  ]);

  if (salesResult.error || debtsResult.error || cashResult.error || customersResult.error) {
    throw new Error("Dashboard data could not be loaded.");
  }

  const sales = (salesResult.data ?? []) as SaleRow[];
  const debts = (debtsResult.data ?? []) as DebtRow[];
  const cashTransactions = (cashResult.data ?? []) as CashRow[];
  const customers = (customersResult.data ?? []) as CustomerRow[];
  const customerNames = new Map(customers.map((customer) => [customer.id, customer.name]));

  const salesToday = sales
    .filter((sale) => isSameDay(sale.sold_at, now))
    .reduce((total, sale) => total + toAmount(sale.total_amount), 0);
  const salesMonth = sales
    .filter((sale) => isSameMonth(sale.sold_at, now))
    .reduce((total, sale) => total + toAmount(sale.total_amount), 0);
  const monthlyMargin = sales
    .filter((sale) => isSameMonth(sale.sold_at, now))
    .reduce((total, sale) => total + toAmount(sale.margin_amount), 0);
  const activeDebt = debts.reduce((total, debt) => total + toAmount(debt.outstanding_amount), 0);
  const overdueDebt = debts
    .filter((debt) => debt.status === "OVERDUE")
    .reduce((total, debt) => total + toAmount(debt.outstanding_amount), 0);

  const monthlyCash = cashTransactions.filter((transaction) =>
    isSameMonth(transaction.occurred_at, now),
  );
  const cashBalance = cashTransactions.reduce((total, transaction) => {
    const amount = toAmount(transaction.amount);
    return ["EXPENSE", "OWNER_WITHDRAWAL"].includes(transaction.type)
      ? total - amount
      : total + amount;
  }, 0);
  const monthlyCapital = monthlyCash
    .filter((transaction) => transaction.type === "CAPITAL_IN")
    .reduce((total, transaction) => total + toAmount(transaction.amount), 0);
  const monthlyExpense = monthlyCash
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + toAmount(transaction.amount), 0);

  const chartData = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(fourteenDaysAgo);
    date.setDate(fourteenDaysAgo.getDate() + index);

    return {
      label: `${date.getDate()}/${date.getMonth() + 1}`,
      total: sales
        .filter((sale) => isSameDay(sale.sold_at, date))
        .reduce((total, sale) => total + toAmount(sale.total_amount), 0),
    };
  });

  return {
    salesToday,
    salesMonth,
    cashBalance,
    activeDebt,
    overdueDebt,
    monthlyMargin,
    monthlyCapital,
    monthlyExpense,
    chartData,
    recentSales: sales.slice(0, 6).map((sale) => ({
      id: sale.id,
      description: sale.description,
      customerName: sale.customer_id ? customerNames.get(sale.customer_id) ?? "Pelanggan" : "Umum",
      total: toAmount(sale.total_amount),
      paymentStatus: sale.payment_status,
      soldAt: sale.sold_at,
    })),
    activeDebts: debts.slice(0, 5).map((debt) => ({
      id: debt.id,
      customerName: customerNames.get(debt.customer_id) ?? "Pelanggan",
      outstanding: toAmount(debt.outstanding_amount),
      dueDate: debt.due_date,
      status: debt.status,
    })),
  };
}
