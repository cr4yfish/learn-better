"use server";

import { redirect } from "next/navigation";

import SelectFirstCourse from "@/components/auth/SelectFirstCourse"

import { getCurrentUser } from "@/utils/supabase/auth";
import { getCourses } from "@/utils/supabase/courses";
import { UserCoursesProvider } from "@/hooks/SharedUserCourses";


export default async function SelectCourse() {

    const sessionState = await getCurrentUser();

    if(!sessionState) {
        redirect("/auth");
    }

    const courses = await getCourses({ from: 0, limit: 10 });

    return (
        <>
            <h1 className="text-4xl font-bold text-center">Join a course to get started</h1>
            <UserCoursesProvider>
                <SelectFirstCourse sessionState={sessionState} initCourses={courses} />
            </UserCoursesProvider>
        </>
    )
}