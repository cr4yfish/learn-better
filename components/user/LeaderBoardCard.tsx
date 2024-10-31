"use server";

import { Card, CardBody } from "@nextui-org/card";

import { Profile } from "@/types/db";

import Username from "./Username";
import { SessionState } from "@/types/auth";

export default async function LeaderboardCard({ profile, sessionState, position } : { profile: Profile, sessionState: SessionState, position: number }) {

    return (
        <>
        <Card key={profile.id} className=" w-full" isPressable>
            <CardBody className=" w-full flex flex-row justify-between items-center dark:text-gray-200 text-gray-800">
                <div className="h-full flex flex-row items-center">
                    { position < 4 &&
                        <div className="h-full w-[35px] pl-2 flex items-center justify-start">
                            <span 
                                className={
                                    `text-lg font-black 
                                    ${position == 1 && "text-orange-300"}
                                    ${position == 2 && "text-gray-400"}
                                    ${position == 3 && "text-yellow-600"}
                                `}>
                                    {position}
                                </span>
                        </div>
                    }
                    <Username profile={profile} sessionState={sessionState} />
                </div>
                <span>{profile?.total_xp} XP</span>
            </CardBody>
        </Card>
        </>
    )
}