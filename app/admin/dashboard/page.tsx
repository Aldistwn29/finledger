import type { Metadata } from "next";
import { CircleDollarSign, Construction } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button";
import ThemeToggle from "@/components/theme/theme-toggle";
import { requireAdmin } from "@/lib/auth/get-current-context";

export const metadata: Metadata = {
  title: "Area Admin | FinLedger",
  description: "Area admin terbatas untuk demo FinLedger.",
};

export default async function AdminDashboardPage() {
  const context = await requireAdmin();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-primary-foreground grid size-11 place-items-center rounded-2xl">
              <CircleDollarSign className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-extrabold">FinLedger</p>
              <p className="text-muted-foreground text-xs font-bold tracking-[0.14em] uppercase">
                Area Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        <section className="bg-card mt-16 rounded-[2rem] border p-7 shadow-[0_16px_40px_-28px_var(--surface-dark)] sm:p-10">
          <span className="bg-warning-bg text-warning-foreground grid size-12 place-items-center rounded-2xl">
            <Construction className="size-6" aria-hidden="true" />
          </span>
          <p className="text-foreground mt-6 text-sm font-extrabold break-words">
            Halo, {context.profile.full_name}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-pretty">
            Dashboard admin belum termasuk dalam demo ini.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-7 text-pretty">
            Route ini disediakan agar akun ADMIN memiliki tujuan yang valid.
            Fitur administrasi platform akan dipelajari pada proyek berikutnya.
          </p>
        </section>
      </div>
    </main>
  );
}
