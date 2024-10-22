
import { Card, CardBody } from "@nextui-org/card";

import { Profile } from "@/types/db";

import Username from "./Username";

export default function LeaderboardCard({ profile } : { profile: Profile }) {

    return (
        <>
        <Card key={profile.id} className=" w-full" isPressable>
            <CardBody className=" w-full flex flex-row justify-between items-center">
                <Username profile={profile} />
                <span>{profile?.total_xp} XP</span>
            </CardBody>
        </Card>
        </>
    )
}