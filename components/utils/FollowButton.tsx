"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button"

import { followUser, getFriendStatus, unFollowUser } from "@/utils/supabase/user";
import Icon from "./Icon";

export default function FollowButton({ userId, otherUserId } : { userId: string, otherUserId: string }) {
    const [isFollow, setIsFollow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            setIsLoading(true);
            try {
                const res = await getFriendStatus({ userId, otherUserId });
                if(res?.follows || res?.friends) {
                    setIsFollow(true);
                }
            } catch (e) {
                console.error("Error fetching follow status", e);
                setIsFollow(false);
            }
            setIsLoading(false);
        }

        fetchFollowStatus();
    }, [userId, otherUserId])

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
                console.log(userId, otherUserId);
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
            isLoading={isLoading}
            color="secondary"
            startContent={<Icon filled>{isFollow ? "check_circle" : "add"}</Icon>}
        >
            {isFollow ? "Unfollow" : "Follow"}
        </Button>
        </>
    )
}