"use server";

import Link from "next/link";

import { Button } from "@/components/utils/Button";

export default async function Auth() {
    
    return (
        <>

        <Link href="/auth/login"><Button color="primary">Get started</Button></Link>
        </>
    )
}