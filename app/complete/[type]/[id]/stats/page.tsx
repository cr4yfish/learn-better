
import { redirect } from "next/navigation";

import LevelCompleteStats from "@/components/level/complete/LevelCompleteStats";
import { getUserTopic } from "@/utils/supabase/topics";
import { getUser } from "@/utils/supabase/auth";
import { getTrainingById } from "@/utils/supabase/trainings";

import LevelCompleteContinueButton from "@/components/level/complete/LevelCompleteContinueButton";

type Params = {
    params : {
        type : "level" | "training";
        id : string;
    },
    searchParams: { [key: string]: string }
}

export default async function CompleteStats(params: Params) {
    const { type, id } = params.params;
    const urlSearchParams = new URLSearchParams(params.searchParams);
    const rankUp = urlSearchParams.get("rankUp") === "true";

    const { data: { user } } = await getUser();

    if(!user?.id) {
        redirect("/auth");
    }

    let xp = 0, accuracy = 0, seconds = 0;

    if(type == "level") {
        const userTopic = await getUserTopic(user.id, id);
        xp = userTopic.xp;
        accuracy = userTopic.accuracy;
        seconds = userTopic.seconds;
    } else if (type == "training") {
        const { training } = await getTrainingById(id);
        xp = training.xp ?? 0;
        accuracy = training.accuracy ?? 0;
        seconds = training.seconds ?? 0;
    }

    return (
        <>
        <h1 className=" w-full text-center text-4xl font-bold  ">{type == "level" ? "Level" : "Training"} Complete!</h1>
        <LevelCompleteStats xp={xp} accuracy={accuracy} seconds={seconds} />
        <LevelCompleteContinueButton type={type} id={id} next="rank" rankUp={rankUp} />
        </>
    )
}