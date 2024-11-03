"use server";

import Link from "next/link";
import { Button } from "@/components/utils/Button";

import Icon from "@/components/utils/Icon";

import LevelNewMain from "@/components/level/new/LevelNewMain";
import { getCourseById } from "@/utils/supabase/courses";
import { Course } from "@/types/db";
import { redirect } from "next/navigation";

type Props = {
    searchParams: { [key: string]: string }
}

export default async function NewLevel(props: Props) {
    const urlSearchParams = new URLSearchParams(props.searchParams);
    const courseId = urlSearchParams.get("courseId");

    if(!courseId) {
        redirect("/");
    }

    const course: Course = await getCourseById(courseId);

    return (
        <>
        <div className="flex flex-col gap-4 px-4 py-6">
            <div className="flex flex-row items-center gap-4">
                <div className=" w-fit">
                    <Link href="/">
                        <Button 
                            isIconOnly 
                            variant="light"
                        >
                            <Icon filled>arrow_back</Icon>
                        </Button>
                    </Link>
                </div>
                <h1 className=" font-bold text-2xl w-full">Add a new Level to {course.abbreviation}</h1>
            </div>

            <LevelNewMain initCourse={course} />

            
        </div>
        
        </>
    )
}