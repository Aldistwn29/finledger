import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeedbackForm from "@/components/feedback/feedback-form";
import { requireUser } from "@/lib/auth/get-current-context";
import { createFeedbackAction } from "./actions";

export const metadata: Metadata = {
  title: "Feedback | FinLedger",
  description: "Kirim feedback untuk membantu pengembangan FinLedger.",
};

type FeedbackPageProps = {
  searchParams: Promise<{ sent?: string | string[] }>;
};

export default async function FeedbackPage({
  searchParams,
}: FeedbackPageProps) {
  const context = await requireUser();

  if (!context.business) {
    redirect("/setup/business");
  }

  const params = await searchParams;
  const sent = Array.isArray(params.sent) ? params.sent[0] : params.sent;

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Feedback
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bantu kami membuat FinLedger lebih berguna untuk usaha Anda.
        </p>
      </header>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Kirim feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {sent === "1" ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-primary-bg p-4 text-sm text-primary-dark">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
              <p>Feedback berhasil dikirim. Terima kasih.</p>
            </div>
          ) : null}
          <FeedbackForm action={createFeedbackAction} />
        </CardContent>
      </Card>
    </main>
  );
}
