"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";

import { createClient as getClient } from "./server/server";


import { Question, User_Question, Weak_User_Questions } from "@/types/db";


export const getQuestions = cache(async(topicId: string): Promise<Question[]> => {
    const { data, error } = await getClient().from("questions")
    .select(`
        question_types (*),
        topics (*),
        *
    
    `)
    .eq("topic", topicId);
    if(error) { throw error; }
    
    return data.map((db: any) => {
        return {
            ...db,
            type: db.question_types,
            topic: db.topics 
        }
    });
})

/**
 * Gets weak user questions, lowest score first
 */
export const getWeakQuestions = cache(async (): Promise<Weak_User_Questions[]> => {
    const { data, error } = await getClient().from("weak_user_questions")
        .select(`
            questions (*),
            *
        `)
        .gte("score", 50)
        .order("score", { ascending: false })
    
    if(error) { throw error; }
    return data.map((db: any) => {
        return {
            ...db,
            question: db.questions
        }
    })
} )

export const getQuestionTypes = cache(async() => {
    const { data, error } = await getClient().from("question_types").select();
    if(error) { throw error; }
    return data;
})

export const getQuestionType = cache(async(id: string) => {
    const { data, error } = await getClient().from("question_types").select().eq("id", id);
    if(error) { throw error; }
    return data[0];
})

export const getUserQuestions = cache(async(userId: string) => {
    const { data, error } = await getClient().from("users_questions").select().eq("user", userId);
    if(error) { throw error; }
    return data;
})

// no cache

export async function upsertQuestion(question: Question): Promise<{ id: string }> {

    const dbEntry = {
        id: question.id,
        title: question.title,
        question: question.question,
        answers_correct: question.answers_correct,
        answer_options: question.answer_options,
        type: question.type.id,
        topic: question.topic.id,
    };

    const { data, error } = await getClient().from("questions").upsert([dbEntry]).select().single();

    if(error) { throw error; }
    return { id: data.id };
}

export async function deleteQuestion(questionID: string): Promise<boolean> {
    const { error } = await getClient().from("questions").delete().eq("id", questionID);
    if(error) { throw error; }
    return true;
}

export async function addUserQuestion(userQuestion: User_Question): Promise<User_Question[]> {
    const { data, error } = await getClient().from("users_questions").upsert([userQuestion]).select();
    if(error) { throw error; }
    return data;
}