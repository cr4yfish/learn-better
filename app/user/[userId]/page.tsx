"use server";

import { redirect } from "next/navigation";

import Navigation from "@/components/utils/Navigation";
import { getCurrentUser } from "@/utils/supabase/auth";
import { formatReadableDate } from "@/functions/helpers";
import Icon from "@/components/utils/Icon";
import { getProfileById } from "@/utils/supabase/user";

import FollowButton from "@/components/utils/FollowButton";
import UserFriends from "@/components/user/UserFriends";
import ShareProfileButton from "@/components/user/ShareProfileButton";

export default async function User({ params: { userId } } : { params: { userId: string } }) {;

    const profile = await getProfileById(userId);
    
    if(!profile) {
        redirect("/404");
    }

    const session = await getCurrentUser();

    return (
    <>
    <div className="flex flex-col gap-4 px-6 py-6 h-full min-h-full">

        <div className="relative flex items-center w-full overflow-hidden">

            <div className="flex flex-col gap-4 w-full">

                <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-2xl font-bold">{profile?.username}</h2>
                        </div>
                        
                        <div className="flex flex-col text-tiny dark:text-gray-300">
                            <span>{profile.username}</span>
                            <span>Joined {formatReadableDate(profile.created_at ?? "")}</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-8 mt-4 h-[48px]">

                        <UserFriends userId={userId} />

                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {session?.user?.id && session.user.id !== userId && <FollowButton userId={session.user.id} otherUserId={userId} />}
                    <ShareProfileButton userId={userId} />
                </div>


                <div className="flex flex-col">
                    <h2 className=" text-medium font-medium ">Overview</h2>
                                
                    <div className="flex flex-row items-center flex-wrap gap-4">
                        
                        <div className="flex flex-row gap-1">
                            <div className=" text-orange-500">
                                <Icon color="orange-500" filled>mode_heat</Icon>
                            </div>
                            <div className="flex flex-col">
                                <span>{profile.currentStreakDays}</span>
                            </div>
                        </div>

                                          
                        <div className="flex flex-row gap-1">
                            <div className="text-green-400">
                                <Icon filled>hotel_class</Icon>
                            </div>
                            <div className="flex flex-col">
                                <span>{profile.total_xp.toLocaleString()}</span>
                            </div>
                        </div>


                    </div>

                </div>
            
            </div>
            
        </div>


    </div>
    <Navigation activeTitle={undefined} />
    </>

    )
}