"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/get-current-context";
import { submitFeedback } from "@/services/feedback/create-feedback";

export type FeedbackActionState = {
  error?: string;
};

const feedbackSchema = z.object({
  category: z.enum(["BUG", "SUGGESTION", "OTHER"]),
  message: z.string().trim().min(5, "Feedback minimal 5 karakter.").max(1000),
});

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function createFeedbackAction(
  _previousState: FeedbackActionState,
  formData: FormData,
): Promise<FeedbackActionState> {
  const context = await requireUser();

  if (!context.business) {
    return { error: "Bisnis belum tersedia." };
  }

  const parsed = feedbackSchema.safeParse({
    category: getString(formData.get("category")),
    message: getString(formData.get("message")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await submitFeedback(parsed.data.category, parsed.data.message);
  } catch {
    return { error: "Feedback gagal dikirim. Silakan coba lagi." };
  }

  redirect("/app/feedback?sent=1");
}
