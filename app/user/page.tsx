"use client";

import LoginButton from "@/components/LoginButton"
import { useEffect, useState } from "react";
import { getCurrentUser, getProfile } from "@/functions/client/supabase";
import { SessionState } from "@/types/auth";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import Navigation from "@/components/homepage/Navigation";

export default function User() {
    const [sessionState, setSessionState] = useState<SessionState>({} as SessionState);

    useEffect(() => {
        // get profile
        getCurrentUser().then(res => {
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
    <Navigation />
    </>

    )
}