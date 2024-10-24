"use server"

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card"

import { Input } from "@nextui-org/input"
import { Link as NextUILink } from "@nextui-org/link";

import { signup } from "../actions"
import { Button } from "@/components/utils/Button"

export default async function Signup() {

    return (
        <>
        <h1 className="text-4xl font-bold text-center">Welcome to Nouv!</h1>
        <form className="w-full">
            <Card>
                <CardHeader className="text-lg font-bold">Signup</CardHeader>
                <CardBody className="flex flex-col gap-2">
                    <Input name="username" type="text" label="Username" required />
                    <Input name="email" type="email" label="Email" required />
                    <Input name="password" type="password" label="Password" required />
                </CardBody>
                <CardFooter>
                    <Button fullWidth color="primary" type="submit" formAction={signup} >Sign up</Button>
                </CardFooter>
            </Card>
        </form>
        <NextUILink href="/auth/login">Login instead</NextUILink>
        </>
    )
}