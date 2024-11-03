"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import CourseSearch from "@/components/course/CourseSearch";
import CoursesShowcaseSwiper from "@/components/course/CoursesShowcaseSwiper";
import BlurModal from "../utils/BlurModal";

import { SessionState } from "@/types/auth";
import { Course, User_Course } from "@/types/db";

import { useUserCourses } from "@/hooks/SharedUserCourses";
import { upsertSettings } from "@/utils/supabase/settings";
import { Button } from "../utils/Button";
import EditCourseCard from "../course/EditCourseCard";
import Icon from "../utils/Icon";

export default function SelectFirstCourse({ sessionState, initCourses, joinedCourses } : { sessionState: SessionState, initCourses: Course[], joinedCourses: User_Course[] }) {
    const { userCourses } = useUserCourses();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if(!sessionState.user?.id) {
        redirect("/auth");
    }

    useEffect(() => {
        if(userCourses.length > 0 || joinedCourses.length > 0) {
            // save to settings and redirect user
            addCourseToSettings(sessionState.user!.id, userCourses[0]?.course?.id || joinedCourses[0]?.course?.id).then(() => {
                window.location.href = "/";
            })
        }
    }, [userCourses, sessionState, joinedCourses]);

    const addCourseToSettings = async (userId: string, courseId: string) => {
        await upsertSettings({
            userId: userId,
            currentCourseId: courseId
        })
    }

    const handleNewCourse = (newCourseId: string) => {
        addCourseToSettings(sessionState.user!.id, newCourseId);
        window.location.href = "/";
        setIsModalOpen(false);
    }

    return (
        <>
        <div className="flex flex-col gap-4">
            <Button startContent={<Icon>add</Icon>} size="lg" color="secondary" variant="flat" onClick={() => setIsModalOpen(true)}>Create a new Course</Button>
            <CourseSearch sessionState={sessionState} />
            <div className="flex flex-col gap-4 w-full">
                <CoursesShowcaseSwiper session={sessionState} courses={initCourses} />
            </div>
        </div>

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            header={<>Create a Course</>}
            body={
            <>
                <EditCourseCard 
                    userId={sessionState.user!.id}
                    isNew={true}
                    shouldRedirect={false}
                    callback={handleNewCourse}
                />
            </>
            }
            footer={
            <>
                
            </>
            }
        />
        </>
    )

}