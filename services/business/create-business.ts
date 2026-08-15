import { createClient } from "@/lib/supabase/server";

type CreateBusinessInput = {
  name: string;
  businessType: "GROCERY" | "PULSE";
  phone: string | null;
  address: string | null;
};

export async function createBusinessForCurrentUser(
  input: CreateBusinessInput,
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("create_business_for_current_user", {
    business_name: input.name,
    selected_business_type: input.businessType,
    business_phone: input.phone,
    business_address: input.address,
  });

  return !error;
}
