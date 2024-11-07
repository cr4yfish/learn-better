"use client";
import { useEffect, useState } from "react";

import { Input } from "@nextui-org/input"
import { Switch } from "@nextui-org/switch"

import { Course, Course_Category } from "@/types/db";

import Icon from "../ui/Icon";
import { Button } from "@/components/utils/Button";
import { upsertCourse } from "@/utils/supabase/courses";
import EditCourseCategory from "./EditCourseCategory";

type Props = {
    userId: string | undefined,
    course: Course
}

export default function EditCourseCard(props: Props) {
    const [newCourse, setNewCourse] = useState<Course>(props.course);
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    const updateNewCourseValue = (key: string, value: string | boolean | Course_Category) => {
        setNewCourse((prev) => {
            return {
                ...prev,
                [key]: value,
            }
        });
    }

    const saveCourse = async (courseToSave: Partial<Course>) => {
        if(!props.userId) return;

        setIsLoading(true);

        courseToSave.id = props.course.id 

        courseToSave.is_official = false;
        

        const res = await upsertCourse(courseToSave, props.userId);

        if(res.id) {
            setDone(true);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        console.log(props.course)
        if(props.course) {
            setNewCourse(props.course);
        }
    }, [props.course])

    return (
        <>
        <div className="flex flex-col pt-0 gap-4">
            <h1 className="font-bold text-4xl">{newCourse?.title}</h1>
            
            <Input 
                label="Course Title" 
                value={newCourse?.title}
                onValueChange={(value) => updateNewCourseValue("title", value)}
            />

            <Input 
                label="Course Abbreviation"
                value={newCourse?.abbreviation}
                onValueChange={(value) => updateNewCourseValue("abbreviation", value)} 
                maxLength={6} 
            />

            <Input 
                label="Course Description" 
                defaultValue={newCourse?.description}
                onValueChange={(value) => updateNewCourseValue("description", value)} 
            />
        
           <EditCourseCategory 
                category={newCourse?.category} 
                setCategory={(category) => updateNewCourseValue("category", category)} 
            />

            <Switch onValueChange={(value) => updateNewCourseValue("is_public", value ? true : false)}  >
                    Public Course
            </Switch>
            <div className="flex items-center gap-4">
            <Button
                color="primary"
                variant="flat"
                className="text-primary"
                isLoading={isLoading}
                size="lg"
                fullWidth
                startContent={<Icon filled>{done ? "check_circle" : "save"}</Icon>}
                isDisabled={done}
                onClick={() => saveCourse(newCourse)}
            >
                {done ? "Saved" : "Save"}
            </Button>
           
            <Button
                color="danger"
                size="lg"
                variant="faded"
                isDisabled
            >
                Delete Course
            </Button>
            
            </div>

        </div>
        </>
    )
}