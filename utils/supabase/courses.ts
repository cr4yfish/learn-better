"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { cache } from "react";

import { createClient as getClient } from "./server/server";

import { User_Course, Course, Course_Section, Course_Vote } from "@/types/db";

export const getUserCourses = cache(async(userID: string): Promise<User_Course[]> => {
    const { data, error } = await getClient().from("users_courses").select(`
        courses (
            abbreviation,
            created_at,
            creator,
            description,
            id,
            institutions (
                id,
                title,
                abbreviation,
                description
            ),
            title,
            is_official,
            courses_votes (
                vote
            ),
            users_courses (
                joined_at
            )
        ),
        joined_at,
        is_admin,
        is_moderator,
        is_collaborator
    `).eq("user", userID).order("joined_at", { ascending: false });
    if(error) { throw error; }
    
    return data.map((db: any) => {
        return {
            course: {
                abbreviation: db.courses.abbreviation,
                created_at: db.courses.created_at,
                creator: db.courses.creator,
                description: db.courses.description,
                id: db.courses.id,
                institution: db.courses.institutions,
                title: db.courses.title,
                is_official: db.courses.is_official,
                votes: (db.courses.courses_votes as {vote: boolean}[]).length,
                members: (db.courses.users_courses as {joined_at: string}[]).length
            },
            joined_at: db.joined_at,
            is_admin: db.is_admin,
            is_moderator: db.is_moderator,
            is_collaborator: db.is_collaborator
        }
    });
})

export const getUserCourse = cache(async (courseID: string, userId: string): Promise<User_Course> => {
    const { data, error } = await getClient().from("users_courses").select(`
        *,
        courses (
            abbreviation,
            created_at,
            creator,
            description,
            id,
            institutions (
                id,
                title,
                abbreviation,
                description
            ),
            title,
            is_official,
            courses_votes (
                vote
            ),
            users_courses (
                joined_at
            )
        )
    `)
    .eq("user", userId)
    .eq("course", courseID);
    if(error) { throw error; }

    const db = data[0] as any;
    
    return {
        course: {
            abbreviation: db.courses.abbreviation,
            created_at: db.courses.created_at,
            creator: db.courses.creator,
            description: db.courses.description,
            id: db.courses.id,
            institution: db.courses.institutions,
            title: db.courses.title,
            is_official: db.courses.is_official,
            votes: (db.courses.courses_votes as {vote: boolean}[]).length,
            members: (db.courses.users_courses as {joined_at: string}[]).length
        },
        joined_at: db.joined_at,
        is_admin: db.is_admin,
        is_moderator: db.is_moderator,
        is_collaborator: db.is_collaborator
    }

})

export const getCourses = cache(async ({
    from = 0,
    limit = 10
} : { from?: number, limit?: number }): Promise<Course[]> => {
    const { data, error } = await getClient()
        .from("courses")
        .select(`
            *,
            institutions (
                *
            ),
            courses_votes (
                vote
            ),
            users_courses (
                joined_at
            )
        `)
        .order("created_at", { ascending: false })
        .range(from, from + limit - 1);
    if(error) { throw error; }

    return data.map((db: any) => {
        return {
            ...db,
            institution: db.institutions,
            votes: (db.courses_votes as {vote: boolean}[]).length,
            members: (db.users_courses as {joined_at: string}[]).length
        }
    })
})

export const getCourseById = cache(async (courseID: string): Promise<Course> => {
    const { data, error } = await getClient().from("courses").select(`
        *,
        courses_votes (
                vote
            ),
        users_courses (
            joined_at
        ),
        creator ( username ),
        course_sections ( id ),
        topics ( id, questions ( id ) )
    `).eq("id", courseID).single();
    if(error) { throw error; }

    return {
        ...data,
        votes: (data.courses_votes as {vote: boolean}[]).length,
        members: (data.users_courses as {joined_at: string}[]).length,
        course_sections_count: data.course_sections.length,
        topics_count: data.topics.length,
        questions_count: data.topics.reduce((acc: number, topic: any) => acc + topic.questions.length, 0)
    } as Course
})

