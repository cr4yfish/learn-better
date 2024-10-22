"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@nextui-org/skeleton";
import { User } from "@nextui-org/user";

import { Profile } from "@/types/db";
import BlurModal from "../utils/BlurModal";
import { getProfileById } from "@/functions/supabase/user";
import { Button } from "../utils/Button";
import ConditionalLink from "../utils/ConditionalLink";



export default function Username({ initProfile, userId } : { initProfile?: Profile, userId?: string }) {
    const [profile, setProfile] = useState<Profile>(initProfile ?? {} as Profile);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if(!profile && userId) {
            setIsLoading(true);
            getProfileById(userId).then((res) => {
                if(res === null) return;
                setProfile(res);
                setIsLoading(false);
            })
        }

    }, [initProfile, userId, profile])


    return (
        <>
        <Skeleton
            isLoaded={!isLoading}
            className="flex items-center rounded-lg"
        >
            <User
                onClick={() => setIsModalOpen(true)}
                name={profile?.username}
                avatarProps={{ src: profile?.avatarLink }}
            />
        </Skeleton>

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: false,
                hasBody: true,
                hasFooter: true,
            }}
            header={profile?.username}
            body={
                <>
                    <span>Rank: {profile?.rank?.title}</span>
                    <span>{profile.total_xp} XP</span>
                </>
            }
            footer={
                <>
                    <ConditionalLink
                        active={!isLoading}
                        href={`/user/${profile?.id}`}
                    >
                        <Button
                            variant="flat"
                            color="primary"
                            className=" text-primary"
                        >
                            View Profile
                        </Button>
                    </ConditionalLink>
                </>
            }
        />

        </>
    )
}