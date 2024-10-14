"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { Course } from "@/types/db";
import Icon from "@/components/Icon";
import { joinCourse, upsertCourse } from "@/functions/client/supabase";


export default function NewCourse({ params: { userId }} : { params: { userId: string }}) {
    const [newCourse, setNewCourse] = useState<Course>({} as Course);
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        console.log(newCourse);
    }, [newCourse])

    const updateNewCourseValue = (key: string, value: string) => {
        setNewCourse((prev) => {
            return {
                ...prev,
                [key]: value,
            }
        });
    }

    const saveCourse = async (course: Course) => {
        setIsLoading(true);
        console.log("save course");

        course.id = uuidv4();
        course.creator = {
            id: userId,
            // thse arent used, so whatever
            app_metadata: {},
            user_metadata: {},
            created_at: new Date().toISOString(),
            aud: ""
        };
        course.is_official = false;

        const res = await upsertCourse(course);

        console.log(res);

        if(res.id) {

            // subscribe to the course
            const dbRes = await joinCourse(res.id, userId, {
                is_admin: true,
                is_moderator: true,
                is_collaborator: true,
            });

            if(dbRes) {
                setDone(true);
            }
        }

        setIsLoading(false);
    }

    if(!userId) {
        return (
            <>
            <div>
                <h1 className="font-bold text-4xl text-red-500">You have to provide a user id!</h1>
            </div>
            </>
        )
    }

    return (
    <div className="flex flex-col px-4 py-6 gap-4">
        <h1 className="font-bold text-4xl">New Course</h1>
        <Input label="Course Title" onValueChange={(value) => updateNewCourseValue("title", value)} />
        <Input label="Course Abbreviation" onValueChange={(value) => updateNewCourseValue("abbreviation", value)} maxLength={6} />
        <Input label="Course Description" onValueChange={(value) => updateNewCourseValue("description", value)} />
        <Button
            color="primary"
            variant="shadow"
            isLoading={isLoading}
            startContent={<Icon filled>{done ? "check_circle" : "add"}</Icon>}
            isDisabled={done}
            onClick={() => saveCourse(newCourse)}
        >
            {done ? "Created" : "Create"}
        </Button>
    </div>
  );
}