export const searchCourseSections = cache(async (searchQuery: string, course: Course, from=0, limit=10): Promise<Course_Section[]> => {
    const { data, error } = await getClient()
        .from("course_sections")
        .select(`
            id,
            created_at,
            title,
            description,
            order,
            courses (
                id,
                title,
                abbreviation,
                description
            )
        `)
        .eq("course", course.id)
        .or(`title.ilike.*${searchQuery}*` + "," + `description.ilike.*${searchQuery}*`)
        .order("order", { ascending: true }) // need this for range behavior
        .range(from, from + limit - 1);
        
    if(error) { throw error; }

    return data.map((db: any) => {
        return {
            id: db.id,
            created_at: db.created_at,
            title: db.title,
            description: db.description,
            order: db.order,
            course: db.courses
        }
    })
})

export const searchCourses = cache(async (searchQuery: string, from=0, limit=10): Promise<Course[]> => {
    const { data, error } = await getClient()
        .from("courses")
        .select(`
            abbreviation,
            created_at,
            creator,
            description,
            id,
            institutions (
                id,
                title,
                abbreviation,
                description
            ),
            title,
            is_official
        `)
        .or(`title.ilike.*${searchQuery}*` + "," + `abbreviation.ilike.*${searchQuery}*` + "," + `description.ilike.*${searchQuery}*`)
        .order("created_at", { ascending: false }) // need this for range behavior
        .range(from, from + limit - 1);
        
    if(error) { throw error; }

    return data.map((db: any) => {
        return {
            abbreviation: db.abbreviation,
            created_at: db.created_at,
            creator: db.creator,
            description: db.description,
            id: db.id,
            institution: db.institutions,
            title: db.title,
            is_official: db.is_official
        }
    })
})

export const getOwnCourseVote = cache(async (courseID: string, userID: string): Promise<Course_Vote | null> =>  {
    try {
        const { data, error } = await getClient().from("courses_votes").select().eq("user", userID).eq("course", courseID).single();
        if(error) { throw error; }
        return data;
    } catch (e : any) {
        if(e.code !== "PGRST116") {
            console.error("Error getting own course vote:", e)
        }
        ;
        return null;
    }

})

export const getAllCourseVotes = cache(async(courseID: string): Promise<Course_Vote[]> => {
    const { data, error } = await getClient().from("courses_votes").select().eq("course", courseID);
    if(error) { throw error; }
    return data;
})

// No caching

export async function updateCurrentCourse(userID: string, courseID: string): Promise<{ id: string }> {
    const { data, error } = await getClient().from("settings").update({ current_course: courseID }).eq("user", userID).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function upsertCourse(course: Partial<Course>, userId: string): Promise<{ id: string }> {
    const dbEntry = {
        id: course.id,
        title: course.title,
        abbreviation: course.abbreviation,
        description: course.description,
        creator: userId,
        is_official: course.is_official,
        institution: course.institution?.id ?? null,
        is_public: course.is_public ?? true,
    }

    const { data, error } = await getClient().from("courses").upsert([dbEntry]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function joinCourse(courseID: string, userID: string, options?: { is_admin: boolean, is_moderator: boolean, is_collaborator: boolean }): Promise<User_Course> {
    const { data: db, error } = await getClient().from("users_courses").insert([
        {
            user: userID, 
            course: courseID, 
            joined_at: new Date(), 
            is_admin: options?.is_admin ?? false, 
            is_moderator: options?.is_moderator ?? false,
            is_collaborator: options?.is_collaborator ?? false
        }
    ]).eq("user", userID).eq("course", courseID).select(`
        courses (*),
        joined_at,
        is_admin,
        is_moderator,
        is_collaborator
    `).single();
    if(error) { throw error; }
    
    return {
        course: db.courses as any as Course,
        joined_at: db.joined_at,
        is_admin: db.is_admin,
        is_moderator: db.is_moderator,
        is_collaborator: db.is_collaborator,
    }
}

export async function leaveCourse(courseID: string, userID: string) {
    const { data, error } = await getClient().from("users_courses").delete().eq("user", userID).eq("course", courseID).select();
    if(error) { throw error; }
    return data;
}

export async function upvoteCourse(courseID: string, userID: string): Promise<Course_Vote> {
    const { data, error } = await getClient().from("courses_votes").upsert({
        user: userID,
        course: courseID,
        vote: true,
    }).eq("user", userID).eq("course", courseID).select().single();
    if(error) { throw error; }
    return data;
}

