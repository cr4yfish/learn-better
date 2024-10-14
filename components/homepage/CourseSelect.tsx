import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import { Swiper as SwiperType } from 'swiper/types';

import CourseButton from './CourseButton';
import { User_Course } from '@/types/db';

export default function CourseSelect({ 
    userCourses, currentUserCourse, setCurrentUserCourse } : 
    { 
        userCourses: User_Course[], currentUserCourse: User_Course, 
        setCurrentUserCourse: React.Dispatch<React.SetStateAction<User_Course>> 
    }) {
    const [swiper, setSwiper] = useState<SwiperType | undefined>();

    // slide to current course when it changes
    // current slide moves to first slide
    useEffect(() => {
        if(swiper) { swiper?.slideTo(0) }
    }, [swiper, currentUserCourse])
    
    return (
        <div
            className='w-full max-h-96 max-w-full py-4 backdrop-blur relative overflow-auto'
        >
            <Swiper
                spaceBetween={25}
                slidesPerView={3}
                loop={false}
                simulateTouch
                onSwiper={setSwiper}
                className=' w-full h-full max-w-full overflow-x-scroll'
            >
                {[currentUserCourse, ...userCourses.filter((uc) => uc.course.id !== currentUserCourse.course.id )].map((userCourse) => (
                    <SwiperSlide className=' w-fit min-h-full' key={userCourse.course.id}>
                        <CourseButton 
                            onPress={() => setCurrentUserCourse(userCourse)} 
                            course={userCourse.course}
                            active={userCourse.course.id === currentUserCourse.course.id} 
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}