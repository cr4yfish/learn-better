"use client";


import { useEffect, useState } from "react";
import { User as UserCard } from "@nextui-org/user";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";

import { Profile } from "@/types/db";

import Navigation from "@/components/utils/Navigation";
import { getProfileById } from "@/functions/supabase/user";

export default function ViewProfile({ params: { userId } } : { params: { userId: string } }) {
    const [profile, setProfile] = useState<Profile>({} as Profile);

    useEffect(() => {

        // get profile
        getProfileById(userId).then((res) => {
            if(res === null) return;
            setProfile(res);
        })
    }, [userId])

    return (
    <>
    <div className="flex flex-col gap-4 px-4 py-6 h-full min-h-full">

        <div className="relative flex items-center w-full h-[160px] overflow-hidden">
            <div className=" absolute opacity-50">
                <Image 
                    src={profile?.bannerLink} 
                    width={500} 
                    alt="" 
                />

            </div>

            <Skeleton 
                isLoaded={!!profile}
                className="rounded-full"
            >
                <UserCard 
                    className="relative z-10 mx-4"
                    name={profile?.username} 
                    description={(
                        <span>{profile?.total_xp} XP</span>
                    )}
                    avatarProps={{
                        src: profile?.avatarLink
                    }} 
                />
            </Skeleton>
        </div>

    </div>
    <Navigation activeTitle="Profile" />
    </>

    )
}