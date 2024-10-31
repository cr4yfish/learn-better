"use server";

import TrainingComplete from "@/components/training/TrainingComplete";
import TrainingCompleteMain from "@/components/training/TrainingCompleteMain";
import { getCurrentUser } from "@/utils/supabase/auth";
import { getTrainingById } from "@/utils/supabase/trainings";
import { redirect } from "next/navigation";

export default async function TrainingCompleteScreen({ params: { trainingId } } : { params: { trainingId: string } }) {

    const { training, questions } = await getTrainingById(trainingId);
    const currentUser = await getCurrentUser();

    if(!currentUser?.user?.id) {
        redirect("/auth");
    }

    return (
        <div className="flex flex-col gap-8 px-4 py-6 h-screen justify-center pb-[33vh]">
            <TrainingCompleteMain 
                training={training} 
                sessionState={currentUser} 
            />
        </div>
    )
}