import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

export function createClient() {
    return createBrowserClient(
        supabaseEnv.NEXT_PUBLIC_SUPABASE_URL,
        supabaseEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    );
}