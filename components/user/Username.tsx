"use client";

import { useState } from "react";

import { User } from "@nextui-org/user";

import { Profile } from "@/types/db";
import BlurModal from "../utils/BlurModal";
import ProfileCard from "./ProfileCard";
import { SessionState } from "@/types/auth";



export default function Username({ profile, sessionState } : { profile: Profile, sessionState: SessionState }) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <>
        <User
            className=""
            onClick={() => setIsModalOpen(true)}
            name={profile.username}
            avatarProps={{ src: profile?.avatarLink }}
        />

        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            header={<>{profile?.username}s&apos; Profile</>}
            body={<ProfileCard profile={profile} session={sessionState} />}
            footer={<></>}
        />

        </>
    )
}