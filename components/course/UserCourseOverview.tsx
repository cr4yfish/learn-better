"use client";


import { ScrollShadow } from "@nextui-org/scroll-shadow";

import CourseCard from "./CourseCard";
import { SessionState } from "@/types/auth";

import { useUserCourses } from "@/hooks/SharedUserCourses";
import { useEffect } from "react";

export default function UserCourseOverview({ sessionState } : { sessionState: SessionState }) {

    const { userCourses, setUserCourses } = useUserCourses();

    useEffect(() => {
        setUserCourses(sessionState.courses);
    }, [sessionState, setUserCourses])
    
    return (
        <>
        <h2 className=" font-bold">Your courses</h2>
        <ScrollShadow className="flex flex-col gap-5 min-h-[50vh] overflow-y-auto">
            {userCourses?.map((userCourse) => (
                <CourseCard 
                    key={userCourse.course.id} 
                    course={userCourse.course} 
                    userID={sessionState?.user?.id}
                />
            ))}
        </ScrollShadow>
        </>
    )
}