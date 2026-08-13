"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

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

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Sesi login tidak ditemukan",
    };
  }

  const { error } = await supabase.rpc("create_business_for_current_user", {
    business_name: parsed.data.name,
    selected_business_type: parsed.data.businessType,
    business_phone: parsed.data.phone ?? null,
    business_address: parsed.data.address ?? null,
  });

  if (error) {
    return {
      error: "Bisnis gagal dibuat. Silakan coba lagi.",
    };
  }

  redirect("/app/dashboard");
}
