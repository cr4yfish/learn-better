"use client";

import { useEffect, useState } from "react";

import { Button } from "../utils/Button";
import BlurModal from "../utils/BlurModal";
import { Input } from "@nextui-org/input";
import { Profile } from "@/types/db";
import { searchProfiles } from "@/utils/supabase/user";
import FollowButton from "../utils/FollowButton";

type Params = {
    userId: string;
}

export default function FindFriendsButton(params: Params) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<Profile[]>([]);

    useEffect(() => {
        const handleSubmit = async () => {
            const res = await searchProfiles(search);
            setResults(res);
        }

        if(search.length > 0) {
            setTimeout(async () => {
                await handleSubmit();
            }, 1000);
        } else if(search.length === 0) {
            setResults([]);
        }

    }, [search])

    return (
        <>
        <Button onClick={() => setIsModalOpen(true)} variant="flat" color="secondary">Find friends</Button>
        
        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                size: "full",
            }}
            header={<h1>Find friends</h1>}
            body={
            <>
                <Input label="Search for friends" value={search} onValueChange={setSearch} />
                {results.length > 0 &&
                    results.map((profile) => {
                        return (
                            <div key={profile.id} className="flex flex-row justify-between items-center gap-4">
                                <span>{profile.username}</span>
                                <FollowButton userId={params.userId} otherUserId={profile.id} />
                            </div>
                        )
                    })
                }
            </>
            }
            footer={<Button onClick={() => setIsModalOpen(false)}>Close</Button>}
        />
        </>
    )
}