"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/utils/supabase/auth";
import { getTrainingById } from "@/utils/supabase/trainings";

import LevelMain from "@/components/level/LevelMain";
import { shuffleArray } from "@/functions/helpers";
import { LevelState } from "@/types/client";


export default async function TrainingLevel({ params: { trainingId } } : { params: { trainingId: string } }) {

    
    const session = await getCurrentUser();

    if(!session) {
        redirect("/auth");
    }

    const { training, questions } = await getTrainingById(trainingId);

    if(!questions) {
        redirect("/404");
    }

    const randomizedQuestions = shuffleArray(questions);

    const initLevelState: LevelState = {
        progress: 0,
        answeredQuestions: 0,
        correctQuestions: 0,
        totalQuestions: randomizedQuestions.length,
        xp: 0,
        currentQuestionIndex: 0,
        seconds: 0,
        rankUp: false,
        questions: randomizedQuestions.map(question => ({ id: question.id, completed: false })),
    }

    return (
        <div className="px-4 py-6 pt-0 flex flex-col gap-4 h-screen w-screen overflow-x-hidden ">
           
            <div className="flex flex-col justify-between h-full min-h-full gap-12 overflow-auto">

                <LevelMain 
                    session={session}
                    trainingMode
                    training={training}
                    questions={randomizedQuestions}
                    initLevelState={initLevelState}
                />

            </div>
        </div>
    )
}