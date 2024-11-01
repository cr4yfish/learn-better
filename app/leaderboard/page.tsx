"use server";

import { redirect } from "next/navigation";
import { Progress } from "@nextui-org/progress";

import Navigation from "@/components/utils/Navigation";
import LeaderboardCard from "@/components/user/LeaderBoardCard";

import { getCurrentUser } from "@/utils/supabase/auth";
import { getProfilesInRank } from "@/utils/supabase/user";
import { getRanks } from "@/utils/supabase/ranks";

export default async function Leaderboard() {

    const sessionState = await getCurrentUser();

    if(!sessionState || !sessionState.profile) {
        redirect("/auth");
    }

    const profiles = await getProfilesInRank(sessionState.profile?.rank?.id);
    const ranks = await getRanks();

    const nextRank = ranks.find(rank => rank.xp_threshold > sessionState.profile!.total_xp);

    return (
        <>
        <div className="flex flex-col px-4 py-6 gap-6">
            <div className="flex flex-col gap-4">
                <h1 className=" font-bold text-2xl mb-0">Leaderboard</h1>
                {nextRank && 
                    <Progress 
                        value={sessionState.profile?.total_xp} 
                        maxValue={nextRank.xp_threshold} 
                        size="sm"
                    />
                }
                <div className="flex flex-row justify-evenly items-center overflow-x-auto w-full">
                    {ranks.map((rank) => (
                        <div 
                            key={rank.id} 
                            className={`flex flex-col items-center justify-center text-center text-sm font-semibold ${sessionState?.profile?.rank?.id === rank.id ? "text-primary" : "text-gray-500"}`}
                        >
                            <span>{rank.title}</span>
                            <span>{rank.xp_threshold.toLocaleString()} XP</span>
                        </div>
                    ))}
                </div>
                
            </div>

            <div className="flex flex-col gap-2">
                {profiles.map((profile, index) => (
                    <LeaderboardCard key={index} profile={profile} sessionState={sessionState} position={index+1} />
                ))}
            </div>
        </div>
        <Navigation activeTitle="Leaderboard" />
        </>
    )
}