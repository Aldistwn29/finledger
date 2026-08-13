import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentContext() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile tidak ditemukan");
  }

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let business = null;

  if (membership) {
    const { data } = await supabase
      .from("businesses")
      .select("id, name, business_type, phone, address")
      .eq("id", membership.business_id)
      .single();

    business = data;
  }

  return {
    user,
    profile,
    business,
  };
}

export async function requireUser() {
  const context = await getCurrentContext();

  if (!context) {
    redirect("/login");
  }

  if (context.profile.role !== "User") {
    redirect("/admin/dashboard");
  }

  return context;
}

export async function requireAdmin() {
  const context = await getCurrentContext();

  if (!context) {
    redirect("/login");
  }

  if (context.profile.role !== "Admin") {
    redirect("/app/dashboard");
  }

  return context;
}
