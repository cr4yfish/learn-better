

import { Card, CardBody } from "@nextui-org/card";

import { Profile } from "@/types/db";

import Username from "@/components/user/Username";
import { SessionState } from "@/types/auth";

export default function LeaderboardCard({ profile, sessionState, position } : { profile: Profile, sessionState: SessionState, position: number }) {

    return (
        <>
        <Card key={profile.id} className=" w-full" isPressable>
            <CardBody className=" w-full flex flex-row justify-between items-center dark:text-gray-200 text-gray-800">
                <div className="h-full flex flex-row items-center">
                    { 
                        <div className="h-full w-[35px] pl-2 flex items-center justify-start">
                            <span 
                                className={
                                    `text-lg font-black 
                                    text-gray-700 dark:text-gray-500
                                    ${position == 1 && "text-orange-400 dark:text-orange-300"}
                                    ${position == 2 && "text-gray-500 dark:text-gray-300"}
                                    ${position == 3 && "text-yellow-500 dark:text-yellow-600"}
                                `}>
                                    {position}
                                </span>
                        </div>
                    }
                    <Username profile={profile} sessionState={sessionState} />
                </div>
                <span>{profile?.total_xp.toLocaleString()} XP</span>
            </CardBody>
        </Card>
        </>
    )
}