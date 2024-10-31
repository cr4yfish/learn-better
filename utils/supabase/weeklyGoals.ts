"use server";

import { cache } from "react";
import { createClient } from "./server/server";
import { Weekly_Goal } from "@/types/db";
/* eslint-disable @typescript-eslint/no-explicit-any */


export const getWeeklyGoals = cache(async (): Promise<Weekly_Goal[]> => {
    const { data, error } = await createClient()
        .from('weekly_goals')
        .select('*')
    if (error) throw error
    return data as any
})

export const getWeeklyGoalByUser = cache(async (userId: string): Promise<Weekly_Goal> => {
    const { data, error } = await createClient()
        .from('weekly_goals')
        .select('*')
        .eq('user', userId)
    if (error) throw error
    return data[0] as Weekly_Goal
})


export const getTimeSpentByUser = cache(async (userId: string): Promise<number> => {

    const currentWeekStart = new Date()
    const currentWeekEnd = new Date()

    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay())
    currentWeekStart.setHours(0, 0, 0, 0)

    currentWeekEnd.setDate(currentWeekEnd.getDate() + (6 - currentWeekEnd.getDay()))
    currentWeekEnd.setHours(23, 59, 59, 999)

    const { data, error } = await createClient()
        .from('users_topics')
        .select('seconds')
        .eq('user', userId)
        .gte('created_at', currentWeekStart.toISOString())
        .lte('created_at', currentWeekEnd.toISOString())
    if (error) throw error
    return data.reduce((acc: number, curr: any) => acc + curr.seconds, 0)
})

// no cache

export async function setWeeklyGoalByUser({ id, userId, goal } : { id: string; userId: string; goal: number }): Promise<Weekly_Goal>  {
    const { data, error } =  await createClient()
        .from('weekly_goals')
        .upsert({
            id: id,
            user: userId,
            goal: goal
        })
        .eq('id', id)
        .select('*')
        .single()

    if(error){
        throw error
    }

    return data as Weekly_Goal
}