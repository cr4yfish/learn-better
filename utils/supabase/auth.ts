"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { User, AuthResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";


import { createClient as getClient } from "./server/server";
import { getUserCourses } from "./courses";
import { getCurrentStreak } from "./streaks";
import { getSettings } from "./settings";


import { Profile, Settings } from "@/types/db";
import { SessionState } from "@/types/auth";

export async function getSession() {
    return await getClient().auth.getSession();
}

export async function getUser() {
    return await getClient().auth.getUser();
}

export async function isLoggedIn() {
    return await getClient().auth.getSession() !== null;
}

export async function userPasswordLogin(email: string, password: string) {
    return await getClient().auth.signInWithPassword({ email, password });
}

export async function userLogOut() {
    return await getClient().auth.signOut();
}

export async function userLogin(email: string, password: string): Promise<{ success: boolean, user: User }> {
    const { data, error } = await getClient().auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) { throw error; }

    return { 
        success: true, 
        user: data.user as User
    };

}

/**
 * Sign up user and creates a profile
 * @param email 
 * @param password 
 * @returns 
 */
export async function userSignUp(email: string, password: string, username: string, avatar?: string) : Promise<{ profile: Profile, authResponse: AuthResponse, settings: Settings }> {
    const authResponse = await getClient().auth.signUp({ email: email, password: password, options: {
        data: { username: username },

    } });
    if(authResponse.error) {
        throw authResponse.error;
    } else {

        // get lowest rank id -> sort by xp_threshold
        const { data: ranks, error: gettingRankError } = await getClient().from("ranks").select("*").order("xp_threshold", { ascending: true }).limit(1);

        if(gettingRankError) {
            throw gettingRankError;
        }

        const dbResult = await getClient().from("profiles").insert([
            { 
                id: authResponse.data.user?.id,
                username: username,
                avatar: avatar ?? null, // this can be null
                total_xp: 0, // no xp
                rank: ranks[0].id // lowest rank

            }]).select().single();

        const settingsResult = await getClient().from("settings").insert([
            {
                user: authResponse.data.user?.id,
                theme: "light",
                color: "blue",
            }

        ]).select().single();
        
        if(dbResult.error) {
            throw dbResult.error;
        } else {
            return { 
                profile: dbResult.data as Profile, 
                authResponse: authResponse,
                settings: settingsResult.data as Settings
            };
        }
    }
}



export async function getProfile(id: string): Promise<Profile> {
    const { data, error } = await getClient().from("profiles").select(`
        id,
        username,
        avatar,
        total_xp,
        ranks (
            id,
            title,
            description,
            xp_threshold
        ),
        banner
    `).eq("id", id).single();
    if(error) { throw error; }

    const profile = {
        id: data.id,
        username: data.username,
        avatar: data.avatar,
        total_xp: data.total_xp,
        rank: data.ranks as any,
        banner: data.banner,
        avatarLink: "",
        bannerLink: ""
    }

    // get links
    try {
        //if(profile.avatar) profile.avatarLink = await getObjectPublicURL({ id: profile.avatar, bucket: "avatars" });
        //if(profile.banner) profile.bannerLink = await getObjectPublicURL({ id: profile.banner, bucket: "banners" });   
    } catch (error) {
        console.error("Error getting profile links:", error);
    }
    return profile;
}

export async function upsertProfile(profile: Profile): Promise<{ id: string }> {

    delete profile.avatarLink;
    delete profile.bannerLink;

    profile.rank = profile.rank.id as any;

    const { data, error } = await getClient().from("profiles").upsert([profile]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function getProfiles(): Promise<Profile[]> {
    const { data, error } = await getClient().from("profiles").select().order("total_xp", { ascending: false });
    if(error) { throw error; }
    return data;
}

export async function getCurrentUser(): Promise<SessionState | null> {
    
    try {
        //const { data: { user } } = await getUser();
        const { data: { session } } = await getSession();

        if(!session?.user?.id) {
            console.log("No session data");
            return null;
        }

        const profile = await getProfile(session?.user?.id as string);
        const settings = await getSettings(session?.user.id as string);
        const courses = await getUserCourses(session?.user.id as string);
        const currentStreak = await getCurrentStreak(session?.user.id as string, new Date());
        let currentStreakDays = 0;

        if(currentStreak) {
            const from = new Date(currentStreak.from);
            const to = currentStreak.to ? new Date(currentStreak.to) : new Date(); // if to is null, use today -> streak is ongoing
            const diff = Math.abs(to.getTime() - from.getTime()) + 1;
            currentStreakDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        }

        revalidatePath("/api/user/current");
        return {
            session: session,
            user: session?.user,
            profile: profile,
            isLoggedIn: true,
            pendingAuth: false,
            settings: settings,
            courses: courses,
            currentStreak: currentStreak ?? undefined,
            currentStreakDays: currentStreakDays
        }
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

export async function updateTotalXP(userID: string, xp: number): Promise<Profile> {
    const { data, error } = await getClient().from("profiles").update({ total_xp: xp }).eq("id", userID).select();
    if(error) { throw error; }
    return data[0];
}
