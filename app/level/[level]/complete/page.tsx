"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/supabase/auth";
import { getOwnTopicVote, getUserTopic } from "@/utils/supabase/topics";
import LevelCompleteMain from "@/components/level/complete/LevelCompleteMain";
import { Topic_Vote, User_Topic } from "@/types/db";

export default async function LevelCompleteScreen({ params: { level }, searchParams }: { params: { level: string }, searchParams: { [key: string]: string } }) {
    const urlSearchParams = new URLSearchParams(searchParams);
    const rankUp = urlSearchParams.get("rankUp") === "true";

    const session = await getCurrentUser();
    if (!session?.user?.id) {
        redirect("/auth");
    }

    let userTopic: User_Topic | null = null;

    try {
        userTopic = await getUserTopic(session.user.id, level);
    } catch (error) {
        console.error("User Topic Error:",error)
        redirect("/500");
    }

    let topicVote: Topic_Vote | null = null;

    try {
        topicVote = await getOwnTopicVote(userTopic.topic, session.user.id);
    } catch (error) {
        console.error("Topic Vote Error:",error)
    }
    

    return (
        <div className="flex flex-col gap-8 px-4 py-6 h-screen justify-center pb-[33vh]">
            <LevelCompleteMain 
                userTopic={userTopic} 
                rankUp={rankUp} 
                sessionState={session}
                topicVote={topicVote}
            />
        </div>
    );
}