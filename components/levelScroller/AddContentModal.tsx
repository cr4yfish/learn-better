"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/utils/Button";
import BlurModal from "../utils/BlurModal";
import Icon from "../utils/Icon";
import { Course } from "@/types/db";

type Props = {
    course: Course
}

export default function AddContentModal(props: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>                        
        <Button 
            color="primary" onClick={() => setIsModalOpen(true)}
            size="lg" radius="full"
            startContent={<Icon color="fuchsia-950" filled>add</Icon>} 
        >
            Add Content
        </Button>
            
        <BlurModal 
            isOpen={isModalOpen}
            updateOpen={setIsModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            header={<>Add Content to {props.course.abbreviation}</>}
            body={
                <>
                <div className="flex flex-col gap-2">

                    <div className="flex flex-col gap-2">
                        <Link href={`/course/edit/${props.course.id}`}>
                            <Button color="primary" startContent={<Icon filled>edit</Icon>}>
                                Edit Course & Course Sections
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <Link href={`/level/new?courseId=${props.course.id}`}>
                            <Button 
                                color="primary" 
                                startContent={<Icon color="fuchsia-950" filled>add</Icon>} 
                            >
                                Add a new level
                            </Button>
                        </Link>
                        <Link href={`/level/new/ai?courseId=${props.course.id}`}>
                            <Button
                                color="primary"
                                startContent={<Icon color="fuchsia-950" filled>auto_awesome</Icon>}
                            >
                                Create levels with AI
                            </Button>
                        </Link>
                    </div>

                </div>
                </>
            }
            footer={
                <>
                Footer
                </>
            }
        />
        </>
    )
}