"use server";

import { cache } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient as getClient } from "./server/server";

import { Course, Settings } from "@/types/db";

export const getSettings = cache(async(userID: string): Promise<Settings> => {
    const { data, error } = await getClient().from("settings").select(`
        *,
        courses (*)
    `).eq("user", userID);
    if(error) { throw error; }

    // oh god
    const tmp = data[0] as any;

    return {
        ...tmp,
        current_course: tmp?.courses as Course
    };
})

interface UpsertSettingsParams extends Partial<Settings> {
    userId?: string;
    currentCourseId?: string;
}

export async function upsertSettings(settings: UpsertSettingsParams): Promise<{ id: string }> {
    if(!settings.user?.id && !settings.userId) {
        throw new Error("No user ID provided");
    }

    const userId = settings.user?.id || settings.userId;
    const currentCourseId = settings.current_course?.id || settings.currentCourseId;

    delete (settings as any).courses;
    delete (settings as any).currentCourseId;
    delete (settings as any).userId;

    const { data, error } = await getClient().from("settings").upsert([{
        ...settings,
        current_course: currentCourseId,
        user: userId
    }]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

