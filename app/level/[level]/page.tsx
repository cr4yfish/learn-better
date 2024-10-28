"use server";

import { getCurrentUser } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";
import { getTopic } from "@/utils/supabase/topics";

import LevelMain from "@/components/level/LevelMain";
import { getQuestions } from "@/utils/supabase/questions";
import { shuffleArray } from "@/functions/helpers";
import { LevelState } from "@/types/client";

export default async function Level({ params } : { params: { level: string }}) {

    const session = await getCurrentUser();

    if(!session) {
        redirect("/auth");
    }

    const topic = await getTopic(params.level);

    if(!topic) {
        redirect("/404");
    }

    const questions = await getQuestions(topic.id);

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
        <div className="px-4 py-6 pt-0 flex flex-col gap-4 h-full max-h-screen ">
           
            <div className="flex flex-col justify-between h-full min-h-full gap-12 overflow-auto">

                <LevelMain 
                    session={session}
                    level={topic}
                    questions={randomizedQuestions}
                    initLevelState={initLevelState}
                />

            </div>
        </div>
    )
}