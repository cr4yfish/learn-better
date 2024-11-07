"use client";

import { useState } from "react";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/ui/Icon";
import { upvoteCourseTopic } from "@/utils/supabase/topics";

type Params = {
    userId: string;
    levelId: string;
}

export default function LevelVoteButton(params : Params) {
    const [isVoted, setIsVoted] = useState<boolean>(false);
    const [isVoting, setIsVoting] = useState(false);

    const handleUpvoteLevel = async () => {
        setIsVoting(true);
        const res = await upvoteCourseTopic(params.levelId, params.userId);
        if(res) {
            setIsVoted(true);
        }
        
        setIsVoting(false);
    }

    return (
        <>
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
        </>
    )
}