import { createClient } from "@/lib/supabase/server";

export type CustomerMutationInput = {
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

export async function createCustomer(
  input: CustomerMutationInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_customer", {
    p_name: input.name,
    p_phone: input.phone,
    p_address: input.address,
    p_notes: input.notes,
  });

  if (error || typeof data !== "string") {
    throw new Error("Customer gagal dibuat.");
  }

  return data;
}

export async function updateCustomer(
  customerId: string,
  input: CustomerMutationInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_customer", {
    p_customer_id: customerId,
    p_name: input.name,
    p_phone: input.phone,
    p_address: input.address,
    p_notes: input.notes,
  });

  if (error) {
    throw new Error("Customer gagal diperbarui.");
  }
}

export async function deactivateCustomer(customerId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("deactivate_customer", {
    p_customer_id: customerId,
  });

  if (error) {
    throw new Error("Customer gagal dinonaktifkan.");
  }
}
