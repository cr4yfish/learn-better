"use client";

import { useState } from "react";

import { Button } from "@/components/utils/Button";
import LevelComplete from "@/components/level/LevelComplete";
import ConditionalLink from "@/components/utils/ConditionalLink";
import Icon from "@/components/utils/Icon";

import { SessionState } from "@/types/auth";
import { Topic_Vote, User_Topic } from "@/types/db"
import { upvoteCourseTopic } from "@/utils/supabase/topics";



export default function LevelCompleteMain(
    { userTopic, rankUp, sessionState, topicVote } : 
    { userTopic: User_Topic, rankUp: boolean, sessionState: SessionState, topicVote: Topic_Vote | null }) {
    const [step, setStep] = useState(0);

    // vote
    const [isVoted, setIsVoted] = useState<boolean>(topicVote?.vote ?? false);
    const [isVoting, setIsVoting] = useState(false);

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
                    <LevelComplete  userTopic={userTopic} />
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
                        isDisabled={isVoting}
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