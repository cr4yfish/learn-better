
import { Card, CardBody } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";

import { Profile } from "@/types/db";

import Username from "./Username";

export default function LeaderboardCard({ profile } : { profile: Profile | undefined }) {

    return (
        <>
        <Skeleton
            isLoaded={profile !== undefined}
            className="rounded-lg"
        >
            <Card key={profile?.id} className=" w-full" isPressable>
                <CardBody className=" w-full flex flex-row justify-between items-center">
                    <Username initProfile={profile} />
                    <span>{profile?.total_xp} XP</span>
                </CardBody>
            </Card>
        </Skeleton>
        </>
    )
}