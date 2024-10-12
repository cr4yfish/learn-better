
import { User, Session } from "@supabase/supabase-js";
import { Profile, Settings, User_Course } from "./db";


export interface SessionState {
    user: User | undefined;
    profile: Profile | undefined;
    session: Session | null;
    isLoggedIn: boolean;
    pendingAuth: boolean;
    settings: Settings;
    courses: User_Course[];
}