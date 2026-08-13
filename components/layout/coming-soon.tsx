import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6 sm:p-8">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary-bg text-primary-dark">
            <Construction className="size-5" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Halaman ini sedang disiapkan untuk MVP FinLedger.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
