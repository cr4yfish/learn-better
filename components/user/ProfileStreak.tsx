"use client";

import { Profile } from "@/types/db";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";

import Icon from "@/components/ui/Icon";
import { getCurrentStreak } from "@/utils/supabase/streaks";
import { streakToStreakDays } from "@/utils/functions/helpers";

export default function ProfileStreak({ profile } : { profile: Profile }) {
    const [streakDays, setStreakDays] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStreak = async () => {
            setLoading(true);
            const res = await getCurrentStreak(profile.id, new Date());
            let currentStreakDays = 0;
            if(res) {
                currentStreakDays = streakToStreakDays(res);
            }
            setStreakDays(currentStreakDays);
            setLoading(false);
        }

        fetchStreak();
    }, [profile])

    return (
        <>
        <div className="flex flex-row gap-1">
            <div>
                <Icon filled>mode_heat</Icon>
            </div>
            <div className="flex flex-col">
                <span>{loading ? <Spinner size="sm" /> : streakDays}</span>
            </div>
        </div>
        </>
    )
}