"use client";


import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

import CourseCard from "./CourseCard";

import { Course, User_Course } from "@/types/db";
import { SessionState } from "@/types/auth";

export default function CoursesShowcaseSwiper({ session, courses } : { session: SessionState, courses: Course[] }) {

    const updateUserCourses = (newCourses: User_Course[]) => {
        console.log(newCourses);
    }

    return (
        <>
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
                            userCourses={session.courses} 
                            setUserCourses={(userCourses) => updateUserCourses(userCourses)}
                            userID={session.user?.id}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}