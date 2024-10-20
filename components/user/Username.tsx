"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@nextui-org/skeleton";
import { User } from "@nextui-org/user";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";

import { Profile } from "@/types/db";
import { getProfileById } from "@/functions/supabase/user";
import { Button } from "../utils/Button";
import ConditionalLink from "../utils/ConditionalLink";



export default function Username({ initProfile, userId } : { initProfile?: Profile, userId?: string }) {
    const [profile, setProfile] = useState<Profile>(initProfile ?? {} as Profile);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            className="flex items-center"
        >
            <User
                onClick={onOpen}
                name={profile.username}
                avatarProps={{ src: profile.avatarLink }}
            />
        </Skeleton>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>{profile.username}</ModalHeader>
                <ModalBody>
                    <span>Rank: {profile.rank.title}</span>
                    <span>{profile.total_xp} XP</span>
                </ModalBody>
                <ModalFooter>
                    <ConditionalLink
                        active={!isLoading}
                        href={`/user/${profile.id}`}
                    >
                        <Button
                            variant="flat"
                            color="primary"
                            className=" text-primary"
                        >
                            View Profile
                        </Button>
                    </ConditionalLink>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}