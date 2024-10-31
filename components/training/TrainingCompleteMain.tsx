"use client";

import { SessionState } from "@/types/auth";
import { Training } from "@/types/db";

import { Button } from "../utils/Button";
import TrainingComplete from "./TrainingComplete";
import { useState } from "react";
import LevelCompleteStreak from "../level/complete/Streak";
import LevelCompleteRank from "../level/complete/LevelCompleteRank";
import ConditionalLink from "../utils/ConditionalLink";

export default function TrainingCompleteMain({ training, sessionState, rankUp=false } : { training: Training, sessionState: SessionState, rankUp?: boolean }) {
    const [step, setStep] = useState(0);

    return (
        <>

        { step == 0 &&
            <>
            <h1 className="text-5xl font-bold text-center">Training complete!</h1>
            <TrainingComplete training={training} />
            </>
        }

        { step == 1 && sessionState.currentStreakDays &&
            <>
            <LevelCompleteStreak streakDays={sessionState.currentStreakDays} />
            </>
        }

        { step == 2 && sessionState.profile?.rank.title && rankUp &&
            <LevelCompleteRank rankTitle={sessionState.profile.rank.title} />
        }

        <ConditionalLink active={rankUp ? step >= 2 : step >= 1} href="/" >
            <Button 
                onClick={() => {
                    if( (rankUp && step < 2) || (!rankUp && step < 1) ) {
                        setStep(step+1)
                    }
                }} 
                size="lg" color="primary" variant="shadow" 
                fullWidth
            >
                Continue
            </Button>
        </ConditionalLink>
        </>
    )
}