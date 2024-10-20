"use client";

import Link from "next/link";
import { useState } from "react";

import { Input } from "@nextui-org/input";
import { Button } from "@/components/utils/Button";

import Icon from "@/components/utils/Icon";
import CourseAutocomplete from "@/components/course/CourseAutocomplete";
import { Course, Course_Section, Topic } from "@/types/db";
import CourseSectionSelect from "@/components/courseSection/CourseSectionAutocomplete";
import { upsertCourseTopic } from "@/functions/supabase/topics";


export default function NewLevel() {

    // Handles the step of the form
    const [isLoading, setIsLoading] = useState(false);
    const [newTopic, setNewTopic] = useState<Topic>({} as Topic);

    // updates any field in the newTopic object
    const handleUpdateTopicField = (field: string, value: string | Course | Course_Section) => {
        setNewTopic((prev) => {
            return {
                ...prev,
                [field]: value
            }
        })
    }

    const checkValid = () => {
        if(!newTopic.course || !newTopic.title || !newTopic.description) {
            return false;
        }

        return true;
    }

    // Adds a new topic to the database
    const handleAddTopic = async () => {
        if(!checkValid()) return;

        setIsLoading(true);

        try {
            const res = await upsertCourseTopic(newTopic);

            // add id from db to newTopic
            setNewTopic((prev) => {
                return {
                    ...prev,
                    id: res.id
                }
            });

            // redirect to the edit page
            window.location.href = `/level/edit/${res.id}`;

        } catch(err) {
            console.error(err);
        }
        setIsLoading(false);
    }

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
                <h1 className=" font-bold text-4xl w-full">Add a new Level</h1>
            </div>

            <div className="flex flex-col gap-2">
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2" >
                    <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-lg" >Which course does the level belong to?</h2>
                        <CourseAutocomplete setCourse={(course) => handleUpdateTopicField("course", course)} />
                        <CourseSectionSelect 
                            course={newTopic.course} 
                            setCourseSection={(courseSection) => handleUpdateTopicField("course_section", courseSection)} 
                        />
                        <h2 className="font-bold text-lg" >What is the level about?</h2>
                        <Input 
                            label="Title" 
                            isRequired
                            placeholder="Enter the title of the level" 
                            onChange={(e) => handleUpdateTopicField("title", e.target.value)}
                        />

                        <Input 
                            label="Description"
                            isRequired 
                            placeholder="Enter a brief description of the level" 
                            onChange={(e) => handleUpdateTopicField("description", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row gap-2">
                        <Button 
                            endContent={<Icon filled>arrow_right_alt</Icon>} 
                            type="submit" 
                            onClick={handleAddTopic} 
                            isLoading={isLoading}
                            variant="shadow"
                            color="primary" 
                            isDisabled={!checkValid()}
                            fullWidth
                        >
                            Save and add questions
                        </Button>
                    </div>
                </form>
            </div>

            
        </div>
        
        </>
    )
}