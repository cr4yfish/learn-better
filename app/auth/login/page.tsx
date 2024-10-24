"use server"

import Link from "next/link"
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card"
import { Input } from "@nextui-org/input"

import { login } from "../actions"
import { Button } from "@/components/utils/Button"

export default async function Login() {

    return (
        <>
        <h1 className="text-4xl font-bold text-center">Welcome back!</h1>
        <form className="w-full">
            <Card>
                <CardHeader className="text-lg font-bold">Login</CardHeader>
                <CardBody className="flex flex-col gap-2">
                        <Input name="email" type="email" label="Email" required />
                        <Input name="password" type="password" label="Password" required  />
                </CardBody>
                <CardFooter>
                    <Button fullWidth color="primary" type="submit" formAction={login} >Login</Button>
                </CardFooter>
            </Card>
        </form>
        <Link href={"/auth/signup"} className=" text-blue-400 hover:text-blue-500 transition-all ">Sign up instead</Link>
        </>
    )
}