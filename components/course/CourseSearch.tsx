"use client";

import React, { useState, useEffect } from "react"
import { Input } from "@nextui-org/input"

import { Button } from "../utils/Button"
import Icon from "../utils/Icon"
import CourseCard from "./CourseCard"
import { SessionState } from "@/types/auth"
import { Course } from "@/types/db"
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


    return (
        <div className="flex flex-col gap-1">
            <Button color="primary" onClick={() => setIsModalOpen(true)} startContent={<Icon color="fuchsia-950" filled>search</Icon>} >Search courses</Button>
        
            <BlurModal 
                isOpen={isModalOpen}
                updateOpen={setIsModalOpen}
                settings={{
                    hasHeader: true,
                    hasBody: true,
                    hasFooter: true,
                    size: "full",
                    placement: "top",
                    hideCloseButton: true,
                }}
                header={
                    <div className="flex items-center justify-between w-full">
                        <span>Search Courses</span>
                        <Button onClick={() => setIsModalOpen(false)} variant="light" color="danger" isIconOnly><Icon filled>close</Icon></Button>
                    </div>
                }
                body={
                    <>
                    <div className="flex flex-col gap-2">
                        {searchResults.map((course) => (
                            <CourseCard 
                                key={course.id} 
                                course={course} 
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
                
                footer={
                <>
                    <div className="flex flex-col justify-between items-center gap-4 w-full pb-12">
                        <div className="flex items-center w-full gap-2">
                            <Button isDisabled startContent={<Icon filled>sort</Icon>}>Sort</Button>
                            <Button isDisabled startContent={<Icon filled>filter</Icon>}>Filter</Button>
                        </div>
                        <Input 
                            label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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

                </>
                }
            />
    </div>
    )
}