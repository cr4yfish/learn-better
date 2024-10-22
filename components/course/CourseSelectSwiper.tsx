import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import { Swiper as SwiperType } from 'swiper/types';

import CourseButton from './CourseButton';
import { Course } from '@/types/db';

export default function CourseSelectSwiper({ 
    courses, currentCourse, setCurrentCourse } : 
    { 
        courses: Course[], currentCourse: Course | undefined, 
        setCurrentCourse: (course: Course) => void,
    }) {
    const [swiper, setSwiper] = useState<SwiperType | undefined>();

    // slide to current course when it changes
    // current slide moves to first slide
    useEffect(() => {
        if(swiper) { swiper?.slideTo(0) }
    }, [swiper, currentCourse])
    
    return (
        <div
            className='w-full max-h-96 max-w-full py-4 relative overflow-auto'
        >
            <Swiper
                spaceBetween={25}
                slidesPerView={2}
                loop={false}
                simulateTouch
                onSwiper={setSwiper}
                className=' w-full h-full max-w-full overflow-x-scroll'
            >
                {[currentCourse, ...courses.filter((course) => course.id !== currentCourse?.id )].map((course) => (
                    <SwiperSlide className=' min-h-full' key={course?.id}>
                        <CourseButton 
                            onPress={() => course && setCurrentCourse(course)} 
                            course={course}
                            active={course?.id === currentCourse?.id} 
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}