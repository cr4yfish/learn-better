
import { createClient } from "@supabase/supabase-js";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function getClient() {
    return client;
}