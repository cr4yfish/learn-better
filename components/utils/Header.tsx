"use server";

import { redirect } from "next/navigation";

import Streak from "../utils/Streak"
import Xp from "../utils/Xp"
import HeaderCourseSelect from "../header/HeaderCourseSelect";

import { Streak as StreakType } from "@/types/db";

import { getDayBefore, isSameDay } from "@/functions/helpers";
import { getCurrentUser } from "@/utils/supabase/auth";

/**
 * Checks wether the streak is hanging (ends yesterday, aka user can extend it today)
 * @param streak Streak
 * @returns boolean
 */
const checkStreakHanging = (streak: StreakType): boolean => {
    const today = new Date();
    const yesterday = getDayBefore(today);
    const streakEndDate = new Date(streak.to);
    
    if(isSameDay(yesterday, streakEndDate)) 
        return true;
    return false;
}


export default async function Header() {

    const sessionState = await getCurrentUser();
    
    if(!sessionState) { redirect("/auth") }

    return (
        <>
        <div className="flex flex-col justify-center items-center w-full p-6 shadow-lg dark:shadow-none ">
            <div className="flex flex-row items-center justify-evenly flex-nowrap gap-5 backdrop-blur w-full">
                <HeaderCourseSelect sessionState={sessionState}  />
                <Streak 
                    streak={sessionState.currentStreakDays} 
                    streakHanging={sessionState.currentStreak ? checkStreakHanging(sessionState.currentStreak) : false}
                    userId={sessionState.user?.id}
                />
                <Xp xp={sessionState.profile?.total_xp} isLoaded={sessionState.profile?.total_xp ? true : false} />
            </div>
        </div>

        </>
    )
}