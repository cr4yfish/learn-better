"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "../utils/Button";
import BlurModal from "../utils/BlurModal";
import CourseSelectSwiper from "../course/CourseSelectSwiper";

import { useCurrentCourse } from "@/hooks/SharedCourse";

import { upsertSettings } from "@/utils/supabase/settings";

import { Course, User_Course } from "@/types/db";
import { SessionState } from "@/types/auth";
import Icon from "../utils/Icon";

export default function HeaderCourseSelect({ sessionState } : { sessionState: SessionState }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserCourse, setCurrentUserCourse] = useState<User_Course | undefined>(sessionState.courses.find((uc) => uc.course.id === sessionState.settings.current_course?.id));
    const { currentCourse, setCurrentCourse } = useCurrentCourse();

    const handleCourseChange = async (course: Course) => {

        upsertSettings({
          ...sessionState.settings,
          current_course: course,
          user: sessionState.user
        })
        setCurrentCourse(course)
        setCurrentUserCourse(sessionState.courses.find((uc) => uc.course.id === course.id))
    }

    useEffect(() => {
        setCurrentCourse(sessionState.settings.current_course)
    }, [sessionState, setCurrentCourse])

    return (
        <>
        <Button 
            variant="flat" color="secondary"
            className="font-black" 
            onClick={() => {
                setIsModalOpen(true);
            }} 
            isLoading={!sessionState.settings.current_course?.abbreviation}
        >
            {currentCourse?.abbreviation ?? sessionState.settings.current_course?.abbreviation}
        </Button>

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                size: "lg"
            }}
            header={<>Your Courses</>}
            body={
                <>
                    <span className=" text-lg font-bold">{currentCourse?.abbreviation}</span>

                    <div className="flex flex-col gap-1">
                        <span className=" text-sm">Your options</span>
                        
                            <div className="flex flex-row items-center gap-2 overflow-x-auto max-w-full pb-2">

                                { currentUserCourse?.is_admin &&
                                    <Link href={`course/edit/${currentCourse?.id}`}>
                                        <Button variant="flat" color="warning" startContent={<Icon filled>edit</Icon>}>Edit</Button>
                                    </Link>
                                }

                                {(currentUserCourse?.is_admin || currentUserCourse?.is_collaborator) &&
                                    <>
                                    <Link href={`level/new/ai`}>
                                        <Button color="secondary" variant="flat" startContent={<Icon>auto_awesome</Icon>}>Create Level with AI</Button>
                                    </Link>
                                    <Link href={`level/new?courseId=${currentUserCourse.course.id}`}>
                                        <Button color="secondary" variant="flat" startContent={<Icon>add</Icon>}>Create Level yourself</Button>
                                    </Link>
                                    </>
                                 }

                                 { !currentUserCourse?.is_admin && !currentUserCourse?.is_collaborator && !currentUserCourse?.is_moderator &&
                                    <span className=" text-tiny italic text-gray-700 dark:text-gray-400">You have no options</span>
                                 }

                            </div>
                       
                    </div>

                    <div className="flex flex-col mt-4">
                        <span className=" text-sm">Your other Courses</span>
                        <CourseSelectSwiper 
                            courses={sessionState.courses.map((uc) => uc.course)} 
                            currentCourse={currentCourse ?? undefined}
                            setCurrentCourse={handleCourseChange} 
                        />
                    </div>

                </>
            }
            footer={<Link href={"/community"}><Button color="secondary" variant="flat">View all courses</Button></Link>}
        />
        </>
    )
}