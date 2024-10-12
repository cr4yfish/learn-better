"use client";

import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import Link from "next/link";

import Icon from "@/components/Icon";
import Header from "@/components/question/Header"
import Question from "@/components/question/Question"

import { addUsersTopics, getCurrentUser, getQuestions } from "@/functions/client/supabase";

import { Question as QuestionType } from "@/types/db";
import { LevelState } from "@/types/client";
import { SessionState } from "@/types/auth";


export default function Level({ params } : { params: { topic: string }}) {

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [session, setSession] = useState<SessionState>();
    const [levelState, setLevelState] = useState<LevelState>({
        progress: 0,
        answeredQuestions: 0,
        totalQuestions: 1,
        xp: 0,
        currentQuestionIndex: 0
    });

    const addUserTopic = async () => {
        if(!session || !session?.user?.id) return;

        await addUsersTopics({
            topicID: params.topic,
            userID: session.user.id,
            completed: true,
        })
    }

    useEffect(() => {
        try {
            getCurrentUser().then(res => {
                if(res == null) return;
                setSession(res);
            });
        } catch (error) {
            console.error(error);
        }

        async function fetchQuestions(): Promise<QuestionType[]> {
            const res = await getQuestions(params.topic);
            return res;
        }

        fetchQuestions().then(res => {
            setQuestions(res);
            setLevelState((prevState) => ({
                ...prevState,
                totalQuestions: res.length
            }));
        });
 
    }, [])

    useEffect(() => {
        if(levelState.answeredQuestions == levelState.totalQuestions) {
            addUserTopic();
        }
    }, [levelState.answeredQuestions])

    return (
        <div className="dark px-4 py-6 flex flex-col gap-4 h-full min-h-full ">
            <Header progress={levelState.progress} numQuestions={levelState.totalQuestions} xp={levelState.xp} />
           
            <div className="flex flex-col justify-between h-full min-h-full gap-12">
                {questions.length > 0 && levelState.answeredQuestions < levelState.totalQuestions && (
                    <Question 
                        key={questions[levelState.currentQuestionIndex].id} 
                        question={questions[levelState.currentQuestionIndex]} 
                        setLevelState={setLevelState}
                        session={session}
                    />
                )}
                {levelState.answeredQuestions > 0 && levelState.answeredQuestions == levelState.totalQuestions && (
                    <div className="flex flex-col gap-4 items-center justify-center min-h-full h-full">
                        <Icon filled color="green-500">check_circle</Icon>
                        <h2 className="text-2xl font-semibold">Congratulations!</h2>
                        <p>You have completed this level.</p>
                        <Link className="w-full" href={"/"}><Button color="primary" className="w-full">Continue</Button></Link>
                    </div>
                )}
            </div>
        </div>
    )
}