"use server";

import { getSettings } from "@/utils/supabase/settings";
import { getSession } from "@/utils/supabase/auth";
import ClientThemeSwitcher from "./ClientThemeSwitcher";

export default async function AutoThemer() {

    const { data: { session } } = await getSession();
    if(!session?.user.id) { return; }
    const userSettings = await getSettings(session.user.id as string);


   
    return (
        <>
        <ClientThemeSwitcher settings={userSettings} />
        </>
    )
}