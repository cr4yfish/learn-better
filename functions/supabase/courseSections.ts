/* eslint-disable @typescript-eslint/no-explicit-any */

import { getClient } from "./supabase";

import { Course_Section } from "@/types/db";



export async function upsertCourseSection(courseSection: Course_Section): Promise<{ id: string }> {
    const { data, error } = await getClient().from("course_sections").upsert([{
        ...courseSection,
        course: courseSection.course.id
    }]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function deleteCourseSection(courseSectionID: string): Promise<boolean> {
    const { error } = await getClient().from("course_sections").delete().eq("id", courseSectionID);
    if(error) { throw error; }
    return true;
}

export async function getCourseSection(courseSectionID: string): Promise<Course_Section> {
    const { data, error } = await getClient().from("course_sections").select(`
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
    `).eq("id", courseSectionID).single();
    if(error) { throw error; }
    return {
        id: data.id,
        created_at: data.created_at,
        title: data.title,
        description: data.description,
        order: data.order,
        course: data.courses as any
    }
}


export async function getCourseSections(courseId: string): Promise<Course_Section[]> {
    const { data, error } = await getClient().from("course_sections").select(`
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
    `).eq("course", courseId).order("order", { ascending: true });
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
    });
}