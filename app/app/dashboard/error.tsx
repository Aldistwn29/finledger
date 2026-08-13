"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Pulse dashboard error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md border-danger-foreground/30">
        <CardContent className="p-6 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-danger-bg text-coral"><AlertTriangle className="size-6" /></div>
          <h1 className="mt-4 text-xl font-extrabold">Dashboard tidak dapat dimuat</h1>
          <p className="mt-2 text-sm text-muted-foreground">Terjadi masalah saat mengambil data usaha. Silakan coba lagi.</p>
          <Button type="button" className="mt-6" onClick={reset}>Coba lagi</Button>
        </CardContent>
      </Card>
    </main>
  );
}
