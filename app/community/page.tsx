"use server";

import Navigation from "@/components/utils/Navigation";
import Courses from "@/components/course/Courses";
import { getCurrentUser } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";
import { getCourses } from "@/utils/supabase/courses";
import Link from "next/link";
import Icon from "@/components/utils/Icon";
import { Button } from "@/components/utils/Button";
import CourseSearch from "@/components/course/CourseSearch";

import { UserCoursesProvider } from "@/hooks/SharedUserCourses";

export default async function Community() {

    const session = await getCurrentUser();
    const courses = await getCourses({ from: 0, limit: 5 });

    if(!session) {
        redirect('/auth');
    }

    return (
        <>
        <UserCoursesProvider>
            <div className="flex px-4 py-6 flex-col gap-4 w-full">
                <h1 className="font-bold">Community</h1>
                
                <div className="flex flex-col gap-4">

                    <Link href={`course/new/${session?.user?.id}`}>
                        <Button  color="primary" startContent={<Icon color="fuchsia-950" filled>add</Icon>}>Create a course</Button>
                    </Link>

                    <CourseSearch sessionState={session} />
                </div>
    
                <Courses sessionState={session} courses={courses} />
            </div>
        </UserCoursesProvider>
        <Navigation activeTitle="Community" />
        </>
    )
}