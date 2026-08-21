"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function logout() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={logout}
      disabled={isPending}
    >
      <LogOut className="size-4" aria-hidden="true" />
      {isPending ? "Keluar…" : "Keluar"}
    </Button>
  );
}
