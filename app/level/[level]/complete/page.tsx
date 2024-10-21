"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/utils/Button";
import LevelComplete from "@/components/level/LevelComplete";
import ConditionalLink from "@/components/utils/ConditionalLink";
import Icon from "@/components/utils/Icon";

import { SessionState } from "@/types/auth";
import { User_Topic } from "@/types/db"
import { getCurrentUser } from "@/functions/supabase/auth";
import { getOwnTopicVote, getUserTopic, upvoteCourseTopic } from "@/functions/supabase/topics";



export default function LevelCompleteScreen({ params: { level }} : { params: { level: string } }) {
    const [userTopic, setUserTopic] = useState<User_Topic>({} as User_Topic);
    const [sessionState, setSessionState] = useState<SessionState>({} as SessionState);
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rankUp, setRankUp] = useState(false);
    const searchParams = useSearchParams();

    // vote
    const [isVoted, setIsVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        setRankUp(searchParams.get("rankUp") == "true");

        const fetchSessionState = async () => {
            const session = await getCurrentUser();
            if(session?.user?.id) {
                setSessionState(session);
                const userTopic = await getUserTopic(session.user.id, level);
                if(userTopic) setUserTopic(userTopic);

                try {
                    const topicVote = await getOwnTopicVote(userTopic.topic, session.user.id);
                    if(topicVote) setIsVoted(topicVote.vote);
                } catch(e) {
                    console.error("Error fetching topic vote", e);
                }   

                setIsLoading(false);
            }
        }

        fetchSessionState();
    }, [level, searchParams]);

    const handleUpvoteLevel = async () => {
        if(userTopic.topic && sessionState.user?.id) {
            setIsVoting(true);
            const res = await upvoteCourseTopic(userTopic.topic, sessionState.user.id);
            if(res) {
                setIsVoted(true);
            }
        }
        setIsVoting(false);
    }

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

            {  rankUp ? (step == 3) : (step == 2) && !isVoted && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <span className="font-bold text-xl">Like the Level?</span>
                    <div className="flex gap-4">
                        <Button 
                            color="primary" variant="shadow" 
                            onClick={handleUpvoteLevel}
                            isLoading={isVoting}
                            isDisabled={isVoted}
                            startContent={<Icon filled={isVoted}>favorite</Icon>}
                        >
                            {isVoted ? "Liked" : "Like"}
                        </Button>
                    </div>
                </div>
            )}
            
            <div className="w-full">
                <ConditionalLink active={rankUp ? (step == 3) : (isVoted ? (step == 1) : (step == 2))} href="/">
                    <Button 
                        fullWidth
                        onClick={() => setStep(step + 1)}
                        color="primary" 
                        isDisabled={isLoading || isVoting}
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