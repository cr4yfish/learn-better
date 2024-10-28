"use server";

import CoursesShowcaseSwiper from "./CoursesShowcaseSwiper";

import { Course } from "@/types/db";
import { SessionState } from "@/types/auth";
import UserCourseOverview from "./UserCourseOverview";



export default async function Courses({ sessionState, courses } : { sessionState: SessionState, courses: Course[] }) {

    return (
        <>
        <div className="flex px-4 py-6 flex-col gap-4 max-h-screen overflow-visible">
            <h1 className="font-bold">Courses</h1>

            <CoursesShowcaseSwiper courses={courses} session={sessionState} />

            <UserCourseOverview  sessionState={sessionState}  />
           
        </div>
        </>
    )
}