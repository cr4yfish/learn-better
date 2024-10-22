"use server";


import { User as UserCard } from "@nextui-org/user";
import { Image } from "@nextui-org/image";

import Navigation from "@/components/utils/Navigation";
import EditProfileCard from "@/components/user/EditProfileCard";
import { getCurrentUser } from "@/utils/supabase/auth";
import EditSettingsCard from "@/components/user/EditSettingsCard";
import { redirect } from "next/navigation";

export default async function User() {;

    const session = await getCurrentUser();

    if(!session) {
        redirect("/auth");
    }

    return (
    <>
    <div className="flex flex-col gap-4 px-4 py-6 h-full min-h-full">

        <div className="relative flex items-center w-full h-[160px] overflow-hidden">
            <div className=" absolute opacity-50">
                <Image 
                    src={session.profile?.bannerLink} 
                    width={500} 
                    alt="" 
                />

            </div>
  
            <UserCard 
                className="relative z-10 mx-4"
                name={session.profile?.username} 
                description={(
                    <span>{session.profile?.total_xp} XP</span>
                )}
                avatarProps={{
                    src: session.profile?.avatarLink
                }} 
            />
        </div>


        <div className="flex flex-col items-start gap-4 w-full">

            <h1 className="text-xl font-bold">Hi, {session.profile?.username}</h1>
        
        </div>

        <EditProfileCard sessionState={session} />
        <EditSettingsCard sessionState={session} />


    </div>
    <Navigation activeTitle="Profile" />
    </>

    )
}