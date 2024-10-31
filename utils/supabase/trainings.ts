"use server";

import { cache } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "./server/server";
import { Question, Training } from "@/types/db";


export const getTrainingById = cache(async (trainingId: string): Promise<{ training: Training, questions: Question[] }> => {

    const { data, error } = await createClient()
        .from("trainings")
        .select("*")
        .eq("id", trainingId)
        .select(`
            questions (
                question_types (*),
                topics (*),
                *
            ),
            *
        `)
        .single()

    if (error) {
        throw error;
    }
    
    return {
        training: data as Training,
        questions: data.questions.map((db: any) => {
            return {
                ...db,
                type: db.question_types,
                topic: db.topics
            }
        })
    }
})


// no cache

export async function addTraining({ userId, questions } : { userId: string, questions: Question[] }): Promise<Training> {

    const { data, error } = await createClient()
        .from("trainings")
        .insert({ user: userId })
        .eq("user", userId)
        .select("*")
        .single();

    if (error) {
        throw error;
    }

    if(data) {

        const trainingId = data.id;

        await createClient()
            .from("trainings_questions")
            .insert([  ...questions.map((question) => ({ training: trainingId, question: question.id })) ])
            .eq("training_id", trainingId)
            .select();
    
    }

    return data;
    
}

export async function completeTraining({ trainingId, accuracy, seconds, xp } : { trainingId: string, accuracy: number, seconds: number, xp: number }): Promise<Training> {
    const { data, error } = await createClient()
        .from("trainings")
        .update({ accuracy, seconds, xp, completed: true })
        .eq("id", trainingId)
        .select("*")
        .single();

    if (error) {
        throw error;
    }

    return data;
}