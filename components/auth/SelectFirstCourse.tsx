"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

import CourseSearch from "@/components/course/CourseSearch";
import CoursesShowcaseSwiper from "@/components/course/CoursesShowcaseSwiper";

import { SessionState } from "@/types/auth";
import { Course, User_Course } from "@/types/db";

import { useUserCourses } from "@/hooks/SharedUserCourses";
import { upsertSettings } from "@/utils/supabase/settings";


export default function SelectFirstCourse({ sessionState, initCourses, joinedCourses } : { sessionState: SessionState, initCourses: Course[], joinedCourses: User_Course[] }) {
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
        if(userCourses.length > 0 || joinedCourses.length > 0) {
            // save to settings and redirect user
            addCourseToSettings(sessionState.user!.id, userCourses[0]?.course?.id || joinedCourses[0]?.course?.id).then(() => {
                window.location.href = "/";
            })
        }
    }, [userCourses, sessionState, joinedCourses]);

    return (
        <>
        <CourseSearch sessionState={sessionState} />
        <div className="flex flex-col gap-4 w-full">
            <CoursesShowcaseSwiper session={sessionState} courses={initCourses} />
        </div>
        </>
    )

}