import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function Money({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("money", className)}>
      {new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(value)}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint: string;
  icon: ReactNode;
  tone?: "default" | "success" | "gold" | "coral";
}) {
  const toneClass = {
    default: "border-border bg-card text-foreground",
    success: "border-primary/20 bg-primary-bg text-primary-dark",
    gold: "border-accent/40 bg-warning-bg text-warning-foreground",
    coral: "border-coral/30 bg-danger-bg text-danger-foreground",
  }[tone];

  return (
    <div className={cn("min-w-0 rounded-3xl border p-4 shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--primary)_22%,transparent)] sm:p-5", toneClass)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold opacity-80">{label}</p>
          <span aria-hidden className="grid size-8 place-items-center rounded-xl bg-card/70">
          {icon}
        </span>
      </div>
      <p className="money mt-5 min-w-0 truncate text-xl font-extrabold sm:text-2xl">{value}</p>
      <p className="mt-2 text-xs font-semibold opacity-70">{hint}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center">
      <p className="text-sm font-bold">{title}</p>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    PAID: "Lunas",
    CREDIT: "Hutang",
    PARTIAL: "Sebagian",
    DUE: "Jatuh tempo",
    OVERDUE: "Terlambat",
    NOT_DUE: "Belum jatuh tempo",
  };

  return (
    <span className="inline-flex rounded-full bg-primary-bg px-2.5 py-1 text-[11px] font-bold text-primary-dark">
      {labels[status] ?? status}
    </span>
  );
}
