"use client";

import { useState } from "react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import CourseCard from "./CourseCard";
import { SessionState } from "@/types/auth";

export default function UserCourseOverview({ sessionState } : { sessionState: SessionState }) {
    const [courses, setCourses] = useState(sessionState.courses);

    return (
        <>
        <h2 className=" font-bold">Your courses</h2>
        <ScrollShadow className="flex flex-col gap-5 min-h-[50vh] overflow-y-auto">
            {courses?.map((userCourse) => (
                <CourseCard 
                    key={userCourse.course.id} 
                    course={userCourse.course} 
                    userCourses={sessionState?.courses} 
                    setUserCourses={setCourses}
                    userID={sessionState?.user?.id}
                />
            ))}
        </ScrollShadow>
        </>
    )
}