"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Chip } from "@nextui-org/chip";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

import { Button } from "@/components/utils/Button";
import Icon from "../utils/Icon";
import BlurModal from "../utils/BlurModal";
import { Course } from "@/types/db";
import { getOwnCourseVote, joinCourse, leaveCourse, upvoteCourse } from "@/utils/supabase/courses";

import { useUserCourses } from "@/hooks/SharedUserCourses";

export default function CourseCard ({ 
    course, userID,
} : { 
    course: Course, userID?: string,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { userCourses, setUserCourses } = useUserCourses();

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
            fetchVote(userID, course.id).then((res) => {
                setIsUpvoted(res)
            });
        }
        
    }, [userID, course.id])

    return (
    <>
        <Card
            onClick={() => setIsModalOpen(true)} 
            className={`text-gray-700 dark:text-gray-100`}
        >
            <CardHeader className="pb-2">
                <CardDescription>{course.title}</CardDescription>
                <CardTitle>{course.abbreviation}</CardTitle>
                
            </CardHeader>

            <CardContent className="prose dark:prose-invert prose-p:m-0 py-0">
                <p>{course.description}</p>
            </CardContent>

            <CardFooter className="flex items-center gap-2 pt-2 flex-wrap">
                <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>people</Icon>}>
                    {course.members}
                </Chip>
                <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>favorite</Icon>}>
                    {course.votes}
                </Chip>
                {course.category &&
                    <Chip startContent={<Icon downscale>folder</Icon>} variant="flat" color="secondary" size="sm" className="text-tiny ">
                        {course.category?.title}
                    </Chip>
                }
                {course.tags && course.tags.map((tag, index) => (
                    <Chip startContent={<Icon downscale>tag</Icon>} key={index} variant="flat" color="secondary" size="sm" className="text-tiny">
                        {tag.title}
                    </Chip>
                ))}
            </CardFooter>
            
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
                <div className="flex flex-row items-center gap-2 flex-wrap">
                    <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>people</Icon>}>
                        {course.members}
                    </Chip>
                    <Chip variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon filled downscale>favorite</Icon>}>
                        {course.votes}
                    </Chip>
                    {course.category &&
                        <Chip startContent={<Icon downscale>folder</Icon>} variant="flat" color="secondary" size="sm" className="text-tiny ">
                            {course.category?.title}
                        </Chip>
                    }
                    {course.tags && course.tags.map((tag, index) => (
                        <Chip startContent={<Icon downscale>tag</Icon>} key={index} variant="flat" color="secondary" size="sm" className="text-tiny">
                            {tag.title}
                        </Chip>
                    ))}
                    <Chip  variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon downscale filled>flag</Icon>}>{course.topics_count}</Chip>
                    <Chip  variant="flat" color="secondary" size="sm" className="text-tiny" startContent={<Icon downscale filled>question_mark</Icon>}>{course.questions_count}</Chip>
                </div>
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
                { isAdmin &&
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
                <Link href={`/course/${course.id}`}>
                    <Button
                        variant="flat"
                        color="secondary"
                        startContent={<Icon downscale color="secondary" filled>open_in_new</Icon>}
                    >
                        Details
                    </Button>
                </Link>
            </>
            }
        />
    </>
    )
}