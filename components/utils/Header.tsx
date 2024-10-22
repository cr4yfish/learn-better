"use client";

import React from "react";
import { Button } from "@nextui-org/button"

import Streak from "../utils/Streak"
import Xp from "../utils/Xp"
import { Streak as StreakType, User_Course } from "@/types/db";
import { SessionState } from "@/types/auth";
import { getDayBefore, isSameDay } from "@/functions/helpers";


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


export default function Header({ 
    currentUserCourse, onOpen, sessionState } : 
    { currentUserCourse?: User_Course, onOpen: () => void, sessionState: SessionState }) {

    return (
        <>
        <div className="flex flex-col justify-center items-center w-full p-6">
            <div className="flex flex-row items-center justify-evenly flex-nowrap gap-5 backdrop-blur w-full">
                <Button 
                    variant="flat" color="secondary"
                    className="font-black" 
                    onClick={() => {
                        onOpen();
                    }} 
                    isLoading={!currentUserCourse?.course?.abbreviation}
                >
                    {currentUserCourse?.course?.abbreviation}
                </Button>
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