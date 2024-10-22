"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDayBefore, isSameDay } from "../../functions/helpers";
import { createClient as getClient } from "./server/server";

import { Streak } from "@/types/db";


export async function getStreaks(userID: string) {
    const { data, error } = await getClient().from("streaks").select().eq("user", userID);
    if(error) { throw error; }
    return data;
}


/**
 * Returns the current streak of the user, if there is one
 * @param userID 
 * @param date 
 */
export async function getCurrentStreak(userID: string, date: Date): Promise<Streak | null> {
    const { data, error } = await getClient()
        .from("streaks")
        .select()
        .eq("user", userID)
        .gte("to", getDayBefore(date).toISOString()) // to >= yesterday <- gets hanging or current streak
    if(error) { 
        if(error.details == "The result contains 0 rows") {
            return null;
        }
        throw error; 
    }
    return data[0] as Streak;

}
/**
 * Either extends a current streak or adds a new one, depending on the dates
 * @param userID 
 * @param from 
 * @param to 
 */
export async function extendOrAddStreak(userID: string, today: Date): Promise<{ streak: Streak, isExtended: boolean, isAdded: boolean }> {
    const { data, error } = await getClient().from("streaks").select().eq("user", userID).order("from", { ascending: false }).limit(1);
    if(error) { throw error; }

    if(data.length === 0) {
        // no streaks, add a new one
        const { data: db, error: addError } = await getClient().from("streaks").insert([
            {
                user: userID,
                from: today,
                to: today
            }
        ]).select();
        if(addError) { throw addError; }
        return { streak: db[0], isExtended: false, isAdded: true };
    } else {
        // check if the streak can be extended
        const lastStreak = data[0] as any as Streak;
        const lastStreakTo = new Date(lastStreak.to as string & undefined);

        // streak is ongoing, dont do anything
        if(isSameDay(lastStreakTo, today)) {
            return { streak: lastStreak, isExtended: false, isAdded: false };
        }

        if(isSameDay(lastStreakTo, getDayBefore(today))) {
            // extend the streak
            const { data: db, error: extendError } = await getClient().from("streaks").update({ to: today }).eq("id", lastStreak.id).select();
            if(extendError) { throw extendError; }
            return { streak: db[0], isExtended: true, isAdded: false };
        } else {
            // add a new streak
            const { data: db, error: addError } = await getClient().from("streaks").insert([
                {
                    user: userID,
                    from: today,
                    to: today
                }
            ]).select();
            if(addError) { throw addError; }
            return { streak: db[0], isExtended: false, isAdded: true };
        }
    }
}