"use server";

import { redirect } from "next/navigation";

import { Weak_User_Questions } from "@/types/db";
import { addTraining } from "@/utils/supabase/trainings";
import { getUser } from "@/utils/supabase/auth";
import { shuffleArray } from "@/utils/functions/helpers";


export async function createTrainingLevel(weakQuestions: Weak_User_Questions[]) {

    const { data: { user } } = await getUser();

    if(!user?.id) {
        return;
    }

    const randomizedQuestions = shuffleArray(weakQuestions);

    const res = await addTraining({
        userId: user.id,
        questions: randomizedQuestions.slice(0,5).map((wk) => wk.question)
    })

    // redirect user to the new level
    redirect(`/training/${res.id}`);
    
}