import { useEffect, useState } from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";

import { Course, User_Course } from "@/types/db";
import { joinCourse, leaveCourse } from "@/functions/client/supabase";




export default function CourseCard ({ 
    course, userCourses, isSmall=false, userID, setUserCourses, noInteraction=false
} : { 
    course: Course, userCourses?: User_Course[], isSmall?: boolean, userID?: string,
    setUserCourses?: (courses: User_Course[]) => void,
    noInteraction?: boolean
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    const handleJoinCourse = async (course: Course) => {
        if(!userID  || !setUserCourses) return;
        setIsLoading(true);

        const res = await joinCourse(course.id, userID);
        if(userCourses && res) {
            setUserCourses([...userCourses, res]);
            setIsJoined(true);
        }
       
        setIsLoading(false);
    }

    const handleLeaveCourse = async (course: Course) => {
        if(!userID  || !setUserCourses) return;
        setIsLoading(true);
        const res = await leaveCourse(course.id, userID);
        if(userCourses && res) {
            setUserCourses(userCourses.filter((userCourse) => userCourse.course.id !== course.id));
            setIsJoined(false);
        }
        setIsLoading(false);
    }

    // startup
    useEffect(() => {
        setIsJoined(userCourses && userCourses.find((userCourse) => userCourse.course.id === course.id) ? true : false);
    }, [setIsJoined, userCourses, course, isJoined])

    return (
    <>
        <Card className={` dark  ${isSmall && "min-h-full"} `}>
            <CardHeader className="m-0 pb-0 font-bold">{course.abbreviation}</CardHeader>
            <CardBody className="flex flex-col pb-0">
                { !isSmall && <span className=" text-tiny font-semibold">{course.title}</span>}
                {course.institution && <Chip size="sm" >{course.institution?.abbreviation}</Chip>}
               {!isSmall &&  <span>{course.description}</span>}
            </CardBody>
            {!noInteraction && (
                <CardFooter className="flex">
                    { isJoined ?
                        <Button 
                            variant="light" 
                            color="danger" 
                            onClick={() => handleLeaveCourse(course)}
                            isLoading={isLoading}
                        >
                            Leave
                        </Button>
                        :
                        <Button 
                            variant="shadow" 
                            color="primary" 
                            onClick={()=> handleJoinCourse(course)}
                            isLoading={isLoading}
                        >
                            Join
                        </Button>
                    }
                </CardFooter>
            )}
        </Card>    
    </>
    )
}