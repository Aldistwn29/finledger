"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter."),
    email: z.string().trim().email("Masukkan email yang valid."),
    password: z.string().min(6, "Kata sandi minimal 6 karakter."),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "Konfirmasi kata sandi tidak sama.",
  });

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

type RegisterErrors = Partial<
  Record<keyof RegisterFormValues | "form", string>
>;

const initialForm: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirm: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(field: keyof RegisterFormValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({
        ...current,
        [field]: undefined,
        form: undefined,
      }));
      setSuccessMessage("");
    };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const nextErrors: RegisterErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          field === "name" ||
          field === "email" ||
          field === "password" ||
          field === "confirm"
        ) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      setSuccessMessage("");
      return;
    }

    setErrors({});
    setSuccessMessage("");

    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: { name: result.data.name },
        },
      });

      if (error) {
        setErrors({
          form: "Registrasi gagal. Silakan periksa data dan coba lagi.",
        });
        return;
      }

      if (!data.session) {
        setForm(initialForm);
        setSuccessMessage(
          "Akun berhasil dibuat. Periksa email Anda untuk konfirmasi.",
        );
        return;
      }

      router.replace("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field
        id="name"
        label="Nama pemilik"
        type="text"
        value={form.name}
        error={errors.name}
        autoComplete="name"
        onChange={updateField("name")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        value={form.email}
        error={errors.email}
        autoComplete="email"
        onChange={updateField("email")}
      />
      <Field
        id="password"
        label="Kata sandi"
        type="password"
        value={form.password}
        error={errors.password}
        autoComplete="new-password"
        onChange={updateField("password")}
      />
      <Field
        id="confirm"
        label="Ulangi kata sandi"
        type="password"
        value={form.confirm}
        error={errors.confirm}
        autoComplete="new-password"
        onChange={updateField("confirm")}
      />

      {errors.form ? (
        <p
          role="alert"
          className="rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger-foreground"
        >
          {errors.form}
        </p>
      ) : null}

      {successMessage ? (
        <p
          role="status"
          className="bg-primary-bg text-primary-dark rounded-xl px-4 py-3 text-sm"
        >
          {successMessage}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Membuat akun..." : "Buat akun"}
      </Button>
    </form>
  );
}

type FieldProps = {
  id: keyof RegisterFormValues;
  label: string;
  type: string;
  value: string;
  error?: string;
  autoComplete: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Field({
  id,
  label,
  type,
  value,
  error,
  autoComplete,
  onChange,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="bg-input placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 mt-2 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus:ring-2"
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
