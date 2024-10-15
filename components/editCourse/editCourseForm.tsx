"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Switch } from "@nextui-org/switch"

import { upsertCourse, joinCourse } from "@/functions/client/supabase";
import { Course } from "@/types/db";
import Icon from "../Icon";

export default function EditCourseForm({ userId, isNew, course } : { userId: string, isNew: boolean, course?: Course }) {
    const [newCourse, setNewCourse] = useState<Course>(course ?? {} as Course);
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    const updateNewCourseValue = (key: string, value: string | boolean) => {
        setNewCourse((prev) => {
            return {
                ...prev,
                [key]: value,
            }
        });
    }

    const saveCourse = async (courseToSave: Course) => {
        setIsLoading(true);
        console.log("save course");

        courseToSave.id = (course && !isNew) ? course.id : uuidv4();

        courseToSave.creator = {
            id: userId,
            // thse arent used, so whatever
            app_metadata: {},
            user_metadata: {},
            created_at: new Date().toISOString(),
            aud: ""
        };

        courseToSave.is_official = (course && !isNew) ? course.is_official : false;


        console.log("upserting course", courseToSave);

        const res = await upsertCourse(courseToSave);

        console.log(res);

        if(res.id && isNew) {

            // subscribe to the course
            const dbRes = await joinCourse(res.id, userId, {
                is_admin: true,
                is_moderator: true,
                is_collaborator: true,
            });

            if(dbRes) {
                setDone(true);
            }
        } else if(res.id) {
            setDone(true);
        }

        setIsLoading(false);
    }

    return (
        <>
        <div className="flex flex-col px-4 py-6 gap-4">
            <h1 className="font-bold text-4xl">{isNew ? "New course" : course?.title}</h1>
            <Input 
                label="Course Title" 
                defaultValue={course?.title}
                onValueChange={(value) => updateNewCourseValue("title", value)}
            />
            <Input 
                label="Course Abbreviation"
                defaultValue={course?.abbreviation}
                onValueChange={(value) => updateNewCourseValue("abbreviation", value)} 
                maxLength={6} 
            />
            <Input 
                label="Course Description" 
                defaultValue={course?.description}
                onValueChange={(value) => updateNewCourseValue("description", value)} 
            />
            <Switch 
                isSelected={course?.is_public}
                onValueChange={(value) => updateNewCourseValue("is_public", value ? true : false)}
                >
                    Public Course
            </Switch>
            <Button
                color="primary"
                variant="shadow"
                isLoading={isLoading}
                startContent={<Icon filled>{done ? "check_circle" : isNew ? "add" : "save"}</Icon>}
                isDisabled={done}
                onClick={() => saveCourse(newCourse)}
            >
                {isNew ? done ? "Created" : "Create" : done ? "Saved" : "Save"}
            </Button>
        </div>
        </>
    )
}