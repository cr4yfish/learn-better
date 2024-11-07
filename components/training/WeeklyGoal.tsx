"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Progress } from "@nextui-org/progress";

import { Button } from "../utils/Button";
import Icon from "@/components/ui/Icon";
import { Weekly_Goal } from "@/types/db";
import { setWeeklyGoalByUser } from "@/utils/supabase/weeklyGoals";

function GoalButton({ label, goal, color, setWeeklyGoal, isLoading } : { label: string, goal: number, isLoading: boolean, setWeeklyGoal: (goal: number) => void; color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined }) {
    return (
        <>
        <div className="flex flex-col gap-1 items-center justify-center w-fit h-fit">
            <Button isLoading={isLoading} onClick={() => setWeeklyGoal(goal)} color={color} >{goal}mins</Button>
            <span className=" text-tiny text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        </>
    )
}

export default function WeeklyGoal({ goal, userId, minutesSpentInWeek } : { goal: Weekly_Goal, userId: string, minutesSpentInWeek: number }) {
    const [localGoal, setLocalGoal] = useState<Weekly_Goal>(goal);
    const [isLoading, setIsLoading] = useState(false);

    const updateWeeklyGoal = async (newGoal: number) => {
        setIsLoading(true);
        setLocalGoal({ ...localGoal, goal: newGoal });

        // update in db
        if(localGoal.id == undefined || localGoal.id.length === 0) {
            localGoal.id = uuidv4();
        }

        const res = await setWeeklyGoalByUser({ id: localGoal.id, userId: userId, goal: newGoal });
        setLocalGoal(res);
        setIsLoading(false);
    }

    return (
        <>
        { localGoal.id?.length > 0 &&
        <div className="flex flex-col gap-2 w-full">
            <Progress value={minutesSpentInWeek ?? 0} label="Progress" maxValue={localGoal.goal ?? 0} />

            <div className="flex flex-row justify-evenly items-center w-full">
                <Button isIconOnly variant="flat" onClick={()=> updateWeeklyGoal(localGoal.goal - 5)} ><Icon>remove</Icon></Button>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{localGoal.goal}</span>
                    <span className="text-tiny text-gray-700 dark:text-gray-300">Minutes/Week</span>
                </div>
                <Button isIconOnly variant="flat" onClick={() => updateWeeklyGoal(localGoal.goal + 5)} ><Icon>add</Icon></Button>
            </div>
        </div>
        }
        { localGoal.id == undefined &&
        <div className="flex flex-col gap-2 items-center justify-center w-full">
            <span className=" text-gray-700 dark:text-gray-300 text-sm" >Set a goal to get started</span>
            <div className="flex flex-row justify-evenly items-center gap-2 w-full">
                <GoalButton isLoading={isLoading} label="Easy" goal={5} color="secondary" setWeeklyGoal={updateWeeklyGoal} />
                <GoalButton isLoading={isLoading} label="Recommended" goal={10} color="primary" setWeeklyGoal={updateWeeklyGoal} />
                <GoalButton isLoading={isLoading} label="Gamer" goal={15} color="danger" setWeeklyGoal={updateWeeklyGoal} />
            </div>
        </div>
        }
        </>
    )
}