"use server"

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

import { Input } from "@nextui-org/input"
import { Link as NextUILink } from "@nextui-org/link";

import { signup } from "../actions"
import { Button } from "@/components/utils/Button"
import { getUser } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";

export default async function Signup() {

    const session = await getUser();

    if(session.data.user?.id) {
        redirect("/");
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-center">Welcome to Nouv!</h1>
            <form className="w-full">
                <Card>
                    <CardHeader className="text-lg font-bold">
                        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 relative z-50">
                        <Input variant="bordered" name="username" type="text" label="Username" required />
                        <Input variant="bordered" name="email" type="email" label="Email" required />
                        <Input variant="bordered" name="password" type="password" label="Password" required />
                    </CardContent>
                    <CardFooter>
                        <Button fullWidth color="primary" type="submit" formAction={signup} >Sign up</Button>
                    </CardFooter>
                </Card>
            </form>
            <NextUILink href="/auth/login">Login instead</NextUILink>
        </div>
    )
}