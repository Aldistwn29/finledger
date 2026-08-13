import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinLedger | Keuangan UMKM lebih rapi",
  description: "Catat transaksi, pantau piutang, dan pahami bisnis Anda.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const theme = (await cookies()).get("finledger-theme")?.value;
  const themeClass = theme === "dark" ? "dark" : theme === "light" ? "light" : "";

  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${themeClass} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
