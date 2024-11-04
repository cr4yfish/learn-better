"use client";


import { SwiperSlide, Swiper } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import CourseCard from "./CourseCard";

import { Course } from "@/types/db";
import { SessionState } from "@/types/auth";

export default function CoursesShowcaseSwiper({ session, courses, label } : { session: SessionState, courses: Course[], label: string }) {

    return (
        <div className=" w-full flex flex-col gap-1">
            <h2 className=" font-bold">{label}</h2>
            <Swiper
                modules={[Scrollbar]}
                spaceBetween={15}
                slidesPerView={1}
                loop={false}
                simulateTouch
                scrollbar={{ draggable: true }}
                className=' w-full h-full overflow-x-scroll overflow-visible select-none'
            >
                {courses.slice(0,5).map((course) => (
                    <SwiperSlide className=' w-fit h-fit overflow-visible' key={course.id}>
                        <CourseCard 
                            course={course} 
                            userID={session.user?.id}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}