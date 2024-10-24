"use client";

import { useState } from "react";
import { Button } from "./Button"

import { followUser, unFollowUser } from "@/utils/supabase/user";
import Icon from "./Icon";

export default function FollowButton({ initFollow=false, userId, otherUserId } : { initFollow?: boolean, userId: string, otherUserId: string }) {
    const [isFollow, setIsFollow] = useState(initFollow);

    const handleFollowUser = async () => {
        if(isFollow) {
            try {
                // unfollow
                setIsFollow(false);
                await unFollowUser({ userId, otherUserId });
            } catch (e) {
                console.error("Error unfollowing user", e);
                setIsFollow(true);
            }

        } else {
            try {
                // follow
                setIsFollow(true);
                await followUser({ userId, otherUserId });
            } catch (e) {
                console.error("Error following user", e);
                setIsFollow(false);
            }

        }
    }

    return (
        <>
        <Button 
            onClick={handleFollowUser} 
            variant="flat" 
            color="secondary"
            startContent={<Icon filled>{isFollow ? "check_circle" : "add"}</Icon>}
        >
            {isFollow ? "Unfollow" : "Follow"}
        </Button>
        </>
    )
}