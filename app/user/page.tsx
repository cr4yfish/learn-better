"use client";


import { useEffect, useState } from "react";
import { User as UserCard } from "@nextui-org/user";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";

import { getCurrentUser } from "@/functions/client/supabase";

import { SessionState } from "@/types/auth";

import Navigation from "@/components/homepage/Navigation";
import LoginButton from "@/components/LoginButton"
import EditProfileCard from "@/components/editProfileCard";

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

            <Skeleton 
                isLoaded={!!sessionState.profile}
                className="rounded-full"
            >
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
            </Skeleton>
        </div>


        <div className="flex flex-col items-start gap-4 w-full">
            <Skeleton
                isLoaded={!!sessionState.profile}
                className=" rounded-lg w-full py-2"
            >
                <h1 className="text-xl font-bold">Hi, {sessionState.profile?.username}</h1>
            </Skeleton>
            
            <LoginButton sessionState={sessionState} setSessionState={setSessionState} />
        </div>

        <EditProfileCard sessionState={sessionState} />


    </div>
    <Navigation activeTitle="Profile" />
    </>

    )
}