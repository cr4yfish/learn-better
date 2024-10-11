import { getProfile, getSession } from "@/functions/client/supabase";
import { Profile } from "@/types/db";
import { Session, User } from "@supabase/supabase-js";
import { useContext, useState, createContext, useEffect } from "react";

interface Settings {
    theme: "dark" | "light";
}

interface SessionState {
    user: User | undefined;
    profile: Profile | undefined;
    session: Session | null;
    isLoggedIn: boolean;
    pendingAuth: boolean;
    settings: Settings
}

const defaultSession: SessionState = {
    user: undefined,
    profile: undefined,
    session: null,
    pendingAuth: true,
    isLoggedIn: false,
    settings: {
        theme: "dark"
    }
}

interface SessionContextProps {
    session: SessionState;
    setSession: React.Dispatch<React.SetStateAction<SessionState>>;
}

const SessionContext = createContext<SessionContextProps>({
    session: defaultSession,
    setSession: () => {}
})

export const SessionContextProvider = ({ children } : { children: React.ReactNode }) => {
    const [session, setSession] = useState<SessionState>(defaultSession);

    useEffect(() => {
        try {
            // check if session is pending
            if(!session.pendingAuth) return;

            console.log("Getting session");

            (async () => {
                const session = await getSession();

                if(!session) {
                    // not logged in
                    // do something maybe?
                    return;
                }

                const profile = await getProfile(session.data.session?.user?.id as string);

                // logged in
                setSession({
                    session: session.data.session,
                    user: session.data.session?.user,
                    profile: profile,
                    isLoggedIn: true,
                    pendingAuth: false,
                    settings: {
                        theme: "dark"
                    }
                })


            })();
            } catch (error) {
            console.error(error);
        }
    }, [session])

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
