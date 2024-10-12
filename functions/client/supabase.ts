
import { createClient, User } from "@supabase/supabase-js";

import { Course, Profile, Question, Rank, Settings, Topic, User_Course, User_Question, User_Topic } from "@/types/db";
import { SessionState } from "@/types/auth";

function getClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}

export async function getSession() {
    return await getClient().auth.getSession();
}

export async function isLoggedIn() {
    return await getClient().auth.getSession() !== null;
}

export async function userPasswordLogin(email: string, password: string) {
    return await getClient().auth.signInWithPassword({ email, password });
}

export async function userLogOut() {
    return await getClient().auth.signOut();
}

export async function userLogin(email: string, password: string): Promise<{ success: boolean, user: User }> {
    const { data, error } = await getClient().auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) { throw error; }

    return { 
        success: true, 
        user: data.user as User
    };

}

/**
 * Sign up user and creates a profile
 * @param email 
 * @param password 
 * @returns 
 */
export async function userSignUp(email: string, password: string, username: string, avatar?: string) {
    const signUpResult = await getClient().auth.signUp({ email: email, password: password });
    if(signUpResult.error) {
        throw signUpResult.error;
    } else {

        // get lowest rank id -> sort by xp_threshold
        const { data: ranks, error: gettingRankError } = await getClient().from("ranks").select("*").order("xp_threshold", { ascending: true }).limit(1);

        if(gettingRankError) {
            throw gettingRankError;
        }

        const dbResult = await getClient().from("profiles").insert([
            { 
                id: signUpResult.data.user?.id, 
                email: signUpResult.data.user?.email,
                username: username,
                avatar: avatar ?? null, // this can be null
                total_xp: 0, // no xp
                rank: ranks[0].id // lowest rank

            }]).select();
        if(dbResult.error) {
            throw dbResult.error;
        } else {
            return { profile: dbResult.data, signUp: signUpResult};
        }
    }
}

export async function getRanks(): Promise<Rank[]> {
    const { data, error } = await getClient().from("ranks").select();
    if(error) { throw error; }
    return data;
}

export async function getProfile(id: string): Promise<Profile> {
    const { data, error } = await getClient().from("profiles").select().eq("id", id);
    if(error) { throw error; }
    return data[0];
}

export async function getSettings(userID: string): Promise<Settings> {
    const { data, error } = await getClient().from("settings").select(`
        created_at,
        updated_at,
        theme,
        color,
        courses (*)    
    `).eq("user", userID);
    if(error) { throw error; }

    // oh god
    let tmp: any = data[0] as any;

    return {
        ...tmp,
        current_course: tmp.courses as Course
    };
}

export async function getUserCourses(userID: string): Promise<User_Course[]> {
    const { data, error } = await getClient().from("users_courses").select(`
        courses (*),
        joined_at,
        is_admin,
        is_moderator,
        is_collaborator
    `).eq("user", userID);
    if(error) { throw error; }
    
    return data.map((db: any) => {
        return {
            course: db.courses as Course,
            joined_at: db.joined_at,
            is_admin: db.is_admin,
            is_moderator: db.is_moderator,
            is_collaborator: db.is_collaborator
        }
    });
}

export async function getCurrentUser(): Promise<SessionState | null> {
    const session = await getSession();

    if(!session.data.session) {
        return null;
    }

    const profile = await getProfile(session.data.session?.user.id as string);
    const settings = await getSettings(session.data.session?.user.id as string);
    const courses = await getUserCourses(session.data.session?.user.id as string);

    return {
        session: session.data.session,
        user: session.data.session?.user,
        profile: profile,
        isLoggedIn: true,
        pendingAuth: false,
        settings: settings,
        courses: courses
    }
}

export async function getCourses() {
    const { data, error } = await getClient().from("courses").select();
    if(error) { throw error; }
    return data;
}

export async function getCourseTopics(courseId: string, from: number, limit: number): Promise<Topic[]> {
    const { data, error } = await getClient().from("topics").select(`
        id,
        created_at,
        title,
        description,
        course,
        users_topics (
            completed
        )
    `)
    .eq("course", courseId)
    .range(from, from + limit -1);
    if(error) { throw error; }

    return (data.map((db: any) => {
        return {
            id: db.id,
            created_at: db.created_at,
            title: db.title,
            description: db.description,
            course: db.course,
            completed: db.users_topics[0]?.completed ?? false
        }
    }).sort((a: Topic, b: Topic) => {
        return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    }))
}

/**
 * 
 * @param topic uuid of topic
 * @returns 
 */
export async function getQuestions(topicId: string): Promise<Question[]> {
    const { data, error } = await getClient().from("questions")
    .select(`
        id,
        created_at,
        title,
        question,
        answer_correct,
        answer_options,
        question_types (id, title, description),
        topics (id, title, description, course)
    `).eq("topic", topicId);
    if(error) { throw error; }


    // cast db to any since there is a mismatch in the foreign key fields
    return data.map((db: any) => {
        return {
            id: db.id,
            created_at: db.created_at,
            title: db.title,
            question: db.question,
            answer_correct: db.answer_correct,
            answer_options: db.answer_options,
            type: db.question_types, // what the fuck? Why is this not returning as an array?
            topic: db.topics // this as well
        }
    });
}

export async function getQuestionTypes() {
    const { data, error } = await getClient().from("question_types").select();
    if(error) { throw error; }
    return data;
}

export async function getQuestionType(id: string) {
    const { data, error } = await getClient().from("question_types").select().eq("id", id);
    if(error) { throw error; }
    return data[0];
}

export async function getUserQuestions(userId: string) {
    const { data, error } = await getClient().from("users_questions").select().eq("user", userId);
    if(error) { throw error; }
    return data;
}

export async function addUserQuestion(userQuestion: User_Question): Promise<User_Question[]> {
    const { data, error } = await getClient().from("users_questions").upsert([userQuestion]).select();
    if(error) { throw error; }
    return data;
}

export async function getUsersTopics(): Promise<User_Topic[]> {
    const { data, error } = await getClient().from("users_topics").select(`
        users (id, email, username),
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
            user: db.users as User,
            topic: db.topics as Topic,
            completed: db.completed as boolean,
        }
    })
}

export async function addUsersTopics({ userID, topicID, completed } : { userID: string, topicID: string, completed: boolean }): Promise<User_Topic> {
    const { data, error } = await getClient().from("users_topics").insert([{
        user: userID,
        topic: topicID,
        completed: completed
    }]).select();
    if(error) { throw error; }
    return data[0];
}