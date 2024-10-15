"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";

import { Profile } from "@/types/db";
import { getProfiles } from "@/functions/client/supabase";
import Navigation from "@/components/homepage/Navigation";

function LeaderboardCard({ profile } : { profile: Profile }) {

    return (
        <>
        <Card className=" w-full" isPressable>
            <CardBody className=" w-full flex flex-row justify-between items-center">
                <User 
                    name={profile.username}
                />
                <span>{profile.total_xp} XP</span>
            </CardBody>
        </Card>
        </>
    )
}

export default function Leaderboard() {
    const [profiles, setProfiles] = useState<Profile[]>([]);


    useEffect(() => {
        const fetchProfiles = async () => {
            const res = await getProfiles();
            console.log(res);
            setProfiles(res);
        }

        fetchProfiles();
    }, [])

    return (
        <>
        <div className="flex flex-col px-4 py-6 gap-6">
            <h1 className=" font-bold text-4xl">Leaderboard</h1>
            <div className="flex flex-col gap-2">
                {profiles.map((profile, index) => (
                    <>
                    <LeaderboardCard key={index} profile={profile} />
                    </>
                ))}
            </div>
        </div>
        <Navigation activeTitle="Leaderboard" />
        </>
    )
}