
import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";

import { Profile } from "@/types/db";

export default function LeaderboardCard({ profile } : { profile: Profile }) {

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