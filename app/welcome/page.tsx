"use client";

import LoginButton from "@/components/LoginButton"
import { SessionState } from "@/types/auth";
import { useEffect, useState } from "react";

export default function Welcome() {
    const [sessionState, setSessionState] = useState<SessionState>({} as SessionState)

    useEffect(() => {
        if(sessionState.user?.id) {
            // Route user to home once they are logged in
            window.location.href = "/welcome/course";
        }
    }, [sessionState])

    return (
        <>
        <div className=" px-4 py-6 h-screen flex flex-col gap-4 items-center justify-center pb-[33vh]">
            <h1 className="text-4xl font-bold text-center">Welcome to Nouv!</h1>
            <p>Login or sign up to get started</p>
            <LoginButton sessionState={sessionState} setSessionState={setSessionState} />
        </div>
        </>
    )
}