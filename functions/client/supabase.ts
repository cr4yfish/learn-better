
import { AuthResponse, createClient, User } from "@supabase/supabase-js";
import { FileObject } from "@supabase/storage-js";

import { Course, Course_Section, Profile, Question, Rank, Settings, Streak, Topic, User_Course, User_Question, User_Topic } from "@/types/db";
import { SessionState } from "@/types/auth";
import { getDayBefore, isSameDay } from "../helpers";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function getClient() {
    return client;
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
export async function userSignUp(email: string, password: string, username: string, avatar?: string) : Promise<{ profile: Profile, authResponse: AuthResponse, settings: Settings }> {
    const authResponse = await getClient().auth.signUp({ email: email, password: password, options: {
        data: { username: username },

    } });
    if(authResponse.error) {
        throw authResponse.error;
    } else {

        // get lowest rank id -> sort by xp_threshold
        const { data: ranks, error: gettingRankError } = await getClient().from("ranks").select("*").order("xp_threshold", { ascending: true }).limit(1);

        if(gettingRankError) {
            throw gettingRankError;
        }

        const dbResult = await getClient().from("profiles").insert([
            { 
                id: authResponse.data.user?.id,
                username: username,
                avatar: avatar ?? null, // this can be null
                total_xp: 0, // no xp
                rank: ranks[0].id // lowest rank

            }]).select().single();

        const settingsResult = await getClient().from("settings").insert([
            {
                user: authResponse.data.user?.id,
                theme: "light",
                color: "blue",
            }

        ]).select().single();
        
        if(dbResult.error) {
            throw dbResult.error;
        } else {
            return { 
                profile: dbResult.data as Profile, 
                authResponse: authResponse,
                settings: settingsResult.data as Settings
            };
        }
    }
}

export async function getRanks(): Promise<Rank[]> {
    const { data, error } = await getClient().from("ranks").select();
    if(error) { throw error; }
    return data;
}

export async function getProfile(id: string): Promise<Profile> {
    const { data, error } = await getClient().from("profiles").select(`
        id,
        username,
        avatar,
        total_xp,
        ranks (
            id,
            title,
            description,
            xp_threshold
        ),
        banner
    `).eq("id", id).single();
    if(error) { throw error; }

    const profile = {
        id: data.id,
        username: data.username,
        avatar: data.avatar,
        total_xp: data.total_xp,
        rank: data.ranks as any,
        banner: data.banner,
        avatarLink: "",
        bannerLink: ""
    }

    // get links
    try {
        if(profile.avatar) profile.avatarLink = await getObjectPublicURL({ id: profile.avatar, bucket: "avatars" });
        if(profile.banner) profile.bannerLink = await getObjectPublicURL({ id: profile.banner, bucket: "banners" });   
    } catch (error) {
        console.error("Error getting profile links:", error);
    }
    return profile;
}

export async function upsertProfile(profile: Profile): Promise<{ id: string }> {

    delete profile.avatarLink;
    delete profile.bannerLink;

    profile.rank = profile.rank.id as any;

    const { data, error } = await getClient().from("profiles").upsert([profile]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function getProfiles(): Promise<Profile[]> {
    const { data, error } = await getClient().from("profiles").select().order("total_xp", { ascending: false });
    if(error) { throw error; }
    return data;
}

export async function getCurrentUserRank(): Promise<Rank> {
    const session = await getSession();
    if(!session.data.session) {
        throw new Error("No session found");
    }

    const profile = await getProfile(session.data.session.user.id as string);
    return profile.rank as Rank;
}

export async function getProfilesInRank(rankID?: string): Promise<Profile[]> {
    let localRankID = rankID;
    if(!localRankID) {
        localRankID = (await getCurrentUserRank()).id;
    }

    const { data, error } = await getClient().from("profiles").select().eq("rank", localRankID).order("total_xp", { ascending: false });
    if(error) { throw error; }
    return data;
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
    const tmp = data[0] as any;

    return {
        ...tmp,
        current_course: tmp?.courses as Course
    };
}

export async function updateCurrentCourse(userID: string, courseID: string): Promise<{ id: string }> {
    const { data, error } = await getClient().from("settings").update({ current_course: courseID }).eq("user", userID).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

export async function upsertSettings(settings: Settings): Promise<{ id: string }> {
    if(!settings.user?.id) {
        throw new Error("No user ID provided");
    }
    delete (settings as any).courses;
    const { data, error } = await getClient().from("settings").upsert([{
        ...settings,
        current_course: settings.current_course?.id,
        user: settings.user.id
    }]).select().single();
    if(error) { throw error; }
    return { id: data.id };
}

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

export async function getCurrentUser(): Promise<SessionState | null> {
    try {
        const session = await getSession();

        if(!session.data.session) {
            return null;
        }

        const profile = await getProfile(session.data.session?.user.id as string);
        const settings = await getSettings(session.data.session?.user.id as string);
        const courses = await getUserCourses(session.data.session?.user.id as string);
        const currentStreak = await getCurrentStreak(session.data.session?.user.id as string, new Date());
        let currentStreakDays = 0;

        if(currentStreak) {
            const from = new Date(currentStreak.from);
            const to = currentStreak.to ? new Date(currentStreak.to) : new Date(); // if to is null, use today -> streak is ongoing
            const diff = Math.abs(to.getTime() - from.getTime()) + 1;
            currentStreakDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        }

        return {
            session: session.data.session,
            user: session.data.session?.user,
            profile: profile,
            isLoggedIn: true,
            pendingAuth: false,
            settings: settings,
            courses: courses,
            currentStreak: currentStreak ?? undefined,
            currentStreakDays: currentStreakDays
        }
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
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

export async function getCourseTopics(courseId: string, from: number, limit: number): Promise<Topic[]> {
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
            completed
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
            completed: db.users_topics[0]?.completed ?? false
        }
    }))

    // Sort topics by course_section order
    topics.sort((a, b) => {
        return a.course_section.order - b.course_section.order;
    });
    
    return topics;
}

export async function getCourseSectionTopics(courseSectionID: string): Promise<Topic[]> {
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
        course_section
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
                id: db.course_section.id,
                title: "",
                description: "",
                course: db.courses.id
            }
        }
    });
}

