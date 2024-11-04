"use server";

import CoursesShowcaseSwiper from "./CoursesShowcaseSwiper";

import { SessionState } from "@/types/auth";
import UserCourseOverview from "./UserCourseOverview";
import { Separator } from "@/components/ui/separator";

import { getCourses } from "@/utils/supabase/courses";

export default async function Courses({ sessionState } : { sessionState: SessionState }) {

    const newestCourses = await getCourses({ from: 0, limit: 5, orderBy: 'created_at', isAscending: false });
    const popularCourses = await getCourses({ from: 0, limit: 5, orderBy: 'course_votes_count', isAscending: false });

    return (
        <>
        <div className="flex flex-col gap-4 max-h-screen overflow-visible pb-20">

            <div className="flex flex-col gap-8">
                <CoursesShowcaseSwiper courses={popularCourses} session={sessionState} label="Popular Courses" />
                <CoursesShowcaseSwiper courses={newestCourses} session={sessionState} label="Newest Courses" />
            </div>

            <Separator className="mt-4 opacity-25 " />
            <UserCourseOverview  sessionState={sessionState}  />
           
        </div>
        </>
    )
}