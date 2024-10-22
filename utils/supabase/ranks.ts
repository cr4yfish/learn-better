"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession, getProfile } from "./auth";
import { createClient as getClient } from "./server/server";
import { Rank } from "@/types/db";


export async function getRanks(): Promise<Rank[]> {
    const { data, error } = await getClient().from("ranks").select();
    if(error) { throw error; }
    return data;
}

export async function getNextRank(currentRank: Rank): Promise<Rank> {
    const { data, error } = await getClient()
        .from("ranks")
        .select()
        .gt("xp_threshold", currentRank.xp_threshold)
        .order("xp_threshold", { ascending: true })
        .limit(1)
        .single();
    if(error) { throw error; }
    return data as Rank;
}

export async function tryRankUp(userID: string, xp: number, currentRank: Rank): Promise<{ rank: Rank, rankedUp: boolean }> {
    try {
        const nextRank = await getNextRank(currentRank);
        if(xp >= nextRank.xp_threshold) {
            // rank up
            const { error } = await getClient().from("profiles").update({ rank: nextRank.id }).eq("id", userID).select();
            if(error) { throw error; }
            return { rank: nextRank, rankedUp: true };
        } else {
            return { rank: currentRank, rankedUp: false };
        }
    } catch (e) {
        console.error("Error trying to rank up:", e);
        return { rank: currentRank, rankedUp: false };
    }
}


export async function getCurrentUserRank(): Promise<Rank> {
    const session = await getSession();
    if(!session.data.session) {
        throw new Error("No session found");
    }

    const profile = await getProfile(session.data.session.user.id as string);
    return profile.rank as Rank;
}


