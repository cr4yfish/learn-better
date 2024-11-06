"use server";

import LevelCompleteContinueButton from "@/components/level/complete/LevelCompleteContinueButton";
import LevelCompleteVote from "@/components/level/complete/LevelCompleteVote";
import { getSession } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";


type Params = {
    params : {
        type : "level" | "training";
        id : string;
    }
}

export default async function CompleteVote({params}: Params) {

    if(params.type === "training") {
        redirect("/")
    }

    const { data: { session } } = await getSession();

    if(!session?.user.id) {
        redirect("/auth");
    }

    return (
        <>

        <LevelCompleteVote session={session} params={params} />
        
        <LevelCompleteContinueButton type={params.type} id={params.id} next="done" listNumber={3} />
        </>
    )
}