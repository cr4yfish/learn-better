import { useState, useEffect } from "react";

import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

import { Button } from "../utils/Button";
import Icon from "../utils/Icon";
import CourseCard from "./CourseCard";
import ConditionalLink from "../utils/ConditionalLink";
import CourseSearch from "./CourseSearch";

import { Course, User_Course } from "@/types/db";
import { SessionState } from "@/types/auth";
import { getCourses } from "@/functions/supabase/courses";
import { getCurrentUser } from "@/functions/supabase/auth";



export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [sessionState, setSessionState] = useState<SessionState | null>(null);

    useEffect(() => {

        const fetchCourses = async () => {
            const res = await getCourses({});
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
            setSessionState({
                ...sessionState,
                courses: newCourses
            });
        }
    }

    return (
        <>
        <div className="flex px-4 py-6 flex-col gap-4 max-h-screen">
            <h1 className="font-bold">Courses</h1>

            <div className="flex flex-col gap-4">
                <ConditionalLink active={(sessionState?.user?.id ? true : false)} href={`course/new/${sessionState?.user?.id}`}>
                    <Button 
                        isLoading={sessionState?.user?.id ? false : true} color="primary" 
                        startContent={<Icon color="fuchsia-950" filled>add</Icon>}>Create a course</Button>
                </ConditionalLink>

                <CourseSearch sessionState={sessionState} setSessionState={setSessionState} />
            </div>

            <h2 className=" font-bold">Newest Courses</h2>
            <Swiper
                spaceBetween={25}
                slidesPerView={3}
                loop={false}
                simulateTouch
                className=' w-full h-full max-w-full overflow-x-scroll select-none'
            >
                {courses.slice(0,5).map((course) => (
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

            <h2 className=" font-bold">Your courses</h2>
            <ScrollShadow className="flex flex-col gap-5 max-h-[50vh] min-h-full overflow-y-auto">
                {sessionState?.courses?.map((userCourse) => (
                    <CourseCard 
                        key={userCourse.course.id} 
                        course={userCourse.course} 
                        userCourses={sessionState?.courses} 
                        setUserCourses={(courses) => updateUserCourses(courses)}
                        userID={sessionState?.user?.id}
                    />
                ))}
            </ScrollShadow>

        </div>
        </>
    )
}