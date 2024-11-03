"use server"


import { Link as NextUILink } from "@nextui-org/link";

import { getUser } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";
import SignupCard from "@/components/auth/SignupCard";

export default async function Signup() {

    const session = await getUser();

    if(session.data.user?.id) {
        redirect("/");
    }

    return (
        <div className="flex flex-col gap-4 relative">
            <h1 className="text-4xl font-bold text-center">Welcome to Nouv!</h1>
            <SignupCard isSignUp />
            <NextUILink href="/auth/login">Login instead</NextUILink>
        </div>
    )
}