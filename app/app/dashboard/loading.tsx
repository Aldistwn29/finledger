export default function DashboardLoading() {
  return (
    <main aria-busy="true" aria-label="Memuat dashboard" className="min-w-0 space-y-6 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="space-y-3"><div className="h-8 w-64 animate-pulse rounded-xl bg-border" /><div className="h-4 w-80 animate-pulse rounded-xl bg-border" /></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-36 animate-pulse rounded-3xl border bg-card" />)}</div>
      <div className="h-80 animate-pulse rounded-3xl border bg-card" />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><div className="h-80 animate-pulse rounded-3xl border bg-card" /><div className="h-80 animate-pulse rounded-3xl border bg-card" /></div>
    </main>
  );
}
