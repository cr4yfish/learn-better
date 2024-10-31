import { User } from "@supabase/supabase-js";

export type Profile = {
    id: string;
    created_at?: string;
    username: string;
    avatar?: string,
    avatarLink?: string,
    banner?: string,
    bannerLink?: string,
    total_xp: number;
    rank: Rank;
    currentStreakDays?: number;
}

export type Followed_Profile = {
    id: string;
    username: string;
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
    from: string;
    to: string;
}

export type Question = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    question: string;
    answers_correct: string[];
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
    order?: number;
    completed?: boolean; // only client side
    accuracy?: number; // only client side
    course_section: Course_Section;
}

export type Course_Section = {
    id: string;
    created_at?: string; // timestampz
    title: string;
    description: string;
    order: number;
    course: Course;
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
    votes?: number;
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
    title: "Multiple Choice" | "Boolean" | "Fill in the Blank";
    description: string;
}

export type Settings = {
    user?: User; // primary key
    created_at?: string; // timestampz
    updated_at?: string; // timestampz
    theme: string;
    theme_is_dark: boolean;
    color: string;
    current_course: Course;
    gemini_api_key?: string;
}

export type User_Question = {
    try_id: string;
    user: string;
    question: string;
    created_at?: string; // timestampz
    last_tried_at?: string; // timestampz
    completed: boolean;
    seconds?: number;
    xp?: number;
    accuracy?: number;
}

/**
 * Read only!
 */
export type Weak_User_Questions = {
    user?: User;
    question: Question;
    try_count: number;
    avg_seconds: number;
    avg_accuracy: number;
    score: number;
}

/**
 * Read only!
 */
export type User_XP = {
    user?: User;
    xp: number;
    created_date: string;
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
    user?: User;
    topic: Topic;
    completed: boolean;
    seconds: number;
    accuracy: number;
    xp: number;
}

export type User_Community = {
    user?: User;
    community: Community;
    joined_at: string; // timestampz
    is_admin: boolean;
    is_moderator: boolean;
}

export type User_Institution = {
    user?: User;
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
    upvote?: boolean;
}

export type Course_Vote = {
    user: User;
    course: Course;
    vote: boolean;
}

export type Topic_Vote = {
    user: User;
    topic: Topic;
    vote: boolean;
}

export type User_Follow = {
    user: string;
    other_user: string;
    follows: boolean;
    block: boolean;
    friends: boolean;
}

export type Training = {
    id: string;
    created_at?: string;
    user?: User;
    completed: boolean;
    accuracy: number | null;
    seconds: number | null;
    xp: number | null;
}

export type Training_Question = {
    training: Training;
    question: Question;
    created_at?: string;
}

export type Weekly_Goal = {
    id: string;
    created_at?: string;
    user?: User;
    goal: number;
}

export type Battle = {
    id: string;
    created_at?: string;
    end_date: string;
    user_initiator: Profile;
    other_user: Profile;
    xp_goal: number;
    completed: boolean;
    user_init_start_xp: number;
    user_other_start_xp: number;
}