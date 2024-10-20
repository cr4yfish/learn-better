/* eslint-disable @typescript-eslint/no-explicit-any */

import { getClient } from "./supabase";

import { User_Course, Course, Course_Section } from "@/types/db";

export async function getUserCourses(userID: string): Promise<User_Course[]> {
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
            is_official
        ),
        joined_at,
        is_admin,
        is_moderator,
        is_collaborator
    `).eq("user", userID);
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
                is_official: db.courses.is_official
            },
            joined_at: db.joined_at,
            is_admin: db.is_admin,
            is_moderator: db.is_moderator,
            is_collaborator: db.is_collaborator
        }
    });
}

export async function updateCurrentCourse(userID: string, courseID: string): Promise<{ id: string }> {
    const { data, error } = await getClient().from("settings").update({ current_course: courseID }).eq("user", userID).select().single();
    if(error) { throw error; }
    return { id: data.id };
}


export async function getUserCourse(courseID: string): Promise<User_Course> {
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
            is_official
        ),
        joined_at,
        is_admin,
        is_moderator,
        is_collaborator
    `).eq("course", courseID);
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
            is_official: db.courses.is_official
        },
        joined_at: db.joined_at,
        is_admin: db.is_admin,
        is_moderator: db.is_moderator,
        is_collaborator: db.is_collaborator
    }

}



export async function getCourses({
    from = 0,
    limit = 10
} : { from?: number, limit?: number }): Promise<Course[]> {
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
        .order("created_at", { ascending: false })
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
}


export async function upsertCourse(course: Course): Promise<{ id: string }> {
    const dbEntry = {
        id: course.id,
        title: course.title,
        abbreviation: course.abbreviation,
        description: course.description,
        creator: course.creator.id,
        is_official: course.is_official,
        institution: course.institution?.id ?? null
    }

    const { data, error } = await getClient().from("courses").upsert([dbEntry]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function searchCourseSections(searchQuery: string, course: Course, from=0, limit=10): Promise<Course_Section[]> {
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
}



/**
 * Searches for courses using SearchQuery in the title, abbreviation, and description
 * @param searchQuery 
 * @returns 
 */
export async function searchCourses(searchQuery: string, from=0, limit=10): Promise<Course[]> {
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
        is_collaborator: db.is_collaborator
    }
}

export async function leaveCourse(courseID: string, userID: string) {
    const { data, error } = await getClient().from("users_courses").delete().eq("user", userID).eq("course", courseID).select();
    if(error) { throw error; }
    return data;
}
