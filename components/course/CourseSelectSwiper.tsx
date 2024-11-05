import { ScrollShadow } from '@nextui-org/scroll-shadow';

import CourseButton from './CourseButton';
import { Course } from '@/types/db';

export default function CourseSelectSwiper({ 
    courses, currentCourse, setCurrentCourse } : 
    { 
        courses: Course[], currentCourse: Course | undefined, 
        setCurrentCourse: (course: Course) => void,
    }) {

    return (
        <ScrollShadow  className='w-full max-h-96 max-w-full py-4 relative overflow-auto' >
            <div className=' relative flex flex-col gap-4 items-center w-full h-full max-w-full overflow-y-auto' >
                {[currentCourse, ...courses.filter((course) => course.id !== currentCourse?.id )].map((course, index) => (
                    course && 
                        <CourseButton 
                            key={index}
                            onPress={() => course && setCurrentCourse(course)} 
                            course={course}
                            active={course?.id === currentCourse?.id} 
                        />
                ))}
            </div>
        </ScrollShadow>
    )
}