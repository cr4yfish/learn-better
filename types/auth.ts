
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "./db";

export interface Settings {
    theme: "dark" | "light";
}

export interface SessionState {
    user: User | undefined;
    profile: Profile | undefined;
    session: Session | null;
    isLoggedIn: boolean;
    pendingAuth: boolean;
    settings: Settings
}