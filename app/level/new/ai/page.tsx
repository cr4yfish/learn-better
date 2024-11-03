"use server";

import Link from "next/link";
import { redirect } from "next/navigation";


import { getCurrentUser } from "@/utils/supabase/auth";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/utils/Icon";
import LevelNewAIMain from "@/components/level/new/ai/LevelNewAIMain";
import { getCourseById } from "@/utils/supabase/courses";

type Props = {
    searchParams: { [key: string]: string }
}


export default async function CreateLevelWithAI(props: Props) {
    const urlSearchParams = new URLSearchParams(props.searchParams);
    const courseId = urlSearchParams.get("courseId");

    if(!courseId) {
        redirect("/");
    }

    const course = await getCourseById(courseId);

    const session = await getCurrentUser();

    if(!session) {
        redirect("/auth");
    }

    return (
        <>
        <div className="relative flex flex-col px-4 py-6 gap-2 max-h-screen overflow-hidden">
            <div className="w-full flex items-start">
                <Link href={"/"}><Button startContent={<Icon filled>arrow_back</Icon>} variant="light">Back</Button></Link>
            </div>

 
            <LevelNewAIMain sessionState={session} course={course} />

        </div>
        </>
    )
}