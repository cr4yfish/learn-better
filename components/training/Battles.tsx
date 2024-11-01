"use client";

import { useState } from "react";

import { Battle } from "@/types/db";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "../ui/card";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";

import BlurModal from "../utils/BlurModal";
import FriendlistAutocomplete from "./FriendlistAutocomplete";
import { createBattle } from "@/utils/supabase/battles";
import BattleCard from "./BattleCard";
import ViewBattles from "./ViewBattles";

const xpGoalsToDifficulty = {
    easy: 1000,
    medium: 5000,
    hard: 10000
}

export default function Battles({ battles, userId } : { battles: Battle[], userId: string }) {
    const [localBattles, setLocalBattles] = useState<Battle[]>(battles);
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [otherUserId, setOtherUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStartBattle = async () => {
        if(otherUserId == null) return;

        setIsLoading(true);

        // Start the battle
        const res = await createBattle({ 
            userInitId: userId,
            userOtherId: otherUserId, 
            xp_goal: xpGoalsToDifficulty[difficulty] 
        });

        setLocalBattles([...localBattles, res]);

        setIsModalOpen(false);
        setIsLoading(false);
    }

    const checkValid = (): boolean => {
        return (difficulty.length > 0 && otherUserId != null);
    }

    return (
        <>
        <Card>
            <CardHeader>
                <CardDescription className="flex flex-row items-center gap-1">
                    <Icon downscale>swords</Icon>
                    Compete with Friends
                </CardDescription>
                <CardTitle>Your Battles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 items-center justify-center">
                {localBattles.filter((b) => !b.completed).length == 0 && <span className=" text-gray-700 dark:text-gray-300 ">No ongoing Battles</span>}
                {localBattles.filter((b) => !b.completed).length > 0 &&
                <>
                {localBattles.filter((b) => !b.completed).map((battle) => (
                    <BattleCard key={battle.id} battle={battle} userId={userId} />
                ))}
                </>
                }
            </CardContent>
            <CardFooter className=" w-full flex flex-row items-center gap-2">
                <Button 
                    startContent={<Icon filled>swords</Icon>} 
                    fullWidth size="lg" color="secondary" 
                    variant="flat"
                    onClick={() => setIsModalOpen(true)}
                >
                    Start a Battle
                </Button>
                <ViewBattles battles={localBattles} userId={userId} />
            </CardFooter>
        </Card>

        <BlurModal 
            isOpen={isModalOpen} 
            updateOpen={setIsModalOpen} 
            settings={{ hasHeader: true, hasBody: true, hasFooter: true }}
            header={<>Start a battle</>}
            body={
            <>
                <span className=" text-sm">1. Choose a friend</span>
                <FriendlistAutocomplete userId={userId} setFriend={(friend) => setOtherUserId(friend.id)} />
                <span className=" text-sm">2. Choose a difficulty</span>
                <div className="flex gap-1 items-center w-full">
                    <Button variant={difficulty == "easy" ? "solid" : "bordered"} color="secondary" onClick={() => setDifficulty("easy")} >Easy</Button>
                    <Button variant={difficulty == "medium" ? "solid" : "bordered"} color="warning" onClick={() => setDifficulty("medium")}>Medium</Button>
                    <Button variant={difficulty == "hard" ? "solid" : "bordered"} color="danger" onClick={() => setDifficulty("hard")}>Hard</Button>
                </div>
            </>
            }
            footer={
            <>
                <Button 
                    size="lg" 
                    color="primary" 
                    variant="shadow" 
                    fullWidth 
                    isLoading={isLoading}
                    isDisabled={!checkValid()}
                    onClick={handleStartBattle}
                >
                    Start Battle
                </Button>
            </>
            }
        />
        </>
    )
}