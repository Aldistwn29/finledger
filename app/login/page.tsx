import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/login-form";
import { redirectAuthenticatedUser } from "@/lib/auth/get-current-context";

export const metadata: Metadata = {
  title: "Masuk | FinLedger",
  description: "Masuk ke ruang kerja FinLedger Anda.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  await redirectAuthenticatedUser();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="bg-card w-full max-w-md rounded-3xl border p-6 shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--primary)_22%,transparent)] sm:p-8">
        <div className="mb-8 text-center">
          <Link
            href="/"
            aria-label="Kembali ke beranda FinLedger"
            className="bg-primary text-primary-foreground mx-auto mb-4 grid size-12 place-items-center rounded-2xl text-xl font-extrabold"
          >
            F
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Masuk ke FinLedger
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Gunakan akun usaha Anda untuk melanjutkan pencatatan.
          </p>
        </div>

        {params.error === "confirmation_failed" ? (
          <p
            role="alert"
            className="bg-danger-bg text-danger-foreground mb-4 rounded-xl px-4 py-3 text-sm"
          >
            Konfirmasi email gagal. Tautan mungkin tidak valid atau sudah
            kadaluarsa.
          </p>
        ) : null}

        <LoginForm />

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-foreground decoration-primary hover:decoration-accent-dark font-semibold underline decoration-2 underline-offset-4 transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </section>
    </main>
  );
}
