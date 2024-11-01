"use server";

import { getFollowers, getFriends } from "@/utils/supabase/user";
import { Suspense } from "react";

type Params = {
    userId: string;
}

export default async function UserFriends(params: Params) {

    const friends = await getFriends(params.userId);
    const followers = await getFollowers(params.userId);
    

    return (
        <>
        <Suspense fallback={<>..Loading friends</>}>
            <div className="flex flex-col min-h-full gap-1 h-full">
                <span className=" font-medium text-medium h-[28px]">{friends.length}</span>
                <span className="text-tiny">Following</span>
            </div>

            <div className="flex flex-col min-h-full gap-1 h-full">
                <span className=" font-medium text-medium h-[28px]">{followers.length}</span>
                <span className="text-tiny">Followers</span>
            </div>
        </Suspense>
        </>
    )
    
}
