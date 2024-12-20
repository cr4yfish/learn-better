"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {Skeleton} from "@nextui-org/skeleton";

import { SessionState } from "@/types/auth";
import { Button } from "@/components/utils/Button";
import { Profile } from "@/types/db";
import Icon from "@/components/ui/Icon";
import { upsertProfile } from "@/utils/supabase/auth";

export default function EditProfileCard({ sessionState } : { sessionState: SessionState }) {
    const [userProfile, setUserProfile] = useState<Profile | undefined>(sessionState.profile);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setUserProfile(sessionState.profile);
    }, [sessionState])

    const handleSaveProfile = async () => {
        if(!userProfile) return;

        setIsSaveLoading(true);
        setIsSaved(false);
        const res = await upsertProfile(userProfile);
        if(res) {
            setIsSaved(true);
        }
        setIsSaveLoading(false);
    }

    return (
        <>
        <Card className=" text-black dark:text-white ">
            <CardHeader className=" font-bold">Edit Profile</CardHeader>
            <CardBody>

                <Skeleton
                    isLoaded={!!userProfile}
                    className=" rounded-xl"
                >
                    <Input 
                        value={userProfile?.username} 
                        label="Username" 
                        endContent={<div className="h-full flex items-center justify-center"><Icon filled >person</Icon></div>} 
                        onChange={e => userProfile && setUserProfile({...userProfile, username: e.target.value})}
                    />
                </Skeleton>
            </CardBody>
            <CardFooter className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-1">
                    <Button
                        isLoading={isSaveLoading}
                        isDisabled={!userProfile}
                        color="primary"
                        onClick={handleSaveProfile}
                    >
                        {isSaved ? "Saved" : "Save"}
                    </Button>
                    {isSaved && <span className="text-tiny">Refresh app to see effect</span>  }             
                </div>

            </CardFooter>
        </Card>
        </>
    )
}