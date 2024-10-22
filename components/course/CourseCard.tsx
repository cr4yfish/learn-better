import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

import { Button } from "@/components/utils/Button";
import Icon from "../utils/Icon";
import BlurModal from "../utils/BlurModal";
import { Course, User_Course } from "@/types/db";
import { getOwnCourseVote, joinCourse, leaveCourse, upvoteCourse } from "@/functions/supabase/courses";
import { Chip } from "@nextui-org/chip";




export default function CourseCard ({ 
    course, userCourses, isSmall=false, userID, setUserCourses
} : { 
    course: Course, userCourses?: User_Course[], isSmall?: boolean, userID?: string,
    setUserCourses?: (courses: User_Course[]) => void,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleJoinCourse = async (course: Course) => {
        if(!userID  || !setUserCourses) return;
        setIsLoading(true);

        const res = await joinCourse(course.id, userID);
        if(userCourses && res) {
            setUserCourses([...userCourses, res]);
            setIsJoined(true);
        }
       
        setIsLoading(false);
        setIsModalOpen(false);
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

    const handleUpvoteCourse = async (course: Course) => {
        if(!userID  || !setUserCourses) return;
        setIsVoting(true);

        const res = await upvoteCourse(course.id, userID);

        if(userCourses && res) {
            setUserCourses(userCourses.map((userCourse) => {
                if(userCourse.course.id === course.id) {
                    return {...userCourse, upvote: true}
                }
                return userCourse;
            }));
            setIsUpvoted(true);
        }
       
        setIsVoting(false);
    }

    // startup
    useEffect(() => {
        setIsJoined(userCourses && userCourses.find((userCourse) => userCourse.course.id === course.id) ? true : false);
        setIsAdmin(userCourses && userCourses.find((userCourse) => userCourse.course.id === course.id && userCourse.is_admin) ? true : false);
    }, [setIsJoined, userCourses, course, isJoined])

    useEffect(() => {
        const fetchVote = async (user: string, course: string) => {
            const res = await getOwnCourseVote(course, user);
            return res ? true : false
        };

        if(userID && course.id) {
            fetchVote(userID, course.id).then((res) => setIsUpvoted(res));
        }
        
    }, [userID, course.id])

    return (
    <>
        <Card
            isPressable onClick={() => setIsModalOpen(true)} 
            className={`h-32 ${isSmall && "h-30 w-24"} `}
            classNames={{
                base: "overflow-y-hidden bg-content1/60 backdrop-blur",
            }}
        >
            <CardHeader className="m-0 pb-0 font-bold overflow-y-hidden flex items-center justify-between">
                <span>{course.abbreviation}</span>
                {!isSmall && 
                    <Chip 
                        color="secondary" variant="light"
                        className="w-fit" size="sm"
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon downscale filled={isUpvoted}>favorite</Icon>
                        </div>
                        
                    </Chip>
                }
            </CardHeader>
            <CardBody className="flex flex-col pb-4 overflow-y-hidden">
                {!isSmall && <span className=" text-tiny font-semibold">{course.title}</span>}
                {!isSmall && <span>{course.description}</span>}
                {isSmall &&
                    <div className="flex flex-col gap-2">
                        <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>people</Icon>}>TBD</Chip>
                        <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>favorite</Icon>}>TBD</Chip>
                    </div>
                }
            </CardBody>
            {!isSmall &&
                <CardFooter>
                    <div className="flex items-center justify-between gap-4">
                        <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>people</Icon>}>TBD</Chip>
                        <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>favorite</Icon>}>TBD</Chip>
                    </div>
                </CardFooter>
            }
        </Card>

        <BlurModal 
            isOpen={isModalOpen}
            settings={{
                hasHeader: true,
                hasBody: true,
                hasFooter: true,
            }}
            updateOpen={setIsModalOpen}
            header={
                <div className="w-full flex items-center justify-between pr-4">
                    <span className="font-bold">{course?.abbreviation}</span>
                    <Button 
                        onClick={() => handleUpvoteCourse(course)} 
                        isLoading={isVoting} 
                        variant="flat" color="danger" isIconOnly
                    >
                            <Icon filled={isUpvoted}>favorite</Icon>
                    </Button>
                </div>
            }
            body={
            <>
                <p className="font-semibold">{course?.title}</p>
                <p>{course?.description}</p>
            </>
            }
            footer={
            <>
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
                            variant="flat" 
                            color="warning"
                            startContent={<Icon downscale color="warning" filled>edit</Icon>}
                        >
                            Edit
                        </Button>
                    </Link>
                }
            </>
            }
        />
    </>
    )
}