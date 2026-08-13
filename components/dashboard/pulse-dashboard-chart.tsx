"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Money } from "./dashboard-bits";

export default function PulseDashboardChart({
  data,
}: {
  data: Array<{ label: string; total: number }>;
}) {
  return (
    <div className="h-56 min-w-0 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="pulseSalesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} stroke="var(--border)" />
          <YAxis
            tickFormatter={(value: number) => (value >= 1000 ? `${Math.round(value / 1000)}rb` : String(value))}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            stroke="var(--border)"
          />
          <Tooltip
            formatter={(value) => [<Money key="value" value={Number(value)} />, "Penjualan"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--card-foreground)",
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2.5} fill="url(#pulseSalesFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
