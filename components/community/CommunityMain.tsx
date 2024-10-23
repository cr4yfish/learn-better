import { redirect } from "next/navigation";
import Link from "next/link";


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
            <div className="flex px-4 py-6 flex-col gap-4 w-full overflow-y-auto max-h-screen pb-20">
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
    )
}