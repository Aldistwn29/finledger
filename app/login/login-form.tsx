"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Masukkan email yang valid"),
  password: z.string().min(6, "Password harus memiliki setidaknya 6 karakter"),
});

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const nextErrors: LoginErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        setErrors({
          form: "Email atau password salah. Silakan coba lagi.",
        });

        return;
      }

      router.replace("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-bold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="bg-input focus:border-primary focus:ring-primary/20 mt-2 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus:ring-2"
        />
        {errors.email ? (
          <p id="email-error" className="mt-1.5 text-xs text-red-600">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-bold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="bg-input focus:border-primary focus:ring-primary/20 mt-2 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus:ring-2"
        />
        {errors.password ? (
          <p id="password-error" className="mt-1.5 text-xs text-red-600">
            {errors.password}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.form}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
