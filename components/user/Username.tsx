"use client";

import { User } from "@nextui-org/user";

import { Profile } from "@/types/db";
import BlurModal from "../utils/BlurModal";
import ProfileCard from "./ProfileCard";
import { SessionState } from "@/types/auth";


type Props = {
    profile: Profile,
    sessionState: SessionState,
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Username(props: Props) {

    return (
        <>
        <User
            className=""
            name={props.profile.username}
            avatarProps={{ src: props.profile?.avatarLink }}
        />

        <BlurModal 
            isOpen={props.isOpen}
            updateOpen={props.setOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            header={<>{props.profile?.username}s&apos; Profile</>}
            body={<ProfileCard profile={props.profile} session={props.sessionState} />}
            footer={<></>}
        />

        </>
    )
}