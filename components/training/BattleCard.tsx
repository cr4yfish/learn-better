"use client";

import { useEffect, useState } from "react";
import { Progress } from "@nextui-org/progress";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import BlurModal from "../utils/BlurModal";
import { Battle } from "@/types/db";
import { forfeitBattle } from "@/utils/supabase/battles";

const statusMap = {
    active: <><Icon>pending</Icon> In progress</>,
    won: <><Icon>trophy</Icon> You won</>,
    lost: <><Icon>bomb</Icon> You lost</>,
    you_forfeited: <><Icon>block</Icon> You forfeited</>,
    other_forfeited: <><Icon>rocket_launch</Icon> They forfeited</>,
    draw: <><Icon>square</Icon> Draw</>
}

export default function BattleCard({ battle, userId } : { battle: Battle, userId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForfeited, setIsForfeited] = useState(false);
    const [status, setStatus] = useState<"won" | "lost" | "draw" | "forfeit" | "active">("active");

    useEffect(() => {
        if(battle.winning_user == userId) {
            setStatus("won");
        } else if(battle.winning_user == null) {
            setStatus("draw");
        } else if(battle.winning_user == battle.other_user.id) {
            setStatus("lost");
        } else if(battle.is_forfeited) {
            setStatus("forfeit");
        }
    }, [battle, battle.winning_user, userId])

    const handleForfeit = async () => {
        setIsLoading(true);
        await forfeitBattle(battle.id, userId);
        setIsForfeited(true);
        setIsLoading(false);
    }

    return (
        <>
        <Card 
            className={`
                w-full border
                ${(status == "won") && "light:border-success dark:border-success"}
                ${(status == "draw") && "light:border-white dark:border-white"}
                ${(((status == "lost") || (status == "forfeit"))) && "light:border-danger dark:border-danger" }
            `} 
            onClick={() => setIsModalOpen(true)}
        >
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
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-center gap-1">
                            {!battle.completed && statusMap["active"]}
                            {battle.completed && battle.winning_user == battle.user_initiator.id && statusMap["won"]}
                            {battle.completed && battle.winning_user == battle.other_user.id && statusMap["lost"]}
                            {battle.completed && (battle.winning_user == null) && (battle.forfeit_user == null) && statusMap["draw"]}
                            {battle.completed && battle.user_initiator.id == battle.forfeit_user && statusMap["you_forfeited"]}
                            {battle.completed && battle.other_user.id == battle.forfeit_user && statusMap["other_forfeited"]}
                        </div>
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
                {!battle.completed && 
                    <Button 
                        isLoading={isLoading}
                        isDisabled={isForfeited} 
                        onClick={handleForfeit} 
                        variant="faded" 
                        color="danger"
                    >
                        {isForfeited ? "Forfeited" : "Forfeit"}
                    </Button>
                }
                </>
            }
        />
        {battle.justChanged && <span className=" w-full text-xs text-start text-gray-500 dark:text-gray-400 ">Battle updated</span>}
        </>
    )
}