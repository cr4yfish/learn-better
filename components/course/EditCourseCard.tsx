"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@nextui-org/input"
import { Switch } from "@nextui-org/switch"
import { Skeleton } from "@nextui-org/skeleton";

import { Course } from "@/types/db";

import Icon from "../utils/Icon";
import { Button } from "@/components/utils/Button";
import { upsertCourse, joinCourse } from "@/utils/supabase/courses";

export default function EditCourseCard({ userId, isNew, course } : { userId: string | undefined, isNew: boolean, course?: Course | undefined }) {
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
        if(!userId) return;

        setIsLoading(true);

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

        const res = await upsertCourse(courseToSave);

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

    useEffect(() => {
        if(course) {
            setNewCourse(course);
        }
    }, [course])

    return (
        <>
        <div className="flex flex-col px-4 py-6 pt-0 gap-4">
            <Skeleton isLoaded={(isNew || course) ? true : false} className="rounded-lg"><h1 className="font-bold text-4xl">{isNew ? "New course" : course?.title}</h1></Skeleton>
            
            <Skeleton isLoaded={(isNew || course) ? true : false} className="rounded-lg">
                <Input 
                    label="Course Title" 
                    value={newCourse?.title}
                    onValueChange={(value) => updateNewCourseValue("title", value)}
                />
            </Skeleton>

            <Skeleton isLoaded={(isNew || course) ? true : false} className="rounded-lg">
                <Input 
                    label="Course Abbreviation"
                    value={newCourse?.abbreviation}
                    onValueChange={(value) => updateNewCourseValue("abbreviation", value)} 
                    maxLength={6} 
                />
            </Skeleton>

            <Skeleton isLoaded={(isNew || course) ? true : false} className="rounded-lg">
                <Input 
                    label="Course Description" 
                    defaultValue={newCourse?.description}
                    onValueChange={(value) => updateNewCourseValue("description", value)} 
                />
            </Skeleton>

            <Switch 
                isSelected={course?.is_public}
                onValueChange={(value) => updateNewCourseValue("is_public", value ? true : false)}
                >
                    Public Course
            </Switch>
            <div className="flex items-center gap-4">
            <Button
                color="primary"
                variant="flat"
                className="text-primary"
                isLoading={isLoading}
                startContent={<Icon filled>{done ? "check_circle" : isNew ? "add" : "save"}</Icon>}
                isDisabled={done}
                onClick={() => saveCourse(newCourse)}
            >
                {isNew ? done ? "Created" : "Create" : done ? "Saved" : "Save"}
            </Button>
            {!isNew && 
                <Button
                    color="danger"
                    variant="faded"
                    isDisabled
                    startContent={<Icon filled>delete</Icon>}
                >
                    Delete Course
                </Button>
            }
            </div>

        </div>
        </>
    )
}