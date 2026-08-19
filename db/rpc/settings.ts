import { createClient } from "@/lib/supabase/server";

export type UpdateSettingsInput = {
  fullName: string;
  businessName: string;
  businessPhone: string | null;
  businessAddress: string | null;
};

export async function updateCurrentUserSettings(
  input: UpdateSettingsInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_current_user_settings", {
    p_full_name: input.fullName,
    p_business_name: input.businessName,
    p_business_phone: input.businessPhone,
    p_business_address: input.businessAddress,
  });

  if (error) {
    throw new Error("Pengaturan gagal disimpan.");
  }
}
