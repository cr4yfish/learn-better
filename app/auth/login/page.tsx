"use server"

import Link from "next/link"


import { getUser } from "@/utils/supabase/auth"
import { redirect } from "next/navigation"
import SignupCard from "@/components/auth/SignupCard";

export default async function Login() {

    const session = await getUser();

    if(session.data.user?.id) {
        redirect("/");
    }

    return (
        <div className="flex flex-col gap-4 relative">
            <h1 className="text-4xl font-bold text-center">Welcome back!</h1>
            <SignupCard isSignUp={false} />
            <Link href={"/auth/signup"} className=" text-blue-400 hover:text-blue-500 transition-all ">Sign up instead</Link>
        </div>
    )
}