"use server";

import CoursesShowcaseSwiper from "./CoursesShowcaseSwiper";

import { Course } from "@/types/db";
import { SessionState } from "@/types/auth";
import UserCourseOverview from "./UserCourseOverview";
import { Separator } from "@/components/ui/separator";



export default async function Courses({ sessionState, courses } : { sessionState: SessionState, courses: Course[] }) {

    return (
        <>
        <div className="flex flex-col gap-4 max-h-screen overflow-visible pb-20">

            <CoursesShowcaseSwiper courses={courses} session={sessionState} />
            <Separator className="mt-4 opacity-25 " />
            <UserCourseOverview  sessionState={sessionState}  />
           
        </div>
        </>
    )
}