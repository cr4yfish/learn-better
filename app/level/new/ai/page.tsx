"use server";

import Link from "next/link";
import { redirect } from "next/navigation";


import { getCurrentUser } from "@/utils/supabase/auth";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import LevelNewAIMain from "@/components/level/new/ai/LevelNewAIMain";


export default async function CreateLevelWithAI() {


    const session = await getCurrentUser();

    if(!session) {
        redirect("/auth");
    }

    return (
        <>
        <div className="relative flex flex-col px-4 py-6 gap-2 max-h-screen overflow-hidden">
            <div className="w-full flex items-start">
                <Link href={"/"}><Button startContent={<Icon filled>arrow_back</Icon>} variant="light">Back</Button></Link>
            </div>

 
            <LevelNewAIMain sessionState={session} />

        </div>
        </>
    )
}