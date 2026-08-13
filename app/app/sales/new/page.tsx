import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Catat Penjualan | FinLedger",
  description: "Catat transaksi penjualan usaha Anda.",
};

export default function NewSalePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-extrabold">Catat penjualan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Form pencatatan penjualan akan tersedia pada tahap berikutnya.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
