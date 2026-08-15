import { createFeedback as createFeedbackRpc } from "@/db/rpc/feedback";

export async function submitFeedback(
  category: string,
  message: string,
): Promise<string> {
  return createFeedbackRpc(category, message);
}
