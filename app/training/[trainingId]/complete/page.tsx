"use server";

import TrainingCompleteMain from "@/components/training/TrainingCompleteMain";
import { getCurrentUser } from "@/utils/supabase/auth";
import { getTrainingById } from "@/utils/supabase/trainings";
import { redirect } from "next/navigation";

export default async function TrainingCompleteScreen({ params: { trainingId }, searchParams } : { params: { trainingId: string }, searchParams: { [key: string]: string }  }) {
    const urlSearchParams = new URLSearchParams(searchParams);
    const rankUp = urlSearchParams.get("rankUp") === "true";

    const { training } = await getTrainingById(trainingId);
    const currentUser = await getCurrentUser();

    if(!currentUser?.user?.id) {
        redirect("/auth");
    }

    return (
        <div className="flex flex-col gap-8 px-4 py-6 h-screen justify-center pb-[33vh]">
            <TrainingCompleteMain 
                training={training} 
                sessionState={currentUser}
                rankUp={rankUp}
            />
        </div>
    )
}