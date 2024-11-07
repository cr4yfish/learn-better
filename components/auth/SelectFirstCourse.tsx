"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import CourseSearch from "@/components/course/CourseSearch";
import CoursesShowcaseSwiper from "@/components/course/CoursesShowcaseSwiper";
import BlurModal from "../utils/BlurModal";

import { SessionState } from "@/types/auth";
import { Course, User_Course } from "@/types/db";

import { useUserCourses } from "@/context/SharedUserCourses";
import { upsertSettings } from "@/utils/supabase/settings";
import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import NewCourseMain from "../course/NewCourseMain";

type Props = {
    sessionState: SessionState;
    initCourses: Course[];
    joinedCourses: User_Course[];
}

export default function SelectFirstCourse(props: Props) {
    const { userCourses } = useUserCourses();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if(!props.sessionState.user?.id) {
        redirect("/auth");
    }

    useEffect(() => {
        if(userCourses.length > 0 || props.joinedCourses.length > 0) {
            // save to settings and redirect user
            addCourseToSettings(props.sessionState.user!.id, userCourses[0]?.course?.id || props.joinedCourses[0]?.course?.id).then(() => {
               //window.location.href = "/";
            })
        }
    }, [userCourses, props.sessionState, props.joinedCourses]);

    const addCourseToSettings = async (userId: string, courseId: string) => {
        await upsertSettings({
            userId: userId,
            currentCourseId: courseId
        })
    }

    const handleNewCourse = async (newCourseId: string) => {
        await addCourseToSettings(props.sessionState.user!.id, newCourseId);
        window.location.href = "/";
        setIsModalOpen(false);
    }

    return (
        <>
        <div className="flex flex-col gap-4">
            <Button startContent={<Icon>add</Icon>} size="lg" color="secondary" variant="flat" onClick={() => setIsModalOpen(true)}>Create a new Course</Button>
            <CourseSearch sessionState={props.sessionState} />
            <div className="flex flex-col gap-4 w-full">
                <CoursesShowcaseSwiper session={props.sessionState} courses={props.initCourses} label="Popular Courses" />
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

                <NewCourseMain 
                    userId={props.sessionState.user.id} 
                    dontRedirect
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