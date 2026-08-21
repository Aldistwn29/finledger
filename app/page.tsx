import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CircleDollarSign,
  Code2,
  Container,
  CreditCard,
  Database,
  ReceiptText,
  Users,
  WalletCards,
} from "lucide-react";
import ThemeToggle from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { redirectAuthenticatedUser } from "@/lib/auth/get-current-context";

export const metadata: Metadata = {
  title: "FinLedger | Demo Pencatatan Keuangan Usaha",
  description:
    "Proyek pembelajaran full-stack untuk mencatat penjualan, pelanggan, dan piutang usaha PULSE.",
  openGraph: {
    title: "FinLedger | Demo Pencatatan Keuangan Usaha",
    description:
      "Demo pembelajaran yang dibangun dengan Next.js, TypeScript, Supabase, dan Docker.",
  },
};

const features = [
  {
    icon: Users,
    title: "Data pelanggan terpusat",
    description:
      "Simpan, cari, perbarui, dan nonaktifkan data pelanggan dari satu ruang kerja.",
  },
  {
    icon: ReceiptText,
    title: "Penjualan PULSE lebih jelas",
    description:
      "Catat transaksi lunas, kredit, atau sebagian dengan perhitungan margin di server.",
  },
  {
    icon: WalletCards,
    title: "Piutang tetap terpantau",
    description:
      "Lihat sisa piutang dan catat pembayaran tanpa menerima kelebihan bayar.",
  },
  {
    icon: BarChart3,
    title: "Ringkasan yang mudah dibaca",
    description:
      "Pantau penjualan, kas, margin, dan laporan mingguan atau bulanan.",
  },
] as const;

const steps = [
  ["01", "Buat ruang kerja", "Daftar lalu lengkapi profil usaha Anda."],
  ["02", "Catat aktivitas", "Tambahkan pelanggan dan transaksi PULSE."],
  ["03", "Evaluasi hasil", "Baca ringkasan kas, margin, dan piutang."],
] as const;

