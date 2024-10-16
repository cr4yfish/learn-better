"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/Button";
import LevelComplete from "@/components/LevelComplete";
import ConditionalLink from "@/components/ConditionalLink";
import Icon from "@/components/Icon";

import { getCurrentUser, getUserTopic } from "@/functions/client/supabase"
import { SessionState } from "@/types/auth";
import { User_Topic } from "@/types/db"



export default function LevelCompleteScreen({ params: { level }} : { params: { level: string } }) {
    const [userTopic, setUserTopic] = useState<User_Topic>({} as User_Topic);
    const [sessionState, setSessionState] = useState<SessionState>({} as SessionState);
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rankUp, setRankUp] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        setRankUp(searchParams.get("rankUp") == "true");

        const fetchSessionState = async () => {
            const session = await getCurrentUser();
            if(session?.user?.id) {
                setSessionState(session);
                const userTopic = await getUserTopic(session.user.id, level);
                if(userTopic) setUserTopic(userTopic);
                setIsLoading(false);
            }
        }

        fetchSessionState();
    }, [level])

    return (
        <div className=" flex flex-col gap-8 px-4 py-6 min-h-screen justify-center pb-[33vh]">
            
            { step == 0 && (
                <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="font-bold text-5xl">Level complete!</h1>
                { userTopic && sessionState && 
                    <LevelComplete 
                        userTopic={userTopic} 
                        isLoading={isLoading}
                    />
                }
                </div>
            )}

            { step == 1 && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <span 
                        style={{
                            fontSize: "128pt",
                            textShadow: "0px 0px 100px rgba(255, 165, 0, 0.5)",
                            transform: "translateY(120px)"
                        }}
                        className="material-symbols-rounded material-symbols-filled  text-orange-400"
                        >
                            mode_heat
                    </span>
                    <span 
                        style={{
                            WebkitTextStroke: "10px black"
                        }}
                        className="text-[128pt] m-0 font-black z-20 h-[200px]">{sessionState.currentStreakDays}</span>
                    <span className=" text-2xl font-bold">day streak</span>
                </div>
            )}

            { step == 2 && rankUp && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <span className="text-[24pt] font-bold ">You ranked up!</span>
                    <span className="text-[50pt] font-bold ">{sessionState.profile?.rank.title}</span>
                    <span className="text-[16pt] ">New rank</span>
                </div>
            )}
            
            <div className=" w-full">
                <ConditionalLink active={rankUp ? step == 2 : step == 1} href="/">
                    <Button 
                        fullWidth
                        onClick={() => setStep(step + 1)}
                        color="primary" 
                        isDisabled={isLoading}
                        variant="shadow" 
                        endContent={<Icon filled>arrow_right_alt</Icon>}
                    >
                        Continue
                    </Button>
                </ConditionalLink>
            </div>

        </div>
    )
}