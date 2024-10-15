import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";

import Icon from "../Icon";
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
    const [isAdmin, setIsAdmin] = useState(false);

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
        setIsAdmin(userCourses && userCourses.find((userCourse) => userCourse.course.id === course.id && userCourse.is_admin) ? true : false);
    }, [setIsJoined, userCourses, course, isJoined])

    return (
    <>
        <Card className={` dark min-h-48 ${isSmall && "min-h-32 max-h-32"} `}>
            <CardHeader className="m-0 pb-0 font-bold">{course.abbreviation}</CardHeader>
            <CardBody className="flex flex-col pb-0">
                { !isSmall && <span className=" text-tiny font-semibold">{course.title}</span>}
                {course.institution && <Chip size="sm" >{course.institution?.abbreviation}</Chip>}
               {!isSmall &&  <span>{course.description}</span>}
            </CardBody>
            {!noInteraction && (
                <CardFooter className="flex w-full items-center justify-between">
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
                    { isAdmin && !isSmall &&
                        <Link href={`/course/edit/${course.id}`}>
                            <Button 
                                variant="faded" 
                                color="warning"
                                startContent={<Icon downscale color="warning" filled>edit</Icon>}
                            >
                                Edit
                            </Button>
                        </Link>
                    }
                </CardFooter>
            )}
        </Card>    
    </>
    )
}