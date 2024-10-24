"use server";

import CourseSearch from "@/components/course/CourseSearch";
import { getCurrentUser } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";

export default async function SelectCourse() {

    const sessionState = await getCurrentUser();

    if(!sessionState) {
        redirect("/auth");
    }

    return (
        <>
            <h1 className="text-4xl font-bold text-center">Join a course to get started</h1>
            <CourseSearch 
                sessionState={sessionState}
            />
            
        </>
    )
}