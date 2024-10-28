"use server";

import { redirect } from "next/navigation";

import Navigation from "@/components/utils/Navigation";
import LeaderboardCard from "@/components/user/LeaderBoardCard";

import { getCurrentUser } from "@/utils/supabase/auth";
import { getProfilesInRank } from "@/utils/supabase/user";

export default async function Leaderboard() {

    const sessionState = await getCurrentUser();

    if(!sessionState) {
        redirect("/auth");
    }

    const profiles = await getProfilesInRank(sessionState.profile?.rank?.id);

    return (
        <>
        <div className="flex flex-col px-4 py-6 gap-6">
            <div className="flex flex-col">
                <h1 className=" font-bold text-4xl mb-0">Leaderboard</h1>
                <span className="">{sessionState?.profile?.rank?.title + " rank"}</span>
                
            </div>

            <div className="flex flex-col gap-2">
                {profiles.map((profile, index) => (
                    <LeaderboardCard key={index} profile={profile} sessionState={sessionState} />
                ))}
            </div>
        </div>
        <Navigation activeTitle="Leaderboard" />
        </>
    )
}