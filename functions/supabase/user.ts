/* eslint-disable @typescript-eslint/no-explicit-any */

import { getCurrentUserRank } from "./ranks";
import { getClient } from "./supabase";
import { Profile, Rank } from "@/types/db";

export async function getProfileById(userId: string): Promise<Profile> {
    const { data, error } = await getClient().from("profiles").select(`
        id,
        username,
        avatar,
        banner,
        total_xp,
        ranks (
            id,
            title,
            description,
            xp_threshold
        )
    `).eq("id", userId).single();

    if(error) {
        throw error;
    }

    return {
        ...data,
        rank: data.ranks as any
    }

}

export async function getProfilesInRank(rankID?: string): Promise<Profile[]> {
    let localRankID = rankID;
    if(!localRankID) {
        localRankID = (await getCurrentUserRank()).id;
    }

    const { data, error } = await getClient().from("profiles").select(`
        id,
        username,
        avatar,
        banner,
        total_xp,
        ranks (
            id,
            title,
            description,
            xp_threshold
        )    
    `).eq("rank", localRankID).order("total_xp", { ascending: false });
    if(error) { throw error; }

    return data.map((profile: any) => {
        return {
            ...profile,
            rank: profile.ranks as Rank
        }
    });
}
