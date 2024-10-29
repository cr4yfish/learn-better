"use server"

import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@nextui-org/input"

import { login } from "../actions"
import { Button } from "@/components/utils/Button"
import { getUser } from "@/utils/supabase/auth"
import { redirect } from "next/navigation"

export default async function Login() {

    const session = await getUser();

    if(session.data.user?.id) {
        redirect("/");
    }

    return (
        <div className="flex flex-col gap-4 relative">
            <h1 className="text-4xl font-bold text-center">Welcome back!</h1>
            <form className="w-full">
                <Card>
                    <CardHeader className="text-lg font-bold">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 relative z-50">
                            <Input name="email" type="email" label="Email" required />
                            <Input name="password" type="password" label="Password" required  />
                    </CardContent>
                    <CardFooter>
                        <Button fullWidth color="primary" type="submit" formAction={login} >Login</Button>
                    </CardFooter>
                </Card>
            </form>
            <Link href={"/auth/signup"} className=" text-blue-400 hover:text-blue-500 transition-all ">Sign up instead</Link>
        </div>
    )
}