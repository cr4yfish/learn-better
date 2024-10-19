"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Calendar, DateValue } from "@nextui-org/calendar";
import { Button } from "@nextui-org/button";
import { today, getLocalTimeZone, parseDate, isToday } from "@internationalized/date";

import { Streak as StreakType} from "@/types/db";
import Icon from "./Icon";
import { getStreaks } from "@/functions/client/supabase";

export default function Streak({ streak, streakHanging, userId } : { streak: number, streakHanging: boolean, userId: string | undefined }) {
    const [streaks, setStreaks] = useState<StreakType[]>([]);
    
    const isDateInStreak = (date: DateValue, streak: StreakType): boolean => {
        return date.compare(parseDate(streak.from)) >= 0 && date.compare(parseDate(streak.to)) <= 0;
    }

    const isDateUnavailable = (date: DateValue): boolean => {
        if(isToday(date, getLocalTimeZone())) return false;

        return streaks.some(streak => isDateInStreak(date, streak));
    }

    useEffect(() => {
        if(!userId) return;
        
        const fetchStreaks = async () => {
            const res = await getStreaks(userId);
            if(res) {
                setStreaks(res);
            }
        }

        fetchStreaks();
    }, [userId]);
    
    return (
        <>
        <Popover>
            <PopoverTrigger>
                <Button variant="light" startContent={(
                    <Icon 
                        filled 
                        color={`${streakHanging ? "neutral-600" : "orange-400"}`}
                    >
                        mode_heat
                    </Icon>
                )} 
                className="flex items-center justify-center gap-2"
                >
                    <div 
                        className={`text-2xl font-semibold ${streakHanging ? "text-neutral-600" : "text-orange-400"}`}
                    >
                        {streak}
                    </div>
                </Button>                
            </PopoverTrigger>
            <PopoverContent className=" p-0">
                <Calendar 
                    aria-label="Streak Calendar"
                    value={today(getLocalTimeZone())}
                    isDateUnavailable={isDateUnavailable}
                    isReadOnly 
                    className="  "
                    classNames={{
                        cellButton: `
                            data-[unavailable=true]:text-primary-foreground 
                            data-[unavailable=true]:bg-primary 
                            data-[unavailable=true]:no-underline
                        `
                    }}
                />
            </PopoverContent>
        </Popover>

        </>
    )
}