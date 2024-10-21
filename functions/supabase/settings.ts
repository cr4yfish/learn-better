/* eslint-disable @typescript-eslint/no-explicit-any */

import { getClient } from "./supabase";

import { Course, Settings } from "@/types/db";

export async function upsertSettings(settings: Settings): Promise<{ id: string }> {
    if(!settings.user?.id) {
        throw new Error("No user ID provided");
    }
    delete (settings as any).courses;
    const { data, error } = await getClient().from("settings").upsert([{
        ...settings,
        current_course: settings.current_course?.id,
        user: settings.user.id
    }]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function getSettings(userID: string): Promise<Settings> {
    const { data, error } = await getClient().from("settings").select(`
        created_at,
        updated_at,
        theme,
        color,
        courses (*),
        gemini_api_key
    `).eq("user", userID);
    if(error) { throw error; }

    // oh god
    const tmp = data[0] as any;

    return {
        ...tmp,
        current_course: tmp?.courses as Course
    };
}