const stack = [
  [Code2, "Next.js 16", "Antarmuka dan server dalam satu aplikasi"],
  [BookOpenCheck, "TypeScript", "Kontrak data yang lebih mudah dipahami"],
  [Database, "Supabase", "Auth, PostgreSQL, dan Row Level Security"],
  [Container, "Docker", "Paket aplikasi yang konsisten untuk deployment"],
] as const;

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function Home() {
  await redirectAuthenticatedUser();

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <a
        href="#konten-utama"
        className="bg-card text-foreground sr-only fixed top-4 left-4 z-[60] rounded-full px-4 py-3 font-bold shadow-lg focus:not-sr-only"
      >
        Lewati ke konten utama
      </a>

      <header className="bg-background/95 relative z-40 border-b backdrop-blur">
        <nav
          aria-label="Navigasi landing page"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        >
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-2xl shadow-[0_8px_18px_-10px_var(--primary)]">
              <CircleDollarSign className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-extrabold tracking-tight">
                FinLedger
              </span>
              <span className="text-muted-foreground hidden text-[10px] font-bold tracking-[0.18em] uppercase sm:block">
                Learning Project
              </span>
            </span>
          </Link>

          <div className="text-muted-foreground hidden items-center gap-7 text-sm font-bold md:flex">
            <a
              className="hover:text-foreground transition-colors"
              href="#fitur"
            >
              Fitur
            </a>
            <a
              className="hover:text-foreground transition-colors"
              href="#cara-kerja"
            >
              Cara kerja
            </a>
            <a
              className="hover:text-foreground transition-colors"
              href="#teknologi"
            >
              Teknologi
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "default" })}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className={buttonVariants({
                variant: "gold",
                size: "default",
                className: "hidden sm:inline-flex",
              })}
            >
              Buat akun
            </Link>
          </div>
        </nav>
      </header>

      <main id="konten-utama">
        <section className="relative isolate px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8 lg:pt-24 lg:pb-28">
          <div
            aria-hidden="true"
            className="border-primary-bg absolute top-8 -right-24 -z-10 size-72 rounded-full border-[48px] opacity-80 sm:size-96"
          />
          <div
            aria-hidden="true"
            className="bg-warning-bg absolute bottom-8 -left-20 -z-10 size-44 rounded-full"
          />

          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div className="max-w-2xl">
              <p className="bg-card text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold tracking-[0.14em] uppercase shadow-sm">
                <BookOpenCheck className="size-4" aria-hidden="true" />
                Proyek pembelajaran full-stack
              </p>
              <h1 className="mt-7 max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-[-0.04em] text-pretty sm:text-5xl lg:text-6xl">
                Kenali arus usaha tanpa tenggelam dalam catatan.
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
                FinLedger adalah demo pencatatan sederhana untuk mempelajari
                alur penjualan, pelanggan, margin, dan piutang pada usaha PULSE.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: "gold",
                    size: "lg",
                    className: "w-full sm:w-auto",
                  })}
                >
                  Mulai demo
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full sm:w-auto",
                  })}
                >
                  Saya sudah punya akun
                </Link>
              </div>

              <p className="text-muted-foreground mt-5 max-w-xl text-xs leading-5">
                Gunakan data dummy. FinLedger dibuat untuk pembelajaran dan
                evaluasi, bukan layanan akuntansi atau nasihat keuangan.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div
                aria-hidden="true"
                className="bg-primary absolute -inset-3 -z-10 rotate-2 rounded-[2.25rem]"
              />
              <div className="bg-card rounded-[2rem] border p-4 shadow-[0_24px_60px_-28px_var(--surface-dark)] sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b pb-4">
                  <div className="min-w-0">
                    <p className="text-foreground text-xs font-bold tracking-[0.14em] uppercase">
                      Contoh tampilan
                    </p>
                    <p className="mt-1 truncate text-lg font-extrabold">
                      Ringkasan Usaha PULSE
                    </p>
                  </div>
                  <span className="bg-primary-bg text-foreground rounded-full px-3 py-1.5 text-xs font-bold">
                    Hari ini
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-surface-dark text-surface-dark-foreground col-span-2 rounded-3xl p-5 sm:col-span-1">
                    <p className="text-surface-dark-foreground/65 text-xs font-semibold">
                      Penjualan
                    </p>
                    <p className="money mt-2 text-2xl font-extrabold">
                      {currencyFormatter.format(1_250_000)}
                    </p>
                    <p className="text-accent mt-3 text-xs font-bold">
                      18 transaksi tercatat
                    </p>
                  </div>
                  <div className="bg-primary-bg rounded-3xl p-4 sm:p-5">
                    <p className="text-muted-foreground text-xs font-semibold">
                      Margin
                    </p>
                    <p className="money text-foreground mt-2 text-lg font-extrabold sm:text-xl">
                      {currencyFormatter.format(135_000)}
                    </p>
                  </div>
                  <div className="bg-warning-bg rounded-3xl p-4 sm:p-5">
                    <p className="text-warning-foreground text-xs font-semibold">
                      Piutang
                    </p>
                    <p className="money text-warning-foreground mt-2 text-lg font-extrabold sm:text-xl">
                      {currencyFormatter.format(420_000)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="bg-primary-bg text-primary-dark grid size-10 shrink-0 place-items-center rounded-2xl">
                        <CreditCard className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold">
                          Pulsa Telkomsel
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Penjualan sebagian
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="money text-sm font-extrabold">
                        {currencyFormatter.format(100_000)}
                      </p>
                      <p className="text-danger-foreground mt-1 text-xs font-bold">
                        Sisa {currencyFormatter.format(40_000)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="fitur"
          className="bg-card scroll-mt-6 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-foreground text-sm font-extrabold tracking-[0.15em] uppercase">
                Fitur yang sudah dipelajari
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-pretty sm:text-4xl">
                Alur utama keuangan PULSE dalam satu demo.
              </h2>
              <p className="text-muted-foreground mt-4 leading-7 text-pretty">
                Setiap fitur menghubungkan antarmuka, validasi server, database,
                serta session pengguna.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="bg-background rounded-3xl border p-6 shadow-[0_8px_24px_-18px_color-mix(in_srgb,var(--primary)_30%,transparent)]"
                >
                  <span className="bg-primary-bg text-primary-dark grid size-11 place-items-center rounded-2xl">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-6">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cara-kerja"
          className="scroll-mt-6 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-foreground text-sm font-extrabold tracking-[0.15em] uppercase">
                Cara kerja
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-pretty sm:text-4xl">
                Dari akun baru sampai ringkasan usaha.
              </h2>
              <p className="text-muted-foreground mt-4 leading-7">
                Alur dibuat pendek agar fokus pembelajaran tetap berada pada
                transaksi dan konsistensi data.
              </p>
            </div>

            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map(([number, title, description]) => (
                <li key={number} className="bg-card rounded-3xl border p-6">
                  <span className="money text-danger-foreground text-sm font-extrabold">
                    {number}
                  </span>
                  <h3 className="mt-8 text-lg font-extrabold">{title}</h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-6">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="teknologi"
          className="bg-surface-dark text-surface-dark-foreground scroll-mt-6 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-accent text-sm font-extrabold tracking-[0.15em] uppercase">
                  Teknologi
                </p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-pretty sm:text-4xl">
                  Dibangun untuk memahami alur full-stack modern.
                </h2>
              </div>
              <p className="text-surface-dark-foreground/70 max-w-2xl leading-7 text-pretty lg:justify-self-end">
                FinLedger bukan produk keuangan siap produksi. Proyek ini
                menjadi pengantar untuk mempelajari integrasi aplikasi,
                autentikasi, database, dan packaging deployment.
              </p>
            </div>

            <div className="border-surface-dark-foreground/15 bg-surface-dark-foreground/15 mt-10 grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2 lg:grid-cols-4">
              {stack.map(([Icon, title, description]) => (
                <article key={title} className="bg-surface-dark p-6">
                  <Icon className="text-accent size-6" aria-hidden="true" />
                  <h3 className="mt-5 font-extrabold">{title}</h3>
                  <p className="text-surface-dark-foreground/65 mt-2 text-sm leading-6">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="bg-card mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 rounded-[2rem] border p-7 shadow-[0_20px_50px_-32px_var(--surface-dark)] sm:p-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-danger-foreground text-sm font-extrabold">
                Siap mencoba?
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-pretty sm:text-3xl">
                Mulai dengan data dummy dan jelajahi alur FinLedger.
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Buat akun baru atau masuk untuk melanjutkan ruang kerja yang
                sudah tersedia.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "outline",
                  size: "default",
                  className: "w-full sm:w-auto",
                })}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  variant: "gold",
                  size: "default",
                  className: "w-full sm:w-auto",
                })}
              >
                Buat akun
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-foreground flex items-center gap-2 font-extrabold">
            <CircleDollarSign
              className="text-primary-dark size-5"
              aria-hidden="true"
            />
            <span>FinLedger</span>
          </div>
          <p className="max-w-xl text-pretty sm:text-right">
            Educational demo untuk Next.js, TypeScript, Supabase, dan Docker.
            Bukan layanan akuntansi profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}
