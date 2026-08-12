import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Masuk | Finledger",
  description: "Masuk ke ruang kerja Finledger Anda.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="bg-card w-full max-w-md rounded-3xl border p-6 shadow-[0_8px_24px_-12px_rgba(43,168,162,0.22)] sm:p-8">
        <div className="mb-8 text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-4 grid size-12 place-items-center rounded-2xl text-xl font-extrabold">
            F
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Masuk ke Finledger
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Gunakan akun usaha Anda untuk melanjutkan pencatatan.
          </p>
        </div>

        <LoginForm />

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </section>
    </main>
  );
}
