"use client";
import { useState, useEffect } from "react";

import CourseSearch from "@/components/course/CourseSearch";
import { SessionState } from "@/types/auth";
import { getCurrentUser } from "@/functions/supabase/auth";
import { updateCurrentCourse } from "@/functions/supabase/courses";

export default function SelectCourse() {
    const [sessionState, setSessionState] = useState<SessionState | null>({} as SessionState);


    useEffect(() => {
        const fetchSessionState = async () => {
            const res = await getCurrentUser();
            if(res) {
                setSessionState(res);
            }
        }
        fetchSessionState();
    }, [])

    useEffect(() => {
        const handleDone = async () => {
            if(sessionState?.user?.id && sessionState?.courses[0]?.course?.id) { 
                const res = await updateCurrentCourse(sessionState.user.id, sessionState.courses[0].course.id);
                if(res) {
                    window.location.href = "/";
                }
            }
        }

        if(sessionState && sessionState?.courses?.length > 0) {
            alert("Welcome to: " + sessionState.courses[0].course.abbreviation);
            handleDone();
        }
    }, [sessionState])

    return (
        <>
        <div className="z-10 px-4 py-6 h-screen flex flex-col gap-4 items-center justify-center pb-[33vh]">
            <h1 className="text-4xl font-bold text-center">Join a course to get started</h1>
            {sessionState && 
                <CourseSearch 
                    sessionState={sessionState} 
                    setSessionState={setSessionState} 
                />
            }
            </div>

            <span className="absolute w-screen h-screen top-[66%] right-[50%]  fill-black ">
                <svg viewBox="0 0 200 200" className=" fill-fuchsia-400/30 scale-[300%]" xmlns="http://www.w3.org/2000/svg">
                    <path fill="inherit" d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(100 100)" />
                </svg>
            </span>
        </>
    )
}