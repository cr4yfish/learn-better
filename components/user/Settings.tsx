"use client";

import { useState } from "react";

import BlurModal from "../ui/BlurModal";
import EditSettingsCard from "./EditSettingsCard";
import { Button } from "../utils/Button";
import Icon from "@/components/ui/Icon";
import { SessionState } from "@/types/auth";
import EditProfileCard from "./EditProfileCard";
import LoginButton from "./LoginButton";
import DeleteAccountButton from "../auth/DeleteAccountButton";


export default function Settings({ sessionState } : { sessionState: SessionState }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <Button variant="light" isIconOnly onClick={() => setIsModalOpen(true)}><Icon filled>settings</Icon></Button>
        <BlurModal
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen} 
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
                size: "full"
            }}

            header={
                <>Settings</>
            }
            body={
                <>  
                    <EditProfileCard sessionState={sessionState} />
                    <EditSettingsCard sessionState={sessionState} />
                </>
            }
            footer={
                <>
                    <DeleteAccountButton />
                    <LoginButton sessionState={sessionState} />
                </>
            }
        />
        </>
    )
}