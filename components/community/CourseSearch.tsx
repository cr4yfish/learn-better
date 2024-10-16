import React, { useState, useEffect } from "react"
import { Input } from "@nextui-org/input"
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal"

import { Button } from "../Button"
import Icon from "../Icon"
import CourseCard from "./CourseCard"
import { SessionState } from "@/types/auth"
import { Course, User_Course } from "@/types/db"
import { searchCourses } from "@/functions/client/supabase"

export default function CourseSearch({ sessionState, setSessionState } : { sessionState: SessionState | null, setSessionState: React.Dispatch<React.SetStateAction<SessionState | null>> }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<Course[]>([])
    const { onOpen, isOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const fetchSearchResults = async () => {
            setSearchLoading(true);
            const res = await searchCourses(searchQuery);
            setSearchResults(res);
            setSearchLoading(false);
        }

        if (searchQuery.length > 0) {
            fetchSearchResults();
        } else if (searchQuery.length === 0) {
            setSearchResults([]);
        }
    }, [searchQuery])

    const updateUserCourses = (newCourses: User_Course[]) => {
        if(sessionState) {
            setSessionState({
                ...sessionState,
                courses: newCourses
            });
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <Button color="primary" onClick={onOpen} startContent={<Icon color="fuchsia-950" filled>search</Icon>} >Search courses</Button>
        
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top" size="full" >
            <ModalContent>
                <ModalHeader>Search Courses</ModalHeader>
                <ModalBody>
                <div className="flex flex-row justify-between items-center w-full">
                    <Input 
                        className="dark" 
                        placeholder="Search courses" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        startContent={<Icon filled>search</Icon>} 
                        endContent={searchQuery.length > 0 && (
                            <Button 
                                variant="light" color="primary" 
                                isIconOnly
                                isLoading={searchLoading}
                            >
                            <Icon color="primary" filled>send</Icon>
                        </Button>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    {searchResults.map((course) => (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            userCourses={sessionState?.courses} 
                            setUserCourses={(courses) => updateUserCourses(courses)}
                            userID={sessionState?.user?.id}
                        />
                    ))}

                    {searchResults.length == 0 &&  (
                     <div className=" w-full flex items-center justify-center mt-6">
                        <span className="text-tiny">Start searching for results</span>   
                    </div>
                    )}
                </div>
                </ModalBody>
            </ModalContent>
        </Modal>

    </div>
    )
}