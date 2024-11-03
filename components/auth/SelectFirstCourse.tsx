"use client";

import { useEffect } from "react";


import CourseSearch from "@/components/course/CourseSearch";
import CoursesShowcaseSwiper from "@/components/course/CoursesShowcaseSwiper";

import { SessionState } from "@/types/auth";
import { Course } from "@/types/db";
import { redirect } from "next/navigation";
import { useUserCourses } from "@/hooks/SharedUserCourses";
import { upsertSettings } from "@/utils/supabase/settings";


export default function SelectFirstCourse({ sessionState, initCourses } : { sessionState: SessionState, initCourses: Course[] }) {
    const { userCourses } = useUserCourses();

    if(!sessionState.user?.id) {
        redirect("/auth");
    }

    const addCourseToSettings = async (userId: string, courseId: string) => {
        await upsertSettings({
            userId: userId,
            currentCourseId: courseId
        })
    }

    useEffect(() => {
        if(userCourses.length > 0) {
            // save to settings and redirect user
            addCourseToSettings(sessionState.user!.id, userCourses[0].course.id).then(() => {
                redirect("/");
            })
        }
    }, [userCourses, sessionState]);

    return (
        <>
        <CourseSearch sessionState={sessionState} />
        <div className="flex flex-col gap-4 w-full">
            <CoursesShowcaseSwiper session={sessionState} courses={initCourses} />
        </div>
        </>
    )

}