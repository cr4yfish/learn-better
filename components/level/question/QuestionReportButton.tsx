"use client";

import { useState } from "react";

import { Question } from "@/types/db";
import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import { reportQuestion } from "@/utils/supabase/reports";

export default function QuestionReportButton({ question, userId }: { question: Question, userId?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isReported, setIsReported] = useState(false);


    const handleReport = async() => {
        if(!userId) return

        setIsLoading(true);

        try {
            await reportQuestion({
                question: question.id,
                user: userId,
            })
            setIsReported(true);
        } catch (e) {
            console.error(e)
            setIsLoading(false);
        }
        
        setIsLoading(false);
    }

    return (
        <Button 
            isLoading={isLoading}
            isDisabled={isReported}
            onClick={handleReport}
            isIconOnly 
            variant="light" 
            color="warning"

        >
            <Icon filled={isReported} >flag</Icon>
        </Button>
    )
}