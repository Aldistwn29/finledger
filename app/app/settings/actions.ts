"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/get-current-context";
import { updateSettings } from "@/services/settings/update-settings";

export type SettingsActionState = {
  error?: string;
};

const settingsSchema = z.object({
  fullName: z.string().trim().min(2, "Nama pengguna minimal 2 karakter."),
  businessName: z.string().trim().min(2, "Nama bisnis minimal 2 karakter."),
  businessPhone: z.string().trim().max(40, "Nomor telepon terlalu panjang."),
  businessAddress: z.string().trim().max(240, "Alamat terlalu panjang."),
});

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function updateSettingsAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const context = await requireUser();

  if (!context.business) {
    return { error: "Bisnis belum tersedia." };
  }

  const parsed = settingsSchema.safeParse({
    fullName: getString(formData.get("fullName")),
    businessName: getString(formData.get("businessName")),
    businessPhone: getString(formData.get("businessPhone")),
    businessAddress: getString(formData.get("businessAddress")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateSettings({
      fullName: parsed.data.fullName,
      businessName: parsed.data.businessName,
      businessPhone: parsed.data.businessPhone || null,
      businessAddress: parsed.data.businessAddress || null,
    });
  } catch {
    return { error: "Pengaturan gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/app", "layout");
  redirect("/app/settings");
}
