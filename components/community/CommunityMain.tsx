"use server";

import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { UserCoursesProvider } from "@/context/SharedUserCourses";
import { Button } from "../utils/Button";

import Courses from "../course/Courses";
import CourseSearch from "../course/CourseSearch";
import Icon from "../ui/Icon";

import { getCurrentUser } from "@/utils/supabase/auth";


export default async function CommunityMain() {

    const session = await getCurrentUser();

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
                
                <div className="h-[50px]">
                    <Link target="_blank" href={`https://photon.lemmy.world/c/nouv@lemmy.world`}>
                        <Button startContent={<Icon>people</Icon>} color="secondary" variant="flat">Nouv Community on Lemmy</Button>
                    </Link>
                </div>
                
            
                <Suspense fallback={<div>Loading Course Search......</div>}>
                    <CourseSearch sessionState={session} />
                </Suspense>

                <Suspense fallback={<div>Loading Courses......</div>}>
                    <Courses sessionState={session} />
                </Suspense>
            </div>
        </UserCoursesProvider>
    )
}