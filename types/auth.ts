
import { User, Session } from "@supabase/supabase-js";
import { Profile, Settings } from "./db";


export interface SessionState {
    user: User | undefined;
    profile: Profile | undefined;
    session: Session | null;
    isLoggedIn: boolean;
    pendingAuth: boolean;
    settings: Settings
}