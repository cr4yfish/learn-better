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
        <div className="flex flex-col gap-2 mb-4 mt-8">
            <h1 className="text-3xl font-bold">Join a course to get started</h1>
            <p className=" text-tiny">Just choose anything if there are none that interest you. Creating new ones directly will be available soon here.</p>
        </div>

            <UserCoursesProvider>
                <SelectFirstCourse sessionState={sessionState} initCourses={courses} joinedCourses={sessionState.courses} />
            </UserCoursesProvider>
        </>
    )
}