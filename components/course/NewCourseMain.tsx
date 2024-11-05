"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

import { Progress } from "@nextui-org/progress";
import { Input, Textarea } from "@nextui-org/input"
import { Switch } from "@nextui-org/switch"

import { Course, Course_Category } from "@/types/db";
import { useToast } from "@/hooks/use-toast";
import Icon from "../utils/Icon";
import { Button } from "@/components/utils/Button";
import { upsertCourse, joinCourse } from "@/utils/supabase/courses";
import ConditionalLink from "../utils/ConditionalLink";
import CourseCategoryAutocomplete from "./CourseCategoryAutocomplete";

type Props = {
    userId: string | undefined;
    dontRedirect?: boolean;
    callback?: (courseId: string) => Promise<void>;
}

const animateProps = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -100 },
    className: "flex flex-col gap-4 px-2"
}

const stepText = [
    "What is the Course called?",
    "Describe the Course",
    "Abbreviate the Course",
    "Course Settings",
    "Review",
]

export default function NewCourseMain(props: Props) {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const [newCourse, setNewCourse] = useState<Course>({} as Course);
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        setProgress(step * 33.3);
    }, [step])

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

        courseToSave.id = uuidv4();
        courseToSave.is_official = false;
        
        try {
            console.log(courseToSave, props)
            const res = await upsertCourse(courseToSave, props.userId);
            console.log(res)
            if(res.id) {
                // subscribe to the course
                try {
                    const joinedCourse = await joinCourse(res.id, props.userId, {
                        is_admin: true,
                        is_moderator: true,
                        is_collaborator: true,
                    });
                    console.log(joinedCourse)

                } catch (e) {
                    console.error(e);
                    toast({
                        title: "Error",
                        description: "An error occurred while subscribing to the new course",
                        variant: "destructive"
                    })
                } finally {
                    if(props.dontRedirect && props.callback) {
                        console.log("callback")
                        props.callback(res.id);
                    } else  {
                        window.location.href = `/course/${res.id}`;
                    }
                }
            }
            
        } catch (e) {
            console.error(e);
            toast({
                title: "Error",
                description: "An error occurred while creating the course",
                variant: "destructive"
            })
            setIsLoading(false);
        }

    }

    const handleNextStep = () => {
        switch(step) {
            case 0:
                if(!newCourse.title) return;
                break;
            case 1:
                if(!newCourse.description) return;
                break;
            case 2:
                if(!newCourse.abbreviation) return;
                break;
            case 3:
                if(!newCourse.category) return;
                break;
        }
        setStep((prev) => prev + 1);
    }
    
    const handlePrevStep = () => {
        setStep((prev) => prev - 1);
    }

    return (
        <>
        <div>
            <ConditionalLink active={step == 0} href="/community">
                <Button variant="light" startContent={<Icon filled>arrow_back</Icon>} onClick={handlePrevStep} >
                    {step == 0 ? "Cancel" : "Previous Step"}
                </Button>
            </ConditionalLink>
        </div>
        <div className="flex flex-col pt-0 gap-4">
            <Progress value={progress} maxValue={100} size="sm" />
            <h1 className="font-bold text-4xl mb-6">{ stepText[step] }</h1>
        
            { step == 0 &&
            <AnimatePresence>
            <motion.div {...animateProps} >
                <Textarea 
                    label="Course Title" variant="bordered"
                    value={newCourse?.title} size="lg" classNames={{ input: "text-4xl ", label: " pb-[8px] " }}
                    maxLength={50} form="new-course-form" description="What is the name of the course?"
                    onValueChange={(value) => updateNewCourseValue("title", value)} endContent={<span>{newCourse.title?.length ||0}/50</span>}
                />
                </motion.div>
            </AnimatePresence>
            }
            
            { step == 1 &&
            <AnimatePresence>
                <motion.div {...animateProps}>
                    <Textarea 
                        label="Course Description" variant="bordered" classNames={{ input: "text-2xl ", label: " pb-[8px] " }}
                        value={newCourse?.description} size="lg" maxLength={150}
                        form="new-course-form" description="Describe the course in detail" endContent={<span>{newCourse.description?.length || 0}/150</span>}
                        onValueChange={(value) => updateNewCourseValue("description", value)} 
                    />
                </motion.div>
            </AnimatePresence>
            }

            { step == 2 &&
                <motion.div {...animateProps}>
                    <Input 
                        label="Course Abbreviation" variant="underlined"  classNames={{ input: "text-2xl ", label: " pb-[8px] " }}
                        value={newCourse?.abbreviation} size="lg" endContent={<span>{newCourse.abbreviation?.length || 0}/5</span>}
                        onValueChange={(value) => updateNewCourseValue("abbreviation", value)} 
                        maxLength={5} 
                    />
                </motion.div>
            }

            { step == 3 &&
                <motion.div {...animateProps} >
                    <Switch onValueChange={(value) => updateNewCourseValue("is_public", value ? true : false)} >
                        Public Course
                    </Switch>
                    <CourseCategoryAutocomplete setCategory={(category) => updateNewCourseValue("category", category)} />
                </motion.div>
            }

            { step == 4 &&
                <motion.div {...animateProps} >
                    <div className="prose dark:prose-invert prose-p:m-0 w-full relative break-words flex flex-col gap-4">
                        <div className="flex flex-col">
                            <span className=" text-tiny">Title</span>
                            <p>{newCourse.title}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className=" text-tiny">Abbreviationtle</span>
                            <p>{newCourse.abbreviation}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className=" text-tiny">Description</span>
                            <p>{newCourse.description}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className=" text-tiny">Public</span>
                            <p>{newCourse.is_public ? "Yes" : "No"}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className=" text-tiny">Category</span>
                            <p>{newCourse.category?.title}</p>
                        </div>
                    </div>
                </motion.div>
            }

            { step == 4 ?
                <Button
                    color="primary"
                    isLoading={isLoading}
                    size="lg"
                    fullWidth
                    startContent={<Icon filled>add</Icon>}
                    onClick={() => saveCourse(newCourse)}
                >
                    Create Course
                </Button>

                :

                <Button 
                    onClick={handleNextStep} 
                    size="lg" color="secondary" variant="flat" 
                    endContent={<Icon filled>arrow_right_alt</Icon>}
                    form="new-course-form" type="submit"
                >
                    Next
                </Button>

            }


        </div>
        </>
    )
}