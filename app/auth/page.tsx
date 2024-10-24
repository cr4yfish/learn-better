"use server";

import Link from "next/link";

import { Button } from "@/components/utils/Button";
import { getUser } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";

export default async function Auth() {
    
    const session = await getUser();

    if(session.data.user?.id) {
        redirect("/");
    }

    return (
        <>

        <Link href="/auth/login"><Button color="primary">Get started</Button></Link>
        </>
    )
}