
"use client";

import { useState } from "react";

import { Input } from "@nextui-org/input";
import { Button } from "@/components/utils/Button";

import Icon from "@/components/ui/Icon";
import { Course, Course_Section, Topic } from "@/types/db";
import CourseSectionSelect from "@/components/courseSection/CourseSectionAutocomplete";
import { upsertCourseTopic } from "@/utils/supabase/topics";
import Link from "next/link";

type Props = {
    initCourse: Course
}

export default function LevelNewMain(props: Props) {

    // Handles the step of the form
    const [isLoading, setIsLoading] = useState(false);
    const [newTopic, setNewTopic] = useState<Topic>({
        id: "",
        course: props.initCourse || {} as Course,
        course_section: {} as Course_Section,
        title: "",
        description: "",
    });

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

        <div className="flex flex-col gap-2">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2" >
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-lg" >Which course does the level belong to?</h2>
                    <div className="flex items-center gap-1">
                        <CourseSectionSelect 
                            course={newTopic.course} 
                            setCourseSection={(courseSection) => handleUpdateTopicField("course_section", courseSection)} 
                        />
                        <Link href={`/course/edit/${props.initCourse.id}`}>
                            <Button isIconOnly variant="light" size="lg" color="warning"><Icon>add</Icon></Button>
                        </Link>
                        
                    </div>
               
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

            
        
        </>
    )
}