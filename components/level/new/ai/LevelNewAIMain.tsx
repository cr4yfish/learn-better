"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react"
import { v4 as uuidv4 } from "uuid";

import { Input } from "@nextui-org/input";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

import { Button } from "@/components/utils/Button";
import UppyFileUpload from "@/components/utils/UppyFileUpload";
import ScraperForm from "@/components/utils/ScraperForm";
import Icon from "@/components/utils/Icon";


import { multipleLevelSchema } from "@/functions/ai/schemas";
import { deleteObject } from "@/utils/supabase/storage";
import { upsertCourseSection } from "@/utils/supabase/courseSections";
import { upsertCourseTopic } from "@/utils/supabase/topics";

import { SessionState } from "@/types/auth";
import { Course, Course_Section, Question, Topic } from "@/types/db";
import { upsertQuestion } from "@/utils/supabase/questions";
import CourseSectionAutocomplete from "@/components/courseSection/CourseSectionAutocomplete";
import { QuestionTypes } from "@/utils/constants/question_types";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  


export default function LevelNewAIMain({ sessionState, course } : { sessionState: SessionState, course: Course }) {
    const [apiKey, setApiKey] = useState<string | null>(sessionState.settings.gemini_api_key ?? null);
    const [filename, setFilename] = useState<string | null>(null);
    const [courseSection, setCourseSection] = useState<Course_Section | null>(null);
    const [numLevels, setNumLevels] = useState<number>(1);

    const [isAddingLoading, setIsAddingLoading] = useState<boolean>(false);
    const [isAdded, setIsAdded] = useState<boolean>(false);

    const { object, submit, isLoading, stop } = useObject({
        api: "/api/ai/createLevels",
        schema: multipleLevelSchema,
        headers: {
            "X-api-key": apiKey ?? "",
            "X-doc-name": filename ?? "",
            "X-num-levels": numLevels?.toString() ?? "",
            "X-course-section-title": courseSection?.title ?? "",
            "X-course-section-description": courseSection?.description ?? "",
        },
        onFinish: async () => {
            await deleteObject({ filename: filename!, path: "", bucketName: "documents" });
            setFilename(null);
        }
    })

    const handleAddContentToCourse = async () => {
        if(!object || !sessionState || !course) {
            console.error("Missing object, session or course");
            return;
        };
        
        setIsAddingLoading(true);

        object.forEach(async (section) => {

            const newCourseSection: Course_Section = {} as Course_Section;

            if(courseSection == null) {
                if(!section || !section.title || !section.description || !section.order ||
                    !section.levels || section.levels.length == 0
                ) return;

                newCourseSection.id = uuidv4();
                newCourseSection.course = course;
                newCourseSection.title = section.title;
                newCourseSection.description = section.description;
                newCourseSection.order = section.order;

                await upsertCourseSection(newCourseSection);
            }

            // toggle for first uploaded section for safety
            if(!isAdded) setIsAdded(true);

            section?.levels?.forEach(async (level) => {
                if(!level || !level.title || !level.description || !level.questions || level.questions.length == 0) return;
                
                const newLevel: Topic = {
                    id: uuidv4(),
                    title: level.title,
                    description: level.description,
                    course: course,
                    course_section: courseSection ? courseSection : newCourseSection
                }

                const res = await upsertCourseTopic(newLevel);

                if(res) {
                    level.questions.forEach(async (question) => {
                        if(!question || !question.title || !question.question) return;

                        const newQuestion: Question = {
                            id: uuidv4(),
                            title: question.title,
                            question: question.question,
                            topic: {
                                ...newLevel,
                                id: res.id
                            },
                            answer_options: question.question_type == "multiple_choice" ? question.multiple_choice?.answer_options as string[] : ["true", "false"],
                            answers_correct: question.question_type == "multiple_choice" ? question.multiple_choice?.answers_correct as string[] : question.true_false?.answer_correct ? ["true"] : ["false"],
                            type: question.question_type == "multiple_choice" ? QuestionTypes.multiple_choice : QuestionTypes.boolean
                        }

                        await upsertQuestion(newQuestion);
                    })
                }
            })
        })

        setIsAddingLoading(false);
        setIsAdded(true);
    }

    const handleReset = () => {
        // reload page
        window.location.reload();
    }

    return (
        <>
        <div className="flex flex-col">
            <h1 className=" font-bold text-2xl">Generate new levels with AI</h1>
        </div>
        <CourseSectionAutocomplete 
            setCourseSection={(courseSection) => setCourseSection(courseSection)} 
            course={course}
        />

        <Drawer>
            <DrawerTrigger className="w-fit py-6" asChild>
                <Button isDisabled={!courseSection} variant="solid" color="primary" >Open config</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>AI Configuration</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col px-4 gap-4">
                    <Input 
                        label="Your Gemini API Key" 
                        value={apiKey ?? ""} 
                        isRequired
                        type="password"
                        onValueChange={(value) => setApiKey(value)} 
                    />

                    <Input 
                        label="Number of Levels" 
                        type="number" 
                        isRequired
                        description="The AI will try to match this, but no guarantee"
                        className=" max-w-[200px]" 
                        value={numLevels.toString()} 
                        onValueChange={(value) => setNumLevels(parseInt(value))} 
                    />
                    <div className="flex flex-col gap-1">
                        <p className=" text-sm text-gray-700 dark:text-gray-400 " >{filename == null ? "Upload a Source from either a PDF or a URL" : `Uploaded '${filename}'`}</p>
                        <div className="flex flex-wrap gap-2 items-center">
                            <UppyFileUpload 
                                session={sessionState} 
                                label="Upload PDF" 
                                setFileNameCalback={(filename) => setFilename(filename)}
                                isDisabled={filename !== null} 
                            />
                            <ScraperForm 
                                setFilenameCallback={(filename) => setFilename(filename)} 
                                isDisabled={filename !== null}
                            />
                        </div>
                     </div>
                </div>

                <DrawerFooter>
                    <div className="flex flex-row items-center gap-1">
                        <Button 
                            isDisabled={!sessionState || (!object && !filename) || isAddingLoading || !course} 
                            isLoading={isLoading || isAddingLoading} 
                            onClick={() => {
                                if(!object) {
                                    submit(""); 
                                    setIsAdded(false)
                                } else {
                                    handleAddContentToCourse()
                                }
                               
                            }} 
                            color="primary"
                            size="lg"
                            fullWidth
                            variant={"solid"} 
                            startContent={<Icon filled>auto_awesome</Icon>}
                        >
                            {!object ? "Generate" : "Add to Course"}
                        </Button>
                        {isLoading ?
                            <Button isIconOnly size="lg" variant="light" color="danger" onClick={stop}>
                                <Icon>stop</Icon>
                            </Button> 
                            : 
                            <Button 
                                isIconOnly variant="light" 
                                color="warning" isDisabled={!object || isAddingLoading || isLoading} 
                                size="lg" onClick={handleReset}
                            >
                                <Icon>refresh</Icon>
                            </Button>
                        }
                    </div>

                    <DrawerClose asChild>
                        <Button variant="flat" >
                            Close
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
             
        </Drawer>


        <div className="flex flex-col gap-4  h-full overflow-y-auto">
            {object?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex flex-col gap-2 px-2 py-2 rounded">
                    <span className=" font-bold text-lg">{section?.title}</span>
                    <span className="">{section?.description}</span>
                    
                    <div className="flex flex-col gap-1">
                        {section?.levels?.map((level, i) => (
                        <div className=" p-2 rounded" key={i}>
                            {level?.questions && level.questions.length > 0 &&
                                <Accordion>
                                    {level.questions.map((q, i) => (
                                        <AccordionItem 
                                            aria-label="Questions" 
                                            key={i}
                                            title={q?.title} subtitle={q?.question}
                                        >

                                            {q?.question_type == "multiple_choice" &&
                                                <div className="flex flex-col">
                                                    {q?.multiple_choice?.answer_options?.map((a, j) => (
                                                        <span key={j} className={`text-tiny ${q?.multiple_choice?.answers_correct?.includes(a) && "text-green-400"}`}>{a}</span>
                                                    ))}
                                                </div>
                                            }

                                            {q?.question_type == "true_false" &&
                                                <span className={`text-tiny ${q?.true_false?.answer_correct ? "text-green-400" : "text-red-400"}`}>{q?.true_false?.answer_correct ? "true" : "false"}</span>
                                            }

                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            }
                        </div>
                        ))}
                    </div>
                </div>
            ))}

            
        </div>

        </>
    )
}