"use server";

import { redirect } from "next/navigation";
import { Progress } from "@nextui-org/progress";

import Navigation from "@/components/ui/Navigation";

import { getCurrentUser } from "@/utils/supabase/auth";
import { getProfilesInRank } from "@/utils/supabase/user";
import { getRanks } from "@/utils/supabase/ranks";
import LeaderboardScroller from "@/components/leaderboard/LeaderboardScroller";

export default async function Leaderboard() {

    const sessionState = await getCurrentUser();

    if(!sessionState || !sessionState.profile) {
        redirect("/auth");
    }

    const initProfiles = await getProfilesInRank({
        rankID: sessionState.profile?.rank?.id,
        offset: 0,
        limit: 20
    });

    const ranks = await getRanks();

    const nextRank = ranks.find(rank => rank.xp_threshold > sessionState.profile!.total_xp);

    return (
        <>
        <div className="flex flex-col px-4 py-6 gap-6 max-h-screen relative overflow-y-hidden">
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
            
            <div className="w-full max-h-full relative overflow-y-auto pb-20">
                <LeaderboardScroller
                    sessionState={sessionState}
                    ranks={ranks}
                    nextRank={nextRank!}
                    initProfilesInRank={initProfiles}
                />
            </div>
            
        </div>
        <Navigation activeTitle="Leaderboard" />
        </>
    )
}