export async function getTopic(topicId: string): Promise<Topic> {
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
        order: data.order
    }
}


export async function upsertCourseTopic(topic: Topic): Promise<{ id: string }> {
    const { data, error } = await getClient().from("topics").upsert([{
        ...topic,
        course: topic.course.id,
    }]).select();

    if(error) { throw error; }
    return { id: data[0].id };
}

export async function deleteCourseTopic(topic: Topic): Promise<{ success: boolean }> {
    const { error } = await getClient().from("topics").delete().eq("id", topic.id);
    if(error) { throw error; }
    return { success: true };
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

export async function upsertQuestion(question: Question): Promise<{ id: string }> {

    const dbEntry = {
        id: question.id,
        title: question.title,
        question: question.question,
        answer_correct: question.answer_correct,
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
}

export async function getUserTopic(userId: string, topicId: string): Promise<User_Topic> {
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
}

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

export async function updateTotalXP(userID: string, xp: number): Promise<Profile> {
    const { data, error } = await getClient().from("profiles").update({ total_xp: xp }).eq("id", userID).select();
    if(error) { throw error; }
    return data[0];
}

export async function getStreaks(userID: string) {
    const { data, error } = await getClient().from("streaks").select().eq("user", userID);
    if(error) { throw error; }
    return data;
}

/**
 * Returns the current streak of the user, if there is one
 * @param userID 
 * @param date 
 */
export async function getCurrentStreak(userID: string, date: Date): Promise<Streak | null> {
    const { data, error } = await getClient()
        .from("streaks")
        .select()
        .eq("user", userID)
        .gte("to", getDayBefore(date).toISOString()) // to >= yesterday <- gets hanging or current streak
    if(error) { 
        if(error.details == "The result contains 0 rows") {
            return null;
        }
        throw error; 
    }
    return data[0] as Streak;

}
/**
 * Either extends a current streak or adds a new one, depending on the dates
 * @param userID 
 * @param from 
 * @param to 
 */
export async function extendOrAddStreak(userID: string, today: Date): Promise<{ streak: Streak, isExtended: boolean, isAdded: boolean }> {
    const { data, error } = await getClient().from("streaks").select().eq("user", userID).order("from", { ascending: false }).limit(1);
    if(error) { throw error; }

    if(data.length === 0) {
        // no streaks, add a new one
        const { data: db, error: addError } = await getClient().from("streaks").insert([
            {
                user: userID,
                from: today,
                to: today
            }
        ]).select();
        if(addError) { throw addError; }
        return { streak: db[0], isExtended: false, isAdded: true };
    } else {
        // check if the streak can be extended
        const lastStreak = data[0] as any as Streak;
        const lastStreakTo = new Date(lastStreak.to as string & undefined);

        // streak is ongoing, dont do anything
        if(isSameDay(lastStreakTo, today)) {
            return { streak: lastStreak, isExtended: false, isAdded: false };
        }

        if(isSameDay(lastStreakTo, getDayBefore(today))) {
            // extend the streak
            const { data: db, error: extendError } = await getClient().from("streaks").update({ to: today }).eq("id", lastStreak.id).select();
            if(extendError) { throw extendError; }
            return { streak: db[0], isExtended: true, isAdded: false };
        } else {
            // add a new streak
            const { data: db, error: addError } = await getClient().from("streaks").insert([
                {
                    user: userID,
                    from: today,
                    to: today
                }
            ]).select();
            if(addError) { throw addError; }
            return { streak: db[0], isExtended: false, isAdded: true };
        }
    }
}

export async function getNextRank(currentRank: Rank): Promise<Rank> {
    const { data, error } = await getClient()
        .from("ranks")
        .select()
        .gt("xp_threshold", currentRank.xp_threshold)
        .order("xp_threshold", { ascending: true })
        .limit(1)
        .single();
    if(error) { throw error; }
    return data as Rank;
}

export async function tryRankUp(userID: string, xp: number, currentRank: Rank): Promise<{ rank: Rank, rankedUp: boolean }> {
    try {
        const nextRank = await getNextRank(currentRank);
        if(xp >= nextRank.xp_threshold) {
            // rank up
            const { error } = await getClient().from("profiles").update({ rank: nextRank.id }).eq("id", userID).select();
            if(error) { throw error; }
            return { rank: nextRank, rankedUp: true };
        } else {
            return { rank: currentRank, rankedUp: false };
        }
    } catch (e) {
        console.error("Error trying to rank up:", e);
        return { rank: currentRank, rankedUp: false };
    }
}

/**
 * Download object either by providing filename and path or the full path
 * @param params 
 */
export async function downloadObject(params: { filename: string, path: string }): Promise<any>;
export async function downloadObject(params: { fullPath: string }): Promise<any>;

/**
 * Download object either by providing filename and path or the full path
 * @param params 
 * @returns 
 */
export async function downloadObject(params: { filename?: string, path?: string, fullPath?: string }): Promise<Blob> {
    let fullPath = params.fullPath;
    if (!fullPath && params.filename && params.path) {
        fullPath = params.path + params.filename;
    }
    if (!fullPath) {
        throw new Error("Invalid parameters");
    }
    const { data, error } = await getClient().storage.from("objects").download(fullPath);
    if(error) { throw error; }
    return data;
}

/**
 * Gets a signed URL for an object valid for 60 minutes
 * @param params 
 */
export async function getObjectSignedURL(params: { filename: string, path: string }): Promise<string>;
export async function getObjectSignedURL(params: { fullPath: string }): Promise<string>;

export async function getObjectSignedURL(params: { filename?: string, path?: string, fullPath?: string }): Promise<string> {
    let fullPath = params.fullPath;
    if (!fullPath && params.filename && params.path) {
        fullPath = params.path + params.filename;
    }
    if (!fullPath) {
        throw new Error("Invalid parameters");
    }
    const res = await getClient().storage.from("objects").createSignedUrl(fullPath, 60);

    if(res.error) {
        throw res.error;
    }

    return res.data.signedUrl;
}

/**
 * Wrapper for : A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function,
 *  you can construct the public URL by concatenating the bucket URL with the path to the asset. This function does not verify if the bucket is public. 
 * If a public URL is created for a bucket which is not public, you will not be able to download the asset.
 * @param params 
 */
export async function getObjectPublicURL(params: { filename: string, path: string, bucket: string }): Promise<string>;
export async function getObjectPublicURL(params: { fullPath: string, bucket: string }): Promise<string>;
export async function getObjectPublicURL(params: { id: string, bucket: string }): Promise<string>;

export async function getObjectPublicURL(params: { filename?: string, path?: string, fullPath?: string, id?: string, bucket: string }): Promise<string> {
    if(!params.bucket) {
        throw new Error("Bucket is required");
    }
    
    let fullPath = params.fullPath;
    if (!fullPath && params.filename && params.path) {
        fullPath = params.path + params.filename;
    }
    if (fullPath) {
        return (getClient().storage.from(params.bucket).getPublicUrl(fullPath).data.publicUrl);
    }
    if(params.id) {
        try {
            const fileObject = await getObjectInfoFromID(params.id, params.bucket);
            return getClient().storage.from(params.bucket).getPublicUrl(fileObject.name).data.publicUrl;
        } catch (error) {
            throw error;
        }
    }
    
    throw new Error("Invalid parameters");
}

export async function getObjectInfoFromID(id: string, bucket: string): Promise<FileObject> {
    const res = await getClient().storage.from(bucket).list();

    if(res.error) {
        throw res.error;
    }
    const fileObject = res.data.find((obj: FileObject) => obj.id === id);

    if(!fileObject) {
        throw new Error("File object not found");
    }

    return fileObject;
}