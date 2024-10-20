"use client";
import { useState, useEffect } from "react";

import CourseSearch from "@/components/course/CourseSearch";
import { SessionState } from "@/types/auth";
import { getCurrentUser, updateCurrentCourse } from "@/functions/client/supabase";

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
            alert("Welcome to course: " + sessionState.courses[0].course.abbreviation);
            handleDone();
        }
    }, [sessionState])

    return (
        <>
        <h1>Select a course to get started</h1>
        {sessionState && 
            <CourseSearch 
                sessionState={sessionState} 
                setSessionState={setSessionState} 
            />
        }
        </>
    )
}