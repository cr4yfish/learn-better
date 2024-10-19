"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";

import { Profile } from "@/types/db";
import { getCurrentUser, getProfilesInRank } from "@/functions/client/supabase";
import Navigation from "@/components/homepage/Navigation";
import { Spinner } from "@nextui-org/spinner";
import { SessionState } from "@/types/auth";

function LeaderboardCard({ profile } : { profile: Profile }) {

    return (
        <>
        <Card key={profile.id} className=" w-full" isPressable>
            <CardBody className=" w-full flex flex-row justify-between items-center">
                <User 
                    name={profile.username}
                    avatarProps={{ src: profile.avatarLink }}
                />
                <span>{profile.total_xp} XP</span>
            </CardBody>
        </Card>
        </>
    )
}

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