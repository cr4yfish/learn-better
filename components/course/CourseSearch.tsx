"use client";

import React, { useState, useEffect } from "react"
import { Input } from "@nextui-org/input"

import { Button } from "../utils/Button"
import Icon from "../utils/Icon"
import CourseCard from "./CourseCard"
import { SessionState } from "@/types/auth"
import { Course, User_Course } from "@/types/db"
import { searchCourses } from "@/utils/supabase/courses"
import BlurModal from "../utils/BlurModal"

export default function CourseSearch(
    { sessionState } : 
    { sessionState: SessionState | null }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<Course[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        console.log(newCourses);
    }

    return (
        <div className="flex flex-col gap-1">
            <Button color="primary" onClick={() => setIsModalOpen(true)} startContent={<Icon color="fuchsia-950" filled>search</Icon>} >Search courses</Button>
        
            <BlurModal 
                isOpen={isModalOpen}
                updateOpen={setIsModalOpen}
                settings={{
                    hasHeader: true,
                    hasBody: true,
                    hasFooter: false,
                    size: "full",
                    placement: "top"
                }}
                header="Search Courses"
                body={
                <>
                    <div className="flex flex-row justify-between items-center w-full">
                        <Input
                            placeholder="Search courses" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startContent={<Icon filled>search</Icon>} 
                            variant="underlined"
                            classNames={{
                            }}
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
                </>
                }
            />
    </div>
    )
}