"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "../utils/Button";
import BlurModal from "../utils/BlurModal";
import CourseSelectSwiper from "../course/CourseSelectSwiper";

import { useCurrentCourse } from "@/hooks/SharedUserCourse";

import { upsertSettings } from "@/utils/supabase/settings";

import { Course } from "@/types/db";
import { SessionState } from "@/types/auth";

export default function HeaderCourseSelect({ sessionState } : { sessionState: SessionState }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentCourse, setCurrentCourse } = useCurrentCourse();

    const handleCourseChange = async (course: Course) => {
        //setSessionState({...sessionState, settings: {...sessionState.settings, current_course: userCourse.course}})
        upsertSettings({
          ...sessionState.settings,
          current_course: course,
          user: sessionState.user
        })
        setCurrentCourse(course)
        //setCurrentCourse(userCourse)
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
            {sessionState.settings.current_course?.abbreviation}
        </Button>

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            header={<>Your Courses</>}
            body={             
                <CourseSelectSwiper 
                    courses={sessionState.courses.map((uc) => uc.course)} 
                    currentCourse={currentCourse ?? undefined}
                    setCurrentCourse={handleCourseChange} 
                />
            }
            footer={<Link href={"/community"}><Button color="secondary" variant="flat">View all courses</Button></Link>}
        />
        </>
    )
}