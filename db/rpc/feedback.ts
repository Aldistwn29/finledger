import { createClient } from "@/lib/supabase/server";

export async function createFeedback(
  category: string,
  message: string,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_feedback", {
    p_category: category,
    p_message: message,
  });

  if (error || typeof data !== "string") {
    throw new Error("Feedback gagal dikirim.");
  }

  return data;
}
