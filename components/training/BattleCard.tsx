"use client";

import { useState } from "react";
import { Progress } from "@nextui-org/progress";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import BlurModal from "../utils/BlurModal";
import { Battle } from "@/types/db";

export default function BattleCard({ battle } : { battle: Battle }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <Card className=" w-full" onClick={() => setIsModalOpen(true)}>
            <CardHeader className=" pb-3">
                <CardDescription>{battle.xp_goal} XP</CardDescription>
                <CardTitle>{battle.other_user.username}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 pt-0">
                <Progress size="sm" value={battle.user_initiator.total_xp - battle.user_init_start_xp} maxValue={battle.xp_goal} />
                <Progress size="sm" value={battle.other_user.total_xp - battle.user_other_start_xp} maxValue={battle.xp_goal} color="danger" />
            </CardContent>
        </Card>

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            header={<>Battle with {battle.other_user.username}</>}
            body={
                <>
                    <span className=" text-sm">Battle details</span>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row items-center gap-1">
                            <Icon>hotel_class</Icon>
                            {battle.xp_goal} XP to win
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <Icon>schedule</Icon>
                            {new Date(battle.end_date).toLocaleDateString()} Deadline
                        </div>
                    </div>
                    <Progress label="Your progress" showValueLabel value={battle.user_initiator.total_xp - battle.user_init_start_xp} maxValue={battle.xp_goal} />
                    <Progress label="Their progress" showValueLabel value={battle.other_user.total_xp - battle.user_other_start_xp} maxValue={battle.xp_goal} color="danger" />
                </>
            }
            footer={
                <>
                <Button variant="faded" color="danger">Forfeit Battle</Button>
                </>
            }
        />
        </>
    )
}