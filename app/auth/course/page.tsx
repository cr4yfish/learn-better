"use server";

import { redirect } from "next/navigation";

import SelectFirstCourse from "@/components/auth/SelectFirstCourse"

import { getCurrentUser } from "@/utils/supabase/auth";
import { getCourses } from "@/utils/supabase/courses";
import { UserCoursesProvider } from "@/context/SharedUserCourses";


export default async function SelectCourse() {

    const sessionState = await getCurrentUser();

    if(!sessionState) {
        redirect("/auth");
    }

    const courses = await getCourses({ from: 0, limit: 10, orderBy: "course_votes_count", isAscending: false });

    return (
        <>
        <div className="flex flex-col gap-2 mb-4 mt-8">
            <h1 className="text-3xl font-bold">Join a course to get started</h1>
            <p className=" text-tiny">You can join or create more Courses later</p>
        </div>

            <UserCoursesProvider>
                <SelectFirstCourse 
                    sessionState={sessionState} 
                    initCourses={courses} 
                    joinedCourses={sessionState.courses} 
                />
            </UserCoursesProvider>
        </>
    )
}