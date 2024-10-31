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

            <svg viewBox="0 0 200 200" className=" fill-fuchsia-400/30 absolute top-[75vh] scale-[300%] blur-3xl opacity-100 -z-10" xmlns="http://www.w3.org/2000/svg">
                <path fill="blue" opacity={.25} d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(150 0)" />
                <path fill="inherit" opacity={1} d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(100 100)" />
            </svg>
        </div>
    )
}