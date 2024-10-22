"use client";

import Link from "next/link";
import { useState } from "react";

import { User } from "@nextui-org/user";

import { Profile } from "@/types/db";
import BlurModal from "../utils/BlurModal";
import { Button } from "../utils/Button";



export default function Username({ profile } : { profile: Profile }) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <>
        <User
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
            header={<>{profile?.username}</>}
            body={
                <>
                    <span>Rank: {profile.rank.title}</span>
                    <span>{profile.total_xp} XP</span>
                </>
            }
            footer={
                <>
                    <Link href={`/user/${profile?.id}`}  >
                        <Button
                            variant="flat"
                            color="primary"
                            className=" text-primary"
                        >
                            View Profile
                        </Button>
                    </Link>
                </>
            }
        />

        </>
    )
}