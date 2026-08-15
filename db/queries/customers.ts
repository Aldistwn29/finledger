import { createClient } from "@/lib/supabase/server";
import type {
  ActiveCustomer,
  CustomerDetail,
  CustomerListItem,
  CustomerStatusFilter,
} from "@/services/customers/types";

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
};

type DebtRow = {
  id: string;
  customer_id: string;
  total_amount: number | string;
  paid_amount: number | string;
  outstanding_amount: number | string;
  due_date: string | null;
  status: "NOT_DUE" | "DUE" | "OVERDUE" | "PAID";
  created_at: string;
};

type SaleRow = {
  id: string;
  description: string;
  service_type: string | null;
  payment_status: "PAID" | "CREDIT" | "PARTIAL";
  total_amount: number | string;
  sold_at: string;
};

type DebtPaymentRow = {
  id: string;
  debt_id: string;
  amount: number | string;
  paid_at: string;
};

const toAmount = (value: number | string) => Number(value);

function escapeSearch(value: string) {
  return value.replace(/[%,_]/g, " ").trim();
}

export async function getActiveCustomers(
  businessId: string,
): Promise<ActiveCustomer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("id, name")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Daftar pelanggan gagal dimuat.");
  }

  return (data ?? []) as ActiveCustomer[];
}

export async function getCustomers(
  businessId: string,
  options: {
    search?: string;
    status?: CustomerStatusFilter;
  } = {},
): Promise<CustomerListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select("id, name, phone, address, notes, is_active, created_at")
    .eq("business_id", businessId)
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });

  if (options.status === "ACTIVE") {
    query = query.eq("is_active", true);
  }

  if (options.status === "INACTIVE") {
    query = query.eq("is_active", false);
  }

  const search = options.search ? escapeSearch(options.search) : "";

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const [customersResult, debtsResult] = await Promise.all([
    query,
    supabase
      .from("debt_records")
      .select("customer_id, outstanding_amount")
      .eq("business_id", businessId)
      .neq("status", "PAID"),
  ]);

  if (customersResult.error || debtsResult.error) {
    throw new Error("Daftar pelanggan gagal dimuat.");
  }

  const customers = (customersResult.data ?? []) as CustomerRow[];
  const debts = (debtsResult.data ?? []) as Array<Pick<DebtRow, "customer_id" | "outstanding_amount">>;
  const outstandingByCustomer = new Map<string, number>();

  for (const debt of debts) {
    outstandingByCustomer.set(
      debt.customer_id,
      (outstandingByCustomer.get(debt.customer_id) ?? 0) +
        toAmount(debt.outstanding_amount),
    );
  }

  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    notes: customer.notes,
    isActive: customer.is_active,
    createdAt: customer.created_at,
    outstandingDebt: outstandingByCustomer.get(customer.id) ?? 0,
  }));
}

export async function getCustomerDetail(
  businessId: string,
  customerId: string,
): Promise<CustomerDetail | null> {
  const supabase = await createClient();

  const customerResult = await supabase
    .from("customers")
    .select("id, name, phone, address, notes, is_active, created_at, updated_at")
    .eq("business_id", businessId)
    .eq("id", customerId)
    .maybeSingle();

  if (customerResult.error || !customerResult.data) {
    return null;
  }

  const [debtsResult, salesResult] = await Promise.all([
    supabase
      .from("debt_records")
      .select("id, customer_id, total_amount, paid_amount, outstanding_amount, due_date, status, created_at")
      .eq("business_id", businessId)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }),
    supabase
      .from("sales")
      .select("id, description, service_type, payment_status, total_amount, sold_at")
      .eq("business_id", businessId)
      .eq("customer_id", customerId)
      .order("sold_at", { ascending: false }),
  ]);

  if (debtsResult.error || salesResult.error) {
    throw new Error("Detail pelanggan gagal dimuat.");
  }

  const debts = (debtsResult.data ?? []) as DebtRow[];
  const debtIds = debts.map((debt) => debt.id);
  const paymentsResult = debtIds.length
    ? await supabase
        .from("debt_payments")
        .select("id, debt_id, amount, paid_at")
        .eq("business_id", businessId)
        .in("debt_id", debtIds)
        .order("paid_at", { ascending: false })
    : { data: [], error: null };

  if (paymentsResult.error) {
    throw new Error("Riwayat pembayaran gagal dimuat.");
  }

  const payments = (paymentsResult.data ?? []) as DebtPaymentRow[];
  const paymentsByDebt = new Map<string, DebtPaymentRow[]>();

  for (const payment of payments) {
    const existing = paymentsByDebt.get(payment.debt_id) ?? [];
    existing.push(payment);
    paymentsByDebt.set(payment.debt_id, existing);
  }

  return {
    id: customerResult.data.id,
    name: customerResult.data.name,
    phone: customerResult.data.phone,
    address: customerResult.data.address,
    notes: customerResult.data.notes,
    isActive: customerResult.data.is_active,
    createdAt: customerResult.data.created_at,
    updatedAt: customerResult.data.updated_at ?? customerResult.data.created_at,
    debts: debts.map((debt) => ({
      id: debt.id,
      totalAmount: toAmount(debt.total_amount),
      paidAmount: toAmount(debt.paid_amount),
      outstandingAmount: toAmount(debt.outstanding_amount),
      dueDate: debt.due_date,
      status: debt.status,
      createdAt: debt.created_at,
      payments: (paymentsByDebt.get(debt.id) ?? []).map((payment) => ({
        id: payment.id,
        amount: toAmount(payment.amount),
        paidAt: payment.paid_at,
      })),
    })),
    sales: ((salesResult.data ?? []) as SaleRow[]).map((sale) => ({
      id: sale.id,
      description: sale.description,
      serviceType: sale.service_type,
      paymentStatus: sale.payment_status,
      totalAmount: toAmount(sale.total_amount),
      soldAt: sale.sold_at,
    })),
  };
}
