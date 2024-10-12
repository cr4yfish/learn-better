import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

import Icon from "../Icon";
import CourseCard from "./CourseCard";

import { searchCourses, getCourses, getCurrentUser } from "@/functions/client/supabase";
import { Course, User_Course } from "@/types/db";
import { SessionState } from "@/types/auth";



export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [sessionState, setSessionState] = useState<SessionState | null>(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Course[]>([]);

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
    

    useEffect(() => {

        const fetchCourses = async () => {
            const res = await getCourses();
            setCourses(res);
        };

        const fetchSessionState = async () => {
            const res = await getCurrentUser();
            setSessionState(res);
        }

        fetchSessionState();
        fetchCourses();

    }, [setCourses]);

    const updateUserCourses = (newCourses: User_Course[]) => {
        if(sessionState) {
            console.log("Updating session state with new courses:",newCourses);
            setSessionState({
                ...sessionState,
                courses: newCourses
            });
        }
    }

    return (
        <>
        <div className="flex px-4 py-6 flex-col gap-4">
            <h1 className="font-bold">Community</h1>

            <h2 className=" font-bold">Newest Courses</h2>
            <Swiper
                spaceBetween={25}
                slidesPerView={3}
                loop={false}
                simulateTouch
                className=' w-full h-full max-w-full overflow-x-scroll select-none'
            >
                {courses.map((course) => (
                    <SwiperSlide className=' w-fit min-h-full' key={course.id}>
                        <CourseCard 
                            isSmall 
                            course={course} 
                            userCourses={sessionState?.courses} 
                            setUserCourses={(courses) => updateUserCourses(courses)}
                            userID={sessionState?.user?.id}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="flex flex-col gap-1">
                <div className="flex flex-row justify-between items-center w-full">
                    <h2 className=" font-bold text-tiny">Search Courses</h2>
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
                </div>
            </div>
        </div>
        </>
    )
}