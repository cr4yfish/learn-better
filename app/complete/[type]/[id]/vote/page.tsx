"use server";

import LevelCompleteContinueButton from "@/components/level/complete/LevelCompleteContinueButton";
import LevelVoteButton from "@/components/level/complete/LevelVoteButton";
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
        <div className="flex flex-col w-full items-center justify-center">
            <h1 className=" text-4xl font-bold text-center w-full">Liked the Level?</h1>
            <p className=" text-gray-700 dark:text-gray-400 ">Voting helps out the creator</p>
        </div>
        <LevelVoteButton userId={session?.user.id} levelId={params.id} />
        <LevelCompleteContinueButton type={params.type} id={params.id} next="done" />
        </>
    )
}