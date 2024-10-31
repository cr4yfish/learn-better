"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStopwatch } from "react-use-precision-timer";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import QuestionHeader from "@/components/level/question/QuestionHeader";
import Question from "@/components/level/question/Question"

import { Question as QuestionType, Topic, Training, User_Topic } from "@/types/db";
import { LevelState } from "@/types/client";
import { SessionState } from "@/types/auth";
import { updateTotalXP } from "@/utils/supabase/auth";
import { tryRankUp } from "@/utils/supabase/ranks";
import { extendOrAddStreak } from "@/utils/supabase/streaks";
import { addUsersTopics } from "@/utils/supabase/topics";
import { completeTraining } from "@/utils/supabase/trainings";

export default function LevelMain(
    { session, level, questions, initLevelState, trainingMode=false, training } : 
    { session: SessionState, level?: Topic, questions: QuestionType[], initLevelState: LevelState, trainingMode?: boolean, training?: Training }) {

    const [levelState, setLevelState] = useState<LevelState>(initLevelState);
    const [isLoading, setIsLoading] = useState(true);
    const stopwatch = useStopwatch();

    useEffect(() => {
        stopwatch.start(); return () => { stopwatch.stop() }
    }, [stopwatch])

    useEffect(() => {
        if((levelState.answeredQuestions == levelState.totalQuestions)) {
            handleCompleteLevel();
        }
    }, [levelState.answeredQuestions])

    const handleCompleteLevel = async () => {
        if(!session.user?.id || !session.profile?.total_xp) return;
        stopwatch.pause();
        setIsLoading(true);

        const seconds = Math.round(stopwatch.getElapsedRunningTime()/1000);
        const accuracy = levelState.correctQuestions/levelState.answeredQuestions * 100;

        if(trainingMode) {
            await updateTraining(seconds, accuracy);
        } else {
            await addUserTopic(seconds, accuracy);
        }

        stopwatch.stop();
        setLevelState((prevState) => ({
            ...prevState,
            seconds: seconds
        }))

        await updateTotalXP(session.user.id, session.profile?.total_xp + levelState.xp);
        await extendOrAddStreak(session.user.id, new Date());
        const { rankedUp } = await tryRankUp(session.user.id, session.profile.total_xp + levelState.xp, session.profile.rank);

        if(rankedUp) {
            setLevelState((prevState) => ({
                ...prevState,
                rankUp: true
            }))
        }
    }

    const addUserTopic = async (seconds: number, accuracy: number): Promise<User_Topic | void> => {
        if(!session.user?.id || !session.profile?.total_xp || trainingMode || !level) return;
        const newTopic = {
            userID: session.user.id,
            topicID: level.id,
            completed: true,
            seconds: seconds,
            accuracy: accuracy,
            xp: levelState.xp         
        }
        return await addUsersTopics(newTopic)  
    }

    const updateTraining = async (seconds: number, accuracy: number): Promise<Training | void> => {
        if(!trainingMode || !training) return;
        const res = await completeTraining({
            trainingId: training.id,
            accuracy: seconds,
            seconds: accuracy,
            xp: levelState.xp
        })
        return res;
    }

    return (
        <div className="px-4 py-6 pt-4 flex flex-col gap-4 h-full max-h-screen ">
            <QuestionHeader 
                progress={levelState.progress} 
                numQuestions={levelState.totalQuestions} 
                xp={levelState.xp} 
                show={questions.length > 0 && levelState.answeredQuestions < levelState.totalQuestions}
            />
           
            <div className="flex flex-col justify-between h-full min-h-full gap-12 overflow-visible">
                {questions.length > 0 && levelState.answeredQuestions < levelState.totalQuestions && (
                    <Question 
                        question={questions[levelState.currentQuestionIndex]} 
                        setLevelState={setLevelState}
                        session={session}
                        levelState={levelState}
                        questions={questions}
                    />
                )}
                {levelState.answeredQuestions > 0 && levelState.answeredQuestions == levelState.totalQuestions && (
                    <div className="flex flex-col gap-8 items-center justify-center w-full h-full  px-4 pb-[33vh] pt-[20vh] overflow-hidden">
                        <Icon upscale filled color="green-500">check_circle</Icon>
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="text-4xl font-semibold">Congratulations!</h2>
                            {!trainingMode &&<p>You have completed this level.</p>}
                            {trainingMode && <p>You have completed this training.</p>}
                        </div>

                        <Link 
                            className="w-full" 
                            href={`/${trainingMode ? "training" : "level"}/${trainingMode ? training?.id : level?.id}/complete?rankUp=${levelState.rankUp}`}
                        >
                            <Button 
                                color="primary" 
                                variant="shadow" 
                                className="w-full font-bold"
                                isLoading={isLoading}
                            >
                                Continue
                            </Button>
                        </Link>
                        
                    </div>
                )}
            </div>
        </div>
    )
}