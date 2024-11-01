"use server";

import LevelCompleteContinueButton from "@/components/level/complete/LevelCompleteContinueButton";
import Battles from "@/components/training/Battles";
import { getUser } from "@/utils/supabase/auth";
import { getBattles } from "@/utils/supabase/battles";
import { getProfileById } from "@/utils/supabase/user";
import { redirect } from "next/navigation";

type Params = {
    params : {
        type : "level" | "training";
        id : string;
    }
}

export default async function CompleteBattle(params: Params) {
    const { type, id } = params.params;

    // get battles and show progress

    const { data: { user } } = await getUser();

    if(!user?.id) {
        redirect("/auth");
    }

    const userProfile = await getProfileById(user.id);
    const battles = await getBattles(user.id);

    return (
        <>
        <h1 className=" text-4xl font-bold text-center w-full">Your Battles</h1>
        <Battles battles={battles} userId={user.id} showButtons={false} userProfile={userProfile} />
        <LevelCompleteContinueButton type={type} id={id} next="vote" />

        </>
    )
}