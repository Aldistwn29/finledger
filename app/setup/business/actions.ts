"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentContext } from "@/lib/auth/get-current-context";
import { APP_ROLES } from "@/lib/auth/roles";
import { createBusinessForCurrentUser } from "@/services/business/create-business";

const businessSchema = z.object({
  name: z.string().trim().min(2, "Nama bisnis minimal 2 karakter"),
  businessType: z.enum(["GROCERY", "PULSE"]),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export type BusinessActionState = {
  error?: string;
};

export async function createBusiness(
  _previousState: BusinessActionState,
  formData: FormData,
): Promise<BusinessActionState> {
  const parsed = businessSchema.safeParse({
    name: formData.get("name"),
    businessType: formData.get("businessType"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data tidak valid",
    };
  }

  const context = await getCurrentContext();

  if (!context || context.profile.role !== APP_ROLES.USER) {
    return {
      error: "Sesi login tidak ditemukan",
    };
  }

  if (context.business) {
    return {
      error: "Bisnis sudah tersedia untuk akun ini.",
    };
  }

  const created = await createBusinessForCurrentUser({
    name: parsed.data.name,
    businessType: parsed.data.businessType,
    phone: parsed.data.phone ?? null,
    address: parsed.data.address ?? null,
  });

  if (!created) {
    return {
      error: "Bisnis gagal dibuat. Silakan coba lagi.",
    };
  }

  redirect("/app/dashboard");
}
