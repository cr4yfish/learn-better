import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";  

import { Button } from "@/components/utils/Button";
import Icon from "../utils/Icon";
import { Course, User_Course } from "@/types/db";
import { joinCourse, leaveCourse } from "@/functions/supabase/courses";




export default function CourseCard ({ 
    course, userCourses, isSmall=false, userID, setUserCourses
} : { 
    course: Course, userCourses?: User_Course[], isSmall?: boolean, userID?: string,
    setUserCourses?: (courses: User_Course[]) => void,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const handleJoinCourse = async (course: Course) => {
        if(!userID  || !setUserCourses) return;
        setIsLoading(true);

        const res = await joinCourse(course.id, userID);
        if(userCourses && res) {
            setUserCourses([...userCourses, res]);
            setIsJoined(true);
        }
       
        setIsLoading(false);
        onClose();
    }

    const handleLeaveCourse = async (course: Course) => {
        if(!userID  || !setUserCourses) return;
        setIsLoading(true);

        const confirm = window.confirm("Are you sure you want to leave this course?");
        if(confirm) {
            const res = await leaveCourse(course.id, userID);
            if(userCourses && res) {
                setUserCourses(userCourses.filter((userCourse) => userCourse.course.id !== course.id));
                setIsJoined(false);
            }
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
        <Card 
            isPressable onClick={onOpen} 
            className={`h-32 ${isSmall && "h-24 w-24"} `}
            classNames={{
                base: "overflow-y-hidden",
            }}
        >
            <CardHeader className="m-0 pb-0 font-bold overflow-y-hidden">{course.abbreviation}</CardHeader>
            <CardBody className="flex flex-col pb-0 overflow-y-hidden">
                { !isSmall && <span className=" text-tiny font-semibold">{course.title}</span>}
               {!isSmall &&  <span>{course.description}</span>}
            </CardBody>
        </Card>    
        <Modal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>{course?.title}</ModalHeader>
                <ModalBody>
                    <p>{course?.description}</p>
                </ModalBody>
                <ModalFooter>
                    <Button isDisabled={isLoading} onClick={onClose} color="warning" variant="light">Close</Button>
                    { isJoined ?
                        <Button 
                            variant="light" 
                            color="danger" 
                            onClick={() => handleLeaveCourse(course)}
                            isLoading={isLoading}
                        >
                            Leave Course
                        </Button>
                        :
                        <Button 
                            variant="shadow" 
                            color="primary" 
                            onClick={()=> handleJoinCourse(course)}
                            isLoading={isLoading}
                        >
                            Join Course
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
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    )
}