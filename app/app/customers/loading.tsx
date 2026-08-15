export default function CustomersLoading() {
  return (
    <main aria-busy="true" aria-label="Memuat customer" className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="h-12 w-64 animate-pulse rounded-2xl bg-border" />
      <div className="h-14 animate-pulse rounded-2xl border bg-card" />
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-3xl border bg-card" />
        ))}
      </div>
    </main>
  );
}
