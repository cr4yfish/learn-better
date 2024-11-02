"use client";

import { useState } from "react";

import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import BlurModal from "../utils/BlurModal";
import TeacherChat from "./TeacherChat";
import { Course, Profile } from "@/types/db";

type TeacherButtonProps = {
    course: Course,
    userProfile: Profile,
}

export default function TeacherButton(props: TeacherButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <Button className="z-50" size="lg" color="primary" onClick={() => setIsModalOpen(true)} radius="full" isIconOnly><Icon filled>auto_awesome</Icon></Button>
        <BlurModal 
            isOpen={isModalOpen} 
            updateOpen={setIsModalOpen} 
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: false,
                size: "full"
            }}
            header={<>Course Teacher</>}
            body={
                <div className="relative h-[90vh] ">
                    <TeacherChat 
                        course={props.course} 
                        userProfile={props.userProfile}
                    />
                </div>
            }
         />
        </>
    )
}