import { redirect } from "next/navigation";


import LevelCompleteRank from "@/components/level/complete/LevelCompleteRank";
import LevelCompleteContinueButton from "@/components/level/complete/LevelCompleteContinueButton";
import { getUser } from "@/utils/supabase/auth";
import { getCurrentUserRank } from "@/utils/supabase/ranks";


type Params = {
    params : {
        type : "level" | "training";
        id : string;
    },
    searchParams: { [key: string]: string }
}

export default async function CompleteRank(params: Params) {
    const { type, id } = params.params;
    const urlSearchParams = new URLSearchParams(params.searchParams);
    const rankUp = urlSearchParams.get("rankUp") === "true";


    const { data: { user } } = await getUser(); 

    if(!user?.id) {
        redirect("/auth");
    }

    const currentRank = await getCurrentUserRank();

    if(rankUp) {

        return (
            <>
            <LevelCompleteRank rankTitle={currentRank.title} />
            <LevelCompleteContinueButton type={type} id={id} next="battle" listNumber={4} />
            </>
        )
    } else {
        return (
            redirect(`/complete/${type}/${id}/battle`)
        )
    }
}