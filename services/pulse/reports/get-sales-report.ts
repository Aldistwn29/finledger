import { getPulseReportSales } from "@/db/queries/pulse/reports";

export type SalesReportPeriod = "week" | "month";

export type PulseSalesReport = {
  period: SalesReportPeriod;
  start: Date;
  end: Date;
  transactionCount: number;
  totalSales: number;
  cashReceived: number;
  totalCost: number;
  totalMargin: number;
  totalOutstanding: number;
  paidCount: number;
  creditCount: number;
  partialCount: number;
  sales: Array<{
    id: string;
    description: string;
    paymentStatus: "PAID" | "CREDIT" | "PARTIAL";
    total: number;
    margin: number;
    soldAt: string;
  }>;
};

const toAmount = (value: number | string | null) =>
  value === null ? 0 : Number(value);

function getPeriodRange(period: SalesReportPeriod, now: Date) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (period === "month") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end,
    };
  }

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - daysSinceMonday);

  return { start, end };
}

export async function getPulseSalesReport(
  businessId: string,
  period: SalesReportPeriod,
): Promise<PulseSalesReport> {
  const { start, end } = getPeriodRange(period, new Date());
  const sales = await getPulseReportSales(businessId, start, end);

  const totalSales = sales.reduce(
    (sum, sale) => sum + toAmount(sale.total_amount),
    0,
  );
  const cashReceived = sales.reduce(
    (sum, sale) => sum + toAmount(sale.paid_amount),
    0,
  );
  const totalCost = sales.reduce(
    (sum, sale) => sum + toAmount(sale.cost_amount),
    0,
  );
  const totalMargin = sales.reduce(
    (sum, sale) => sum + toAmount(sale.margin_amount),
    0,
  );
  const totalOutstanding = sales.reduce(
    (sum, sale) => sum + toAmount(sale.outstanding_amount),
    0,
  );

  return {
    period,
    start,
    end,
    transactionCount: sales.length,
    totalSales,
    cashReceived,
    totalCost,
    totalMargin,
    totalOutstanding,
    paidCount: sales.filter((sale) => sale.payment_status === "PAID").length,
    creditCount: sales.filter((sale) => sale.payment_status === "CREDIT").length,
    partialCount: sales.filter((sale) => sale.payment_status === "PARTIAL").length,
    sales: sales.map((sale) => ({
      id: sale.id,
      description: sale.description,
      paymentStatus: sale.payment_status,
      total: toAmount(sale.total_amount),
      margin: toAmount(sale.margin_amount),
      soldAt: sale.sold_at,
    })),
  };
}
