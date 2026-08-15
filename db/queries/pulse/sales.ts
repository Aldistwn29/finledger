import { createClient } from "@/lib/supabase/server";
import type { PulseSalePaymentStatus } from "@/services/pulse/sales/types";

type SaleRow = {
  id: string;
  customer_id: string | null;
  description: string;
  service_type: string | null;
  payment_status: PulseSalePaymentStatus;
  total_amount: number | string;
  paid_amount: number | string;
  outstanding_amount: number | string;
  cost_amount: number | string | null;
  selling_amount: number | string | null;
  margin_amount: number | string | null;
  sold_at: string;
};

type CustomerRow = {
  id: string;
  name: string;
};

export type PulseSaleListItem = {
  id: string;
  description: string;
  serviceType: string;
  customerName: string;
  paymentStatus: PulseSalePaymentStatus;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  costAmount: number;
  sellingAmount: number;
  marginAmount: number;
  soldAt: string;
};

function toAmount(value: number | string | null): number {
  if (value === null) {
    return 0;
  }

  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
}

export async function getPulseSales(
  businessId: string,
): Promise<PulseSaleListItem[]> {
  const supabase = await createClient();

  const [salesResult, customersResult] = await Promise.all([
    supabase
      .from("sales")
      .select(
        "id, customer_id, description, service_type, payment_status, total_amount, paid_amount, outstanding_amount, cost_amount, selling_amount, margin_amount, sold_at",
      )
      .eq("business_id", businessId)
      .order("sold_at", { ascending: false })
      .limit(50),
    supabase
      .from("customers")
      .select("id, name")
      .eq("business_id", businessId),
  ]);

  if (salesResult.error || customersResult.error) {
    throw new Error("Daftar penjualan gagal dimuat.");
  }

  const sales = (salesResult.data ?? []) as SaleRow[];
  const customers = (customersResult.data ?? []) as CustomerRow[];
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.name]),
  );

  return sales.map((sale) => ({
    id: sale.id,
    description: sale.description,
    serviceType: sale.service_type ?? "Layanan pulsa",
    customerName: sale.customer_id
      ? (customerNames.get(sale.customer_id) ?? "Pelanggan")
      : "Umum",
    paymentStatus: sale.payment_status,
    totalAmount: toAmount(sale.total_amount),
    paidAmount: toAmount(sale.paid_amount),
    outstandingAmount: toAmount(sale.outstanding_amount),
    costAmount: toAmount(sale.cost_amount),
    sellingAmount: toAmount(sale.selling_amount),
    marginAmount: toAmount(sale.margin_amount),
    soldAt: sale.sold_at,
  }));
}
