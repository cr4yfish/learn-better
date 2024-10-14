import { User } from "@supabase/supabase-js";

export type Profile = {
    id: string;
    username: string;
    avatar?: string,
    avatarLink?: string,
    banner?: string,
    bannerLink?: string,
    total_xp: number;
    rank: string;
}

// unused right now
export type Object = {
    id: string;
    bucket_id: Bucket;
    name: string;
    owner?: User;
    created_at?: string; // timestampz
    updated_at?: string; // timestampz
    last_accessed_at?: string; // timestampz
    metadata: JSON;
    path_tokens: string[];
    version: string;
    owner_id?: string;
    user_metadata?: JSON;
}

export type Bucket = {
    id: string;
    name: string;
    Owner?: User;
    created_at?: string; // timestampz
    updated_at?: string; // timestampz
    public: boolean;
    avif_autodetection: boolean;
    file_size_limit: number;
    allowed_mime_types: string[];
    owner_id?: string;
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
    creator: User;
    is_official: boolean;
    is_public?: boolean;
    institution?: Institution;
}

export type Institution = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    abbreviation: string;
    description: string;
    creator: User;
    avatar?: string;
    banner?: string;
}

export type Community = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    description: string;
    avatar?: string;
    banner?: string;
    is_official: boolean;
    is_verified: boolean;
    institution?: Institution;
    creator: User;
}

export type Question_Type = {
    id: string;
    created_at?: string; // timestampz
    title: "Multiple Choice" | "Single Choice" | "Boolean" | "Fill in the Blank";
    description: string;
}

export type Settings = {
    user?: User; // primary key
    created_at?: string; // timestampz
    updated_at?: string; // timestampz
    theme: string;
    color: string;
    current_course: Course;
}

export type User_Question = {
    user: string;
    question: string;
    created_at?: string; // timestampz
    last_tried_at?: string; // timestampz
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

export type User_Community = {
    user: User;
    community: Community;
    joined_at: string; // timestampz
    is_admin: boolean;
    is_moderator: boolean;
}

export type User_Institution = {
    user: User;
    institution: Institution;
    joined_at: string; // timestampz
    is_admin: boolean;
    is_moderator: boolean;
}

export type User_Course = {
    user?: User;
    course: Course;
    joined_at: string; // timestampz
    is_admin: boolean;
    is_moderator: boolean;
    is_collaborator: boolean;
}