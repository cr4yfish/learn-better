import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import CourseButton from './CourseButton';
import { Course } from '@/types/db';
import { Button } from "@nextui-org/button";

export default function CourseSelect({ 
    courses, currentCourse, setCurrentCourse } : 
    { 
        courses: Course[], currentCourse: Course, 
        setCurrentCourse: React.Dispatch<React.SetStateAction<Course>> 
    }) {

    return (
        <div
            className='w-full max-h-96 max-w-full py-4 backdrop-blur relative overflow-auto'
        >
            <Swiper
                spaceBetween={25}
                slidesPerView={3}
                loop={false}
                simulateTouch
                className=' w-full h-full max-w-full overflow-x-scroll'
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {courses.map((course) => (
                    <SwiperSlide className=' w-fit min-h-full' key={course.id}>
                        <CourseButton onPress={() => setCurrentCourse(course)} course={course} active={course.id === currentCourse.id} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}