"use server";

import { User as UserCard } from "@nextui-org/user";
import { Image } from "@nextui-org/image";

import Navigation from "@/components/utils/Navigation";
import { getProfileById } from "@/utils/supabase/user";

export default async function ViewProfile({ params: { userId } } : { params: { userId: string } }) {
    
    const profile = await getProfileById(userId);

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
            </div>

        </div>
        <Navigation activeTitle="Profile" />
    </>

    )
}