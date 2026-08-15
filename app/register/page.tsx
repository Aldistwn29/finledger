import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar | FinLedger",
  description: "Buat akun FinLedger untuk mulai mengelola usaha Anda.",
  openGraph: {
    title: "Daftar | FinLedger",
    description: "Buat akun FinLedger untuk mulai mengelola usaha Anda.",
  },
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="bg-card w-full max-w-md rounded-3xl border p-6 shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--primary)_22%,transparent)] sm:p-8">
        <div className="mb-8 text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-4 grid size-12 place-items-center rounded-2xl text-xl font-extrabold">
            F
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Daftar FinLedger
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Buat akun gratis untuk mulai mencatat keuangan usaha Anda.
          </p>
        </div>

        <RegisterForm />

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Masuk
          </Link>
        </p>
      </section>
    </main>
  );
}
