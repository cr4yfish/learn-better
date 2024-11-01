"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { cache } from "react";

import { createClient } from "./server/server";
import { Report_Question } from "@/types/db";

export const getReportQuestionById = cache(async(id: string): Promise<Report_Question> => {
    const { data, error } = await createClient()
        .from("reports")
        .select()
        .eq("id", id)
        .single();
    if(error) { throw error; }
    return data;
})


// no cache

type ReportQuestionParams = {
    question: string;
    user: string;
    type?: string;
}

export async function reportQuestion(params: ReportQuestionParams): Promise<Report_Question> {
    const { data, error } = await createClient()
        .from("reports_questions")
        .insert(params)
        .single();

    if(error) { throw error; }
    return data;
}


type ResolveReportQuestionParams = {
    id: string;
    resolved: boolean;
    resolve_note?: string;
}

export async function resolveReportQuestion(params: ResolveReportQuestionParams): Promise<Report_Question> {
    const { data, error } = await createClient()
        .from("reports_questions")
        .update({ resolved: params.resolved, resolve_note: params.resolve_note })
        .eq("id", params.id)
        .single();
    
    if(error) { throw error; }
    return data;
}