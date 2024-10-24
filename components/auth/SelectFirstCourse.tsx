"use client";

import { useEffect } from "react";


import CourseSearch from "@/components/course/CourseSearch";
import CoursesShowcaseSwiper from "@/components/course/CoursesShowcaseSwiper";

import { SessionState } from "@/types/auth";
import { Course } from "@/types/db";
import { redirect } from "next/navigation";
import { useUserCourses } from "@/hooks/SharedUserCourses";


export default function SelectFirstCourse({ sessionState, initCourses } : { sessionState: SessionState, initCourses: Course[] }) {
    const { userCourses } = useUserCourses();

    useEffect(() => {
        if(userCourses.length > 0) {
            redirect("/");
        }
    }, [userCourses]);

    return (
        <>
        <CourseSearch sessionState={sessionState} />
        <div className="flex flex-col gap-4 w-full">
            <CoursesShowcaseSwiper session={sessionState} courses={initCourses} />
        </div>
        </>
    )

}