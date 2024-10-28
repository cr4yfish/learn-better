"use server";

import { Card, CardBody } from "@nextui-org/card";

import { Profile } from "@/types/db";

import Username from "./Username";
import { SessionState } from "@/types/auth";

export default async function LeaderboardCard({ profile, sessionState } : { profile: Profile, sessionState: SessionState }) {

    return (
        <>
        <Card key={profile.id} className=" w-full" isPressable>
            <CardBody className=" w-full flex flex-row justify-between items-center dark:text-gray-200 text-gray-800">
                <Username profile={profile} sessionState={sessionState} />
                <span>{profile?.total_xp} XP</span>
            </CardBody>
        </Card>
        </>
    )
}