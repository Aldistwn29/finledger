import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  Package,
  Plus,
  ReceiptText,
  Search,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const transactions = [
  {
    name: "Kopi Susu Gula Aren",
    detail: "Hari ini, 10:42",
    amount: "+Rp 28.000",
    tone: "bg-primary-bg text-primary-dark",
  },
  {
    name: "Pembayaran Piutang • Sari",
    detail: "Hari ini, 09:15",
    amount: "+Rp 450.000",
    tone: "bg-warning-bg text-warning-foreground",
  },
  {
    name: "Belanja stok biji kopi",
    detail: "Kemarin, 16:20",
    amount: "-Rp 1.250.000",
    tone: "bg-danger-bg text-danger-foreground",
  },
];

const navItems = [
  [LayoutDashboard, "Ringkasan", true],
  [ReceiptText, "Transaksi", false],
  [WalletCards, "Piutang", false],
  [Package, "Produk", false],
  [Users, "Pelanggan", false],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen lg:flex">
      <aside className="flex w-full flex-col bg-primary-dark px-5 py-5 text-white lg:min-h-screen lg:w-[252px] lg:px-6">
        <div className="flex items-center justify-between lg:block">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-accent text-surface-dark">
              <CircleDollarSign size={22} />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">FinLedger</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                Keuangan UMKM
              </p>
            </div>
          </div>
          <button
            className="rounded-full p-2 hover:bg-white/10 lg:hidden"
            aria-label="Buka menu"
          >
            <Search size={20} />
          </button>
        </div>

        <nav className="mt-10 hidden space-y-2 lg:block" aria-label="Navigasi utama">
          {navItems.map(([Icon, label, active]) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-white text-primary-dark shadow-lg shadow-[0_10px_24px_-12px_var(--surface-dark)]"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto hidden rounded-3xl bg-surface-dark p-4 lg:block">
          <p className="text-xs font-bold text-accent">Tips hari ini</p>
          <p className="mt-2 text-sm font-semibold leading-5">
            Pisahkan uang usaha dan pribadi agar arus kas lebih jelas.
          </p>
          <button className="mt-4 flex items-center gap-1 text-xs font-bold text-white/75">
            Pelajari lebih lanjut <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="mt-5 hidden items-center justify-between border-t border-white/15 pt-5 lg:flex">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-full bg-primary-light text-xs font-extrabold">
              AS
            </div>
            <span className="text-xs font-bold">Aldi Setiawan</span>
          </div>
          <Settings size={17} className="text-white/65" />
        </div>
      </aside>

      <section className="w-full flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Rabu, 12 Agustus 2026
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Selamat pagi, Aldi <span aria-hidden>👋</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ini ringkasan kesehatan keuangan Kedai Senja.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative hidden rounded-full border bg-white p-3 text-primary-dark shadow-sm sm:block"
              aria-label="Notifikasi"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-coral" />
            </button>
            <Button variant="gold" className="hidden sm:inline-flex">
              <Plus size={18} /> Catat transaksi
            </Button>
          </div>
        </header>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <Card className="border-0 bg-primary text-white">
            <CardHeader className="pb-2">
              <p className="text-sm font-semibold text-white/75">
                Saldo usaha saat ini
              </p>
            </CardHeader>
            <CardContent>
              <p className="money text-3xl font-extrabold">Rp 12.840.500</p>
              <p className="mt-3 flex items-center gap-1 text-xs font-bold text-white/80">
                <ArrowUpRight size={14} /> 12,5% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Penjualan bulan ini
              </p>
            </CardHeader>
            <CardContent>
              <p className="money text-2xl font-extrabold">Rp 8.450.000</p>
              <p className="mt-3 text-xs font-bold text-success">
                +8,2% <span className="font-semibold text-muted-foreground">vs bulan lalu</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-warning-bg bg-warning-bg">
            <CardHeader className="pb-2">
              <p className="text-sm font-semibold text-warning-foreground">
                Piutang aktif
              </p>
            </CardHeader>
            <CardContent>
              <p className="money text-2xl font-extrabold text-warning-foreground">
                Rp 2.340.000
              </p>
              <p className="mt-3 text-xs font-bold text-coral">
                3 pelanggan perlu ditagih
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Aktivitas terbaru</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Transaksi masuk dan keluar usaha
                </p>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-primary-dark">
                Lihat semua <ChevronRight size={15} />
              </button>
            </CardHeader>
            <CardContent className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.name}
                  className="flex items-center justify-between rounded-2xl p-3 transition hover:bg-background"
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid size-10 place-items-center rounded-2xl ${transaction.tone}`}>
                      <ReceiptText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{transaction.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{transaction.detail}</p>
                    </div>
                  </div>
                  <p
                    className={`money text-sm font-extrabold ${
                      transaction.amount.startsWith("-")
                        ? "text-danger-foreground"
                        : "text-primary-dark"
                    }`}
                  >
                    {transaction.amount}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yang perlu diperhatikan</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Jaga arus kas tetap sehat
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl bg-danger-bg p-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-coral text-white">
                    <CreditCard size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-danger-foreground">
                      3 piutang mendekati jatuh tempo
                    </p>
                    <p className="mt-1 text-xs leading-5 text-danger-foreground">
                      Kirim pengingat ramah agar pembayaran tetap lancar.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4 border-danger-foreground bg-white text-danger-foreground">
                  Lihat piutang
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary-bg p-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Target penjualan</p>
                  <p className="money mt-1 text-lg font-extrabold">68% tercapai</p>
                </div>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-white">
                  <div className="h-full w-[68%] rounded-full bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-3xl bg-surface-dark px-5 py-4 text-white shadow-[0_12px_30px_-18px_var(--surface-dark)] sm:px-6">
          <div>
            <p className="text-sm font-extrabold">Siap mencatat transaksi baru?</p>
            <p className="mt-1 text-xs text-white/60">
              Catat sekarang, biar laporan besok lebih mudah.
            </p>
          </div>
          <Button variant="gold" size="sm">
            <Plus size={16} /> Tambah
          </Button>
        </div>
      </section>
    </main>
  );
}
