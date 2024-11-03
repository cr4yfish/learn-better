"use server";

import { cache } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getCurrentUserRank } from "./ranks";
import { createClient as getClient } from "./server/server";
import { Followed_Profile, Profile, Rank, User_Follow } from "@/types/db";
import { getCurrentStreak } from "./streaks";
import { streakToStreakDays } from "@/functions/helpers";

export const getProfileById = cache(async(userId: string): Promise<Profile> => {
    const { data, error } = await getClient().from("profiles").select(`
        *,
        ranks (*)
    `).eq("id", userId).single();

    if(error) {  throw error;  }
    
    const streak = await getCurrentStreak(userId, new Date());
    let streakDays = 0;
    if(streak) { streakDays = streakToStreakDays(streak); }

    // get links
    try {
        //if(profile.avatar) profile.avatarLink = await getObjectPublicURL({ id: profile.avatar, bucket: "avatars" });
        //if(profile.banner) profile.bannerLink = await getObjectPublicURL({ id: profile.banner, bucket: "banners" });   
    } catch (error) {
        console.error("Error getting profile links:", error);
    }

    return {
        ...data,
        rank: data.ranks as any,
        currentStreakDays: streakDays ?? 0
    }

})

export const getProfiles = cache(async(): Promise<Profile[]> => {
    const { data, error } = await getClient().from("profiles").select().order("total_xp", { ascending: false });
    if(error) { throw error; }
    return data;
})


type ProfilesInRankProps = {
    rankID?: string;
    offset: number;
    limit: number;
}

export const getProfilesInRank = cache(async(props: ProfilesInRankProps): Promise<Profile[]> => {
    let localRankID = props.rankID;
    if(!localRankID) {
        localRankID = (await getCurrentUserRank()).id;
    }

    const { data, error } = await getClient().from("profiles").select(`
        *,
        ranks (*)    
    `)
        .eq("rank", localRankID)
        .order("total_xp", { ascending: false })
        .range(props.offset, props.offset + props.limit - 1);
        
    if(error) { throw error; }

    return data.map((profile: any) => {
        return {
            ...profile,
            rank: profile.ranks as Rank
        }
    });
})

export const getFriends = cache(async(userId: string): Promise<Profile[]> => {
    const { data, error } = await getClient()
        .from("users_follow")
        .select(`
            *,
            users_follow_user_fkey1 (*),
            users_follow_other_user_fkey1 (*)
        `)
        .eq("user", userId)
        ;
    if(error) { throw error; }

    return data.map((db: any) => {
        return {
            ...db,
            user: db.users_follow_user_fkey1 as Profile,
            other_user: db.users_follow_other_user_fkey1 as Profile
        }
    });
})

export const getFollowers = cache(async(userId: string): Promise<Profile[]> => {
    const { data, error } = await getClient()
        .from("users_follow")
        .select(`
            *,
            users_follow_user_fkey1 (*),
            users_follow_other_user_fkey1 (*)
        `)
        .eq("other_user", userId)
        ;
    if(error) { throw error; }

    return data.map((db: any) => {
        return {
            ...db,
            user: db.users_follow_user_fkey1 as Profile,
            other_user: db.users_follow_other_user_fkey1 as Profile
        }
    });
})

export const getFriendStatus = cache(async({ userId, otherUserId } : { userId: string, otherUserId: string }): Promise<User_Follow> => {
    const { data, error } = await getClient()
        .from("users_follow")
        .select(`*`)
        .eq("user", userId)
        .eq("other_user", otherUserId)
        .select();
    if(error) { throw error; }

    return data[0] as User_Follow;
})

export const searchProfiles = cache(async(searchQuery: string): Promise<Profile[]> => {
    const { data, error } = await getClient()
        .from("profiles")
        .select(`*`)
        .ilike("username", `%${searchQuery}%`)
        .order("username", { ascending: true });
    if(error) { throw error; }

    return data as Profile[];
})

export const searchFriends = cache(async(searchQuery: string): Promise<Followed_Profile[]> => {
    const { data, error } = await getClient()
        .from("followed_profiles")
        .select(`
            *
        `)
        .ilike("username", `%${searchQuery}%`)
        .order("username", { ascending: true });

    if(error) { throw error; }

    return data as Followed_Profile[];
})

export const followUser = async({ userId, otherUserId } : { userId: string, otherUserId: string }): Promise<User_Follow> => {
    const { data, error } = await getClient()
        .from("users_follow")
        .upsert({ user: userId, other_user: otherUserId, follows: true, friends: true })
        .eq("user", userId)
        .eq("other_user", otherUserId)
        .select(`*`).single();
        
    if(error) { throw error; }

    return data as User_Follow;
}

export const unFollowUser = async({ userId, otherUserId } : { userId: string, otherUserId: string }): Promise<boolean> => {
    const { error } = await getClient()
        .from("users_follow")
        .delete()
        .eq("user", userId)
        .eq("other_user", otherUserId)
        .select(`*`).single();
        
    if(error) { throw error; }

    return true;
}