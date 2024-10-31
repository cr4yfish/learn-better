"use client";

import { SessionState } from "@/types/auth";
import { Training } from "@/types/db";

import TrainingComplete from "./TrainingComplete";
import { useState } from "react";

export default function TrainingCompleteMain({ training, sessionState } : { training: Training, sessionState: SessionState }) {
    const [step, setStep] = useState(0);

    return (
        <>
        <h1 className="text-5xl font-bold text-center">Training complete!</h1>
        <TrainingComplete training={training} />

        
        </>
    )
}