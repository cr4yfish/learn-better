"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { cache } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "./server/server";
import { Battle } from "@/types/db";


export const getBattles = cache(async (userID: string): Promise<Battle[]> => {
    const { data, error } = await createClient()
        .from("battles")
        .select(`
            user_initiator (*),
            other_user (*),
            *
        `)
        .eq("user_initiator", userID)
    if (error) throw error

    return data as Battle[]
})

// no cache

export async function createBattle({ userInitId, userOtherId, xp_goal } : { userInitId: string; userOtherId: string; xp_goal: number }): Promise<Battle> {
    const today = new Date()
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)

    const id = uuidv4()

    const { data, error } = await createClient()
        .from("battles")
        .insert({
            id: id,
            user_initiator: userInitId,
            other_user: userOtherId,
            xp_goal: xp_goal,
            end_date: nextWeek.toISOString()
        })
        .eq("user_initiator", userInitId)
        .eq("other_user", userOtherId)
        .eq("id", id)
        .select("*")
        .single()
    
    if (error) throw error

    return data as Battle
}