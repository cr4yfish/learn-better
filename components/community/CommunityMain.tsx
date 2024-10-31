"use server";

import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { UserCoursesProvider } from "@/hooks/SharedUserCourses";
import { Button } from "../utils/Button";

import Courses from "../course/Courses";
import CourseSearch from "../course/CourseSearch";
import Icon from "../utils/Icon";

import { getCurrentUser } from "@/utils/supabase/auth";

import { getCourses } from "@/utils/supabase/courses";

export default async function CommunityMain() {

    const session = await getCurrentUser();
    const courses = await getCourses({ from: 0, limit: 5 });

    if(!session) {
        redirect('/auth');
    }


    return (
        <UserCoursesProvider>
            <div className="flex px-4 py-6 flex-col gap-4 w-full max-w-[100vw] overflow-y-auto overflow-x-hidden max-h-screen pb-40">
                <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="font-bold text-2xl">Community</h1>
                    <Link href={`course/new/${session?.user?.id}`}>
                        <Button  color="primary" variant="flat" isIconOnly ><Icon color="primary" filled>add</Icon></Button>
                    </Link>
                </div>
                
            
                <Suspense fallback={<div>Loading Course Search......</div>}>
                    <CourseSearch sessionState={session} />
                </Suspense>

                <Suspense fallback={<div>Loading Courses......</div>}>
                    <Courses sessionState={session} courses={courses} />
                </Suspense>
            </div>
        </UserCoursesProvider>
    )
}