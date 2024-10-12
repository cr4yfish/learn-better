"use client";


import { useEffect, useState } from "react";
import { User as UserCard } from "@nextui-org/user";
import { Image } from "@nextui-org/image";

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

        <div className="relative flex items-center w-full h-[160px] overflow-hidden">
            <div className=" absolute opacity-50">
                <Image 
                    src={sessionState.profile?.bannerLink} 
                    width={500} 
                    alt="" 
                />

            </div>

            <UserCard 
                className="relative z-10 mx-4"
                name={sessionState.profile?.username} 
                description={(
                    <span>{sessionState.profile?.total_xp} XP</span>
                )}
                avatarProps={{
                    src: sessionState.profile?.avatarLink
                }} 
            />
        </div>


        <div className="flex flex-row items-center justify-between w-full">
            <h1 className="text-3xl font-bold">Hi, {sessionState.profile?.username}</h1>
            <LoginButton sessionState={sessionState} setSessionState={setSessionState} />
        </div>

        <h2>Your Courses</h2>

        <div className="flex flex-row gap-4">
            {sessionState.courses?.map(userCourse => (
                <div key={userCourse.course.id} className="flex flex-col gap-2">
                    <h3>{userCourse.course.title}</h3>
                    <p>{userCourse.course.abbreviation}</p>
                </div>
            ))}
        </div>

    </div>
    <Navigation activeTitle="Profile" />
    </>

    )
}