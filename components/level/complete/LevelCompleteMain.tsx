"use client";

import { useState } from "react";

import { Button } from "@/components/utils/Button";
import LevelComplete from "@/components/level/LevelComplete";
import ConditionalLink from "@/components/utils/ConditionalLink";
import Icon from "@/components/utils/Icon";

import { SessionState } from "@/types/auth";
import { Topic_Vote, User_Topic } from "@/types/db"
import { upvoteCourseTopic } from "@/utils/supabase/topics";
import LevelCompleteStreak from "./Streak";
import LevelCompleteRank from "./LevelCompleteRank";



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
        <div className=" flex flex-col gap-8 px-4 py-6 h-full justify-center">
            
            { step == 0 && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="font-bold text-5xl">Level complete!</h1>
                    <LevelComplete userTopic={userTopic} />
                </div>
            )}

            { step == 1 && (
                <LevelCompleteStreak streakDays={sessionState.currentStreakDays ?? 0} />
            )}

            { step == 2 && rankUp && sessionState.profile?.rank.title && (
                <LevelCompleteRank rankTitle={sessionState.profile?.rank.title} />
            )}

            { ( (rankUp && step == 3) || (!rankUp && step == 2)) && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <span className="font-bold text-xl">Like the Level?</span>
                    <div className="flex gap-4">
                        <Button 
                            color="secondary" variant="shadow" 
                            onClick={handleUpvoteLevel}
                            fullWidth
                            size="lg"
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
                <span>{step}</span>
                <ConditionalLink active={(rankUp && step == 3) || (!rankUp && step == 2)} href="/">
                    <Button 
                        fullWidth
                        size="lg"
                        onClick={() => {
                            if( (rankUp && step < 3) || (!rankUp && step < 2) ) {
                                setStep(step+1)
                            }
                        }}
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