"use client";

import { useEffect, useState } from "react";

import { Profile } from "@/types/db";

import { Spinner } from "@nextui-org/spinner";
import { SessionState } from "@/types/auth";

import Navigation from "@/components/utils/Navigation";
import LeaderboardCard from "@/components/user/LeaderBoardCard";
import { getCurrentUser } from "@/functions/supabase/auth";
import { getProfilesInRank } from "@/functions/supabase/ranks";

export default function Leaderboard() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [sessionState, setSessionState] = useState<SessionState>({} as SessionState);
    const [isProfilesLoading, setIsProfilesLoading] = useState(true);
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            const res = await getProfilesInRank();
            setProfiles(res);
            setIsProfilesLoading(false);

            const sessionState = await getCurrentUser();
            if(sessionState) {
                setSessionState(sessionState);
                setIsSessionLoading(false);
            }
        }

        fetchProfiles();
    }, [])

    return (
        <>
        <div className="flex flex-col px-4 py-6 gap-6">
            <div className="flex flex-col">
                <h1 className=" font-bold text-4xl mb-0">Leaderboard</h1>
                <span className="">{isSessionLoading ? <Spinner /> : sessionState.profile?.rank.title + " rank"}</span>
            </div>

            <div className="flex flex-col gap-2">
                {profiles.map((profile, index) => (
                    <LeaderboardCard key={index} profile={profile} />
                ))}
                {isProfilesLoading && <Spinner />}
            </div>
        </div>
        <Navigation activeTitle="Leaderboard" />
        </>
    )
}