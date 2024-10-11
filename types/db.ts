import { User } from "@supabase/supabase-js";

export type Profile = {
    id: string;
    username: string;
    avatar?: string,
    total_xp: number;
    rank: string;
}

export type Rank = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    description: string;
    xp_threshold: number;
}

export type Streak = {
    id: string;
    created_at?: string; // timestampz
    user: User;
    from: Date;
    to?: Date;
}

export type Question = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    question: string;
    answer_correct: string;
    answer_options: string[];
    type: Question_Type;
    topic: Topic;
}

export type Topic = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    description: string;
    course: Course;
    completed: boolean;
}

export type Course = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    abbreviation: string;
    description: string;
}

export type Question_Type = {
    id: string;
    created_at?: string; // timestampz
    title: "Mutltiple Choice" | "Single Choice" | "Boolean" | "Fill in the Blank";
    description: string;
}

export type User_Question = {
    user: string;
    question: string;
    created_at?: string; // timestampz
    completed: boolean;
    tries?: number;
    seconds?: number;
    xp?: number;
    accuracy?: number;
}

export type UserQuestionClient = {
    user: User,
    question: Question,
    created_at?: string; // timestampz
    completed: boolean;
    tries?: number;
    seconds?: number;
    xp?: number;
    accuracy?: number;
    selected: boolean;
}

export type User_Topic = {
    user: User;
    topic: Topic;
    completed: boolean;
}