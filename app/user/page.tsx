"use client";


import { useEffect, useState } from "react";

import { getCurrentUser } from "@/functions/client/supabase";

import { SessionState } from "@/types/auth";

import Navigation from "@/components/homepage/Navigation";
import LoginButton from "@/components/LoginButton"

export default function User() {
    const [sessionState, setSessionState] = useState<SessionState>({} as SessionState);

    useEffect(() => {
        // get profile
        getCurrentUser().then(res => {
            if(res === null) return;
            setSessionState(res);
        })
    }, [])

    return (
    <>
    <div className="flex flex-col gap-4 px-4 py-6 h-full min-h-full">
        <div className="flex flex-row items-center justify-between w-full">
            <h1 className="text-4xl font-bold">Hi, {sessionState.profile?.username}</h1>

            <LoginButton sessionState={sessionState} setSessionState={setSessionState} />
        </div>

    </div>
    <Navigation activeTitle="Profile" />
    </>

    )
}