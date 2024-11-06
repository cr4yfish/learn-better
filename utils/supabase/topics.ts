"use server";

import { cache } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */


import { createClient as getClient } from "./server/server";

import { Topic, Topic_Vote, User_Topic } from "@/types/db";

export const getCourseTopics = cache(async(courseId: string, from: number, limit: number): Promise<Topic[]> => {
    const { data, error } = await getClient().from("topics").select(`
        id,
        created_at,
        title,
        description,
        courses (
            id,
            title,
            abbreviation,
            description
        ),
        users_topics (
            completed,
            accuracy
        ),
        order,
        course_sections (
            id,
            title,
            description,
            order
        )
    `)
    .eq("course", courseId)
    .order("created_at", { ascending: true })
    .order("order", { ascending: true })
    .range(from, from + limit -1);
    if(error) { throw error; }

    const topics: Topic[] = (data.map((db: any) => {
        return {
            id: db.id,
            created_at: db.created_at,
            title: db.title,
            description: db.description,
            course: db.courses,
            course_section: db.course_sections,
            order: db.order,
            completed: db.users_topics[0]?.completed ?? false,
            accuracy: db.users_topics[0]?.accuracy ?? 0
        }
    }))

    // Sort topics by course_section order
    topics.sort((a, b) => {
        return a.course_section.order - b.course_section.order;
    });
    
    return topics;
})

export const getCourseSectionTopics = cache(async(courseSectionID: string): Promise<Topic[]> => {
    const { data, error } = await getClient().from("topics").select(`
        id,
        created_at,
        title,
        description,
        courses (
            id,
            title,
            abbreviation,
            description
        ),
        order,
        course_sections (
            id,
            title,
            description,
            order,
            course
        )
    `).eq("course_section", courseSectionID).order("order", { ascending: true });
    if(error) { throw error; }
    return data.map((db: any) => {
        return {
            id: db.id,
            created_at: db.created_at,
            title: db.title,
            description: db.description,
            course: db.courses as any,
            order: db.order,
            course_section: {
                id: db.course_sections.id,
                title: "",
                description: "",
                course: db.courses.id,
                order: db.course_sections.order
            }
        }
    });
})

export const getTopic = cache(async(topicId: string): Promise<Topic> => {
    const { data, error } = await getClient().from("topics").select(`
        id,
        created_at,
        title,
        description,
        courses (
            id,
            title,
            abbreviation,
            description
        ),
        order,
        course_sections (
            id,
            title,
            description,
            order
        )
    `).eq("id", topicId).single();
    if(error) { throw error; }
    return {
        id: data.id,
        created_at: data.created_at,
        title: data.title,
        description: data.description,
        course: data.courses as any,
        order: data.order,
        course_section: data.course_sections as any
    }
})

export const getUsersTopics = cache(async(): Promise<User_Topic[]> => {
    const { data, error } = await getClient().from("users_topics").select(`
        user,
        topics (
            id, 
            title, 
            description,
            course (
                id,
                title,
                abbreviation,
                description
            )
        ),
        completed
    `);
    if(error) { throw error; }

    return data.map((db: any) => {
        return {
            user: undefined,
            topic: db.topics as Topic,
            completed: db.completed as boolean,
            seconds: db.time as number,
            accuracy: db.accuracy as number,
            xp: db.xp as number
        }
    })
})

export const getUserTopic = cache(async(userId: string, topicId: string): Promise<User_Topic> => {
    const { data, error } = await getClient().from("users_topics").select(`
        user,
        topics (
            id, 
            title, 
            description,
            course (
                id,
                title,
                abbreviation,
                description
            )
        ),
        completed,
        accuracy,
        xp,
        created_at,
        seconds
    `).eq("user", userId).eq("topic", topicId).single();
    if(error) { throw error; }
    return {
        user: undefined,
        topic: data.topics as any as Topic,
        completed: data.completed as boolean,
        seconds: data.seconds as number,
        accuracy: data.accuracy as number,
        xp: data.xp as number
    };
})

export const getOwnTopicVote = cache(async(topic: Topic, userId: string): Promise<Topic_Vote> => {
    const { data, error } = await getClient().from("topics_votes").select().eq("topic", topic.id).eq("user", userId).single();
    if(error) { throw error; }
    return data;
})

export const getAllTopicVotes = cache(async(topic: Topic): Promise<Topic_Vote[]> => {
    const { data, error } = await getClient().from("topics_votes").select().eq("topic", topic.id);
    if(error) { throw error; }
    return data;
})

// no cache

export async function addUsersTopics({
    userID, topicID, completed, seconds, accuracy, xp
} : {
    userID: string, topicID: string, completed: boolean, seconds: number, accuracy: number, xp: number
}): Promise<User_Topic> {

    const { data, error } = await getClient().from("users_topics").upsert([{
        user: userID,
        topic: topicID,
        completed: completed,
        seconds: seconds,
        accuracy: accuracy,
        xp: xp
    }]).select().single();
    if(error) { throw error; }
    return data;
}

export async function upvoteCourseTopic(topicId: string, userId: string): Promise<Topic_Vote> {
    const { data, error } = await getClient().from("topics_votes").upsert([{
        topic: topicId,
        user: userId,
        vote: true
    }]).eq("user", userId).eq("topic", topicId).select().single();

    if(error) { throw error; }

    return data;
}

export async function upsertCourseTopic(topic: Topic): Promise<{ id: string }> {
    const { data, error } = await getClient().from("topics").upsert([{
        id: topic.id,
        title: topic.title,
        description: topic.description,
        course: topic.course.id,
        course_section: topic.course_section.id
    }]).select();

    if(error) { throw error; }
    return { id: data[0].id };
}

export async function deleteCourseTopic(topic: Topic): Promise<{ success: boolean }> {
    const { error } = await getClient().from("topics").delete().eq("id", topic.id);
    if(error) { throw error; }
    return { success: true };
}