"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomersError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-danger-foreground/30">
        <CardContent className="p-6 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-danger-bg text-danger-foreground">
            <AlertTriangle className="size-6" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold">Customer gagal dimuat</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Terjadi masalah saat mengambil data customer.
          </p>
          <Button type="button" className="mt-6" onClick={reset}>Coba lagi</Button>
        </CardContent>
      </Card>
    </main>
  );
